import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Clock3,
  RefreshCcw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import {
  TYPES,
  getPrice,
  getHistory,
  normalizeOne,
  parseHistory,
} from '../services/goldApi.js';
import Seo from '../seo/Seo.jsx';
import { websiteSchema } from '../seo/schema.js';

const domestic = TYPES.filter(
  ([code]) => code !== 'XAUUSD'
);

const goldPages = [
  {
    title: 'Giá vàng SJC',
    description:
      'Giá mua vào, bán ra, spread và lịch sử giá vàng SJC.',
    path: '/gia-vang-sjc',
  },
  {
    title: 'Giá vàng nhẫn 9999',
    description:
      'Theo dõi giá vàng nhẫn 9999 và biến động mới nhất.',
    path: '/gia-vang-nhan-9999',
  },
  {
    title: 'Giá vàng PNJ',
    description:
      'Giá vàng PNJ, lịch sử và chênh lệch mua bán.',
    path: '/gia-vang-pnj',
  },
  {
    title: 'Giá vàng DOJI',
    description:
      'Theo dõi giá vàng DOJI và biến động trong ngày.',
    path: '/gia-vang-doji',
  },
  {
    title: 'Giá vàng thế giới',
    description:
      'Giá XAU/USD theo USD/oz và lịch sử giá vàng quốc tế.',
    path: '/gia-vang-the-gioi',
  },
  {
    title: 'Giá vàng 24K',
    description:
      'Giá vàng 24K mua vào, bán ra và lịch sử biến động.',
    path: '/gia-vang-24k',
  },
  {
    title: 'Giá vàng 18K',
    description:
      'Giá vàng 18K tham khảo theo hàm lượng vàng 75%.',
    path: '/gia-vang-18k',
  },
];

const vi = (number) =>
  new Intl.NumberFormat('vi-VN').format(
    Number(number || 0)
  );

const usd = (number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(number || 0));

function Change({ value }) {
  const number = Number(value || 0);
  const isUp = number > 0;

  return (
    <span
      className={`change ${number === 0
        ? 'flat'
        : isUp
          ? 'up'
          : 'down'
        }`}
    >
      {number === 0 ? (
        '—'
      ) : isUp ? (
        <TrendingUp size={15} />
      ) : (
        <TrendingDown size={15} />
      )}

      {number > 0 ? '+' : ''}
      {vi(number)}
    </span>
  );
}

export default function Home() {
  const [world, setWorld] = useState(null);
  const [rows, setRows] = useState([]);
  const [history, setHistory] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState('');
  const [selectedType, setSelectedType] =
    useState('SJL1L10');

  const selectedName =
    TYPES.find(
      ([code]) => code === selectedType
    )?.[1] || selectedType;

  async function load() {
    setLoading(true);

    try {
      const [worldResponse, ...domesticResponses] =
        await Promise.all([
          getPrice('XAUUSD'),
          ...domestic.map(([code]) =>
            getPrice(code)
          ),
        ]);

      setWorld(
        normalizeOne(
          worldResponse,
          'XAUUSD'
        )
      );

      setRows(
        domesticResponses.map(
          (response, index) =>
            normalizeOne(
              response,
              domestic[index][0]
            )
        )
      );

      setUpdated(
        new Date().toLocaleTimeString(
          'vi-VN',
          {
            hour: '2-digit',
            minute: '2-digit',
          }
        )
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();

    const interval = setInterval(
      load,
      5 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getHistory(selectedType, days)
      .then((response) =>
        setHistory(
          parseHistory(
            response,
            selectedType
          )
        )
      )
      .catch(() => setHistory([]));
  }, [days, selectedType]);

  const hero =
    rows.find(
      (item) =>
        item.type_code === 'SJL1L10'
    ) || rows[0];

  return (
    <>
      <Seo
        title="Giá vàng hôm nay"
        description="Cập nhật giá vàng SJC, PNJ, DOJI, vàng nhẫn, giá vàng trong nước và giá vàng thế giới mới nhất tại giavang.today."
        path="/"
        image="/og/home.jpg"
        schema={websiteSchema()}
      />

      <section className="hero-wrap container">
        <div className="page-title">
          <div>
            <span className="eyebrow">
              CẬP NHẬT 5 PHÚT / LẦN
            </span>

            <h1>Giá vàng hôm nay</h1>

            <p>
              Theo dõi giá vàng thế giới và
              các loại vàng phổ biến tại
              Việt Nam.
            </p>
          </div>

          <button
            className="ghost-btn"
            onClick={load}
            disabled={loading}
          >
            <RefreshCcw size={16} />
            {loading
              ? 'Đang cập nhật'
              : 'Làm mới'}
          </button>
        </div>

        <div className="hero-grid">
          <article className="hero-card world-card">
            <div className="icon-bubble">
              🌍
            </div>

            <span>Vàng thế giới</span>

            <h2>
              $
              {usd(
                world?.buy ||
                world?.sell
              )}
            </h2>

            <small>
              XAU/USD · USD/oz
            </small>

            <Change
              value={
                world?.change_buy ||
                world?.change_sell
              }
            />
          </article>

          <article className="hero-card sjc-card">
            <div className="icon-bubble">
              🪙
            </div>

            <span>
              {hero?.name || 'SJC 9999'}
            </span>

            <div className="split-price">
              <div>
                <small>Mua vào</small>
                <h3>
                  {vi(hero?.buy)}₫
                </h3>
              </div>

              <div>
                <small>Bán ra</small>
                <h3>
                  {vi(hero?.sell)}₫
                </h3>
              </div>
            </div>

            <div className="hero-meta">
              <Clock3 size={14} />
              Cập nhật{' '}
              {updated || '--:--'}
            </div>
          </article>

          <article className="hero-card alert-cta">
            <div className="icon-bubble">
              <Bell size={20} />
            </div>

            <span>Cảnh báo giá</span>

            <h3>
              Không cần theo dõi liên tục
            </h3>

            <p>
              Chọn mức giá bạn quan tâm và
              nhận thông báo khi giá chạm
              ngưỡng.
            </p>

            <Link
              className="primary-btn"
              to="/alerts"
            >
              Tạo cảnh báo
            </Link>
          </article>
        </div>
      </section>

      <section className="container section-card">
        <div className="section-head">
          <div>
            <span className="eyebrow">
              BẢNG GIÁ
            </span>

            <h2>
              Giá vàng trong nước
            </h2>
          </div>

          <div className="status-dot">
            ●{' '}
            {loading
              ? 'Đang cập nhật'
              : 'Đã cập nhật'}
          </div>
        </div>

        <div className="price-table-wrap">
          <table className="price-table">
            <thead>
              <tr>
                <th>Loại vàng</th>
                <th>Mua vào</th>
                <th>Bán ra</th>
                <th>Biến động</th>
                <th>Cập nhật</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={
                    row.type_code ||
                    index
                  }
                >
                  <td>
                    <strong>
                      {row.name ||
                        domestic[index]?.[1] ||
                        row.type_code}
                    </strong>

                    <small>
                      {row.type_code}
                    </small>
                  </td>

                  <td>
                    {vi(row.buy)}₫
                    <Change
                      value={
                        row.change_buy
                      }
                    />
                  </td>

                  <td>
                    {vi(row.sell)}₫
                    <Change
                      value={
                        row.change_sell
                      }
                    />
                  </td>

                  <td>
                    <span
                      className={`trend-pill ${Number(
                        row.change_sell
                      ) < 0
                        ? 'negative'
                        : Number(
                          row.change_sell
                        ) > 0
                          ? 'positive'
                          : ''
                        }`}
                    >
                      {Number(
                        row.change_sell
                      ) < 0
                        ? 'Giảm'
                        : Number(
                          row.change_sell
                        ) > 0
                          ? 'Tăng'
                          : 'Không đổi'}
                    </span>
                  </td>

                  <td>
                    {row.time ||
                      updated ||
                      '--:--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SEO GOLD HUB */}
      <section className="container section-card">
        <div className="section-head">
          <div>
            <span className="eyebrow">
              KHÁM PHÁ
            </span>

            <h2>
              Theo dõi các loại giá vàng
            </h2>

            <p>
              Xem chi tiết giá mua bán, biến động,
              lịch sử và thông tin của từng loại vàng
              phổ biến trên giavang.today.
            </p>
          </div>
        </div>

        <div className="gold-hub-grid">
          {goldPages.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="gold-hub-card"
            >
              <strong>
                {item.title}
              </strong>

              <span>
                {item.description}
              </span>

              <small>
                Xem chi tiết →
              </small>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section-card">
        <div className="section-head">
          <div className="history-title">
            <span className="eyebrow">
              LỊCH SỬ
            </span>

            <h2>
              Biểu đồ {selectedName}
            </h2>

            <div className="gold-select-wrap">
              <select
                className="gold-select"
                value={selectedType}
                onChange={(event) =>
                  setSelectedType(
                    event.target.value
                  )
                }
              >
                {domestic.map(
                  ([code, name]) => (
                    <option
                      key={code}
                      value={code}
                    >
                      {name}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="segmented">
            {[1, 7, 30].map(
              (dayCount) => (
                <button
                  key={dayCount}
                  className={
                    days === dayCount
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setDays(dayCount)
                  }
                >
                  {dayCount} ngày
                </button>
              )
            )}
          </div>
        </div>

        <div className="chart-box">
          {history.length ? (
            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <LineChart
                data={history}
              >
                <XAxis
                  dataKey="label"
                  tick={{
                    fill: '#9da4bf',
                    fontSize: 12,
                  }}
                />

                <YAxis
                  hide
                  domain={[
                    'auto',
                    'auto',
                  ]}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="sell"
                  stroke="#f3c21b"
                  strokeWidth={3}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="buy"
                  stroke="#56d0a4"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              Chưa có dữ liệu lịch sử
              cho khoảng thời gian này.
            </div>
          )}
        </div>
      </section>
    </>
  );
}