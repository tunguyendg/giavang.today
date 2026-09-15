import { useEffect, useMemo, useState } from 'react';
import {
  Pencil,
  Plus,
  Trash2,
  WalletCards,
  X,
} from 'lucide-react';

import { API_URL } from '../config/api.js';

import {
  TYPES,
  getPrice,
  normalizeOne,
} from '../services/goldApi.js';

const options = TYPES.filter(
  ([code]) => code !== 'XAUUSD'
);

const defaultForm = {
  type: 'SJL1L10',
  qty: '1',
  cost: '140000000',
};

const vi = (number) =>
  new Intl.NumberFormat('vi-VN').format(
    Number(number || 0)
  );

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [prices, setPrices] = useState({});

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(defaultForm);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const token =
          localStorage.getItem(
            'giavang_token'
          );

        if (!token) {
          return;
        }

        const response = await fetch(
          `${API_URL}/api/portfolio`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            'Load portfolio failed:',
            data.message
          );
          return;
        }

        setItems(data.items);
      } catch (error) {
        console.error(
          'Load portfolio error:',
          error
        );
      }
    }

    loadPortfolio();
  }, []);

  useEffect(() => {
    async function loadPrices() {
      const arr = await Promise.all(
        options.map(([code]) =>
          getPrice(code)
            .then((response) => [
              code,
              normalizeOne(
                response,
                code
              ),
            ])
            .catch(() => [
              code,
              null,
            ])
        )
      );

      setPrices(
        Object.fromEntries(arr)
      );
    }

    loadPrices();

    const interval = setInterval(
      loadPrices,
      5 * 60 * 1000
    );

    return () =>
      clearInterval(interval);
  }, []);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const currentPrice =
          prices[item.type]?.buy || 0;

        const quantity =
          Number(item.qty);

        const buyPrice =
          Number(item.cost);

        acc.value +=
          currentPrice * quantity;

        acc.cost +=
          buyPrice * quantity;

        return acc;
      },
      {
        value: 0,
        cost: 0,
      }
    );
  }, [items, prices]);

  const pnl =
    totals.value - totals.cost;

  const pct =
    totals.cost > 0
      ? (pnl / totals.cost) * 100
      : 0;

  function resetForm() {
    setEditingId(null);
    setForm(defaultForm);
  }

  function startEdit(item) {
    setEditingId(item._id);

    setForm({
      type: item.type,
      qty: String(item.qty),
      cost: String(item.cost),
    });
  }

  async function addItem() {
    const token =
      localStorage.getItem(
        'giavang_token'
      );

    if (!token) {
      alert(
        'Vui lòng đăng nhập trước.'
      );
      return;
    }

    const response = await fetch(
      `${API_URL}/api/portfolio`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          type: form.type,
          qty: Number(form.qty),
          cost: Number(form.cost),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        'Không thể thêm vàng vào danh mục.'
      );
    }

    setItems((currentItems) => [
      ...currentItems,
      data.item,
    ]);

    resetForm();
  }

  async function updateItem() {
    const token =
      localStorage.getItem(
        'giavang_token'
      );

    if (!token) {
      alert(
        'Vui lòng đăng nhập trước.'
      );
      return;
    }

    const response = await fetch(
      `${API_URL}/api/portfolio/${editingId}`,
      {
        method: 'PUT',

        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          type: form.type,
          qty: Number(form.qty),
          cost: Number(form.cost),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        'Không thể cập nhật danh mục.'
      );
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item._id === editingId
          ? data.item
          : item
      )
    );

    resetForm();
  }

  async function submitForm(e) {
    e.preventDefault();

    try {
      if (editingId) {
        await updateItem();
      } else {
        await addItem();
      }
    } catch (error) {
      console.error(
        'Portfolio submit error:',
        error
      );

      alert(
        error.message ||
        'Không thể kết nối đến hệ thống.'
      );
    }
  }

  async function removeItem(id) {
    try {
      const token =
        localStorage.getItem(
          'giavang_token'
        );

      if (!token) {
        alert(
          'Vui lòng đăng nhập trước.'
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/api/portfolio/${id}`,
        {
          method: 'DELETE',

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          'Không thể xóa vàng khỏi danh mục.'
        );
        return;
      }

      setItems((currentItems) =>
        currentItems.filter(
          (item) =>
            item._id !== id
        )
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(
        'Delete portfolio error:',
        error
      );

      alert(
        'Không thể kết nối đến hệ thống. Vui lòng thử lại.'
      );
    }
  }

  return (
    <section className="container page-stack">
      <div className="page-title">
        <div>
          <span className="eyebrow">
            DANH MỤC CÁ NHÂN
          </span>

          <h1>Vàng của tôi</h1>

          <p>
            Theo dõi giá trị danh mục
            vàng và lãi/lỗ theo giá thị
            trường hiện tại.
          </p>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <span>
            Giá trị hiện tại
          </span>

          <strong>
            {vi(totals.value)}₫
          </strong>
        </div>

        <div className="summary-card">
          <span>Tổng vốn</span>

          <strong>
            {vi(totals.cost)}₫
          </strong>
        </div>

        <div
          className={`summary-card ${pnl >= 0
            ? 'profit'
            : 'loss'
            }`}
        >
          <span>Lãi / lỗ</span>

          <strong>
            {pnl >= 0 ? '+' : ''}
            {vi(pnl)}₫
          </strong>

          <small>
            {pct >= 0 ? '+' : ''}
            {pct.toFixed(2)}%
          </small>
        </div>
      </div>

      <p className="muted">
        Giá trị hiện tại được ước tính
        theo giá mua vào của từng loại
        vàng.
      </p>

      <div className="two-col">
        <div className="section-card">
          <div className="section-head">
            <div>
              <span className="eyebrow">
                TÀI SẢN
              </span>

              <h2>Danh mục</h2>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="empty-state">
              <WalletCards size={38} />

              <h3>Chưa có vàng</h3>

              <p>
                Thêm giao dịch đầu tiên
                để bắt đầu tính lãi/lỗ.
              </p>
            </div>
          ) : (
            <div className="holdings">
              {items.map((item) => {
                const currentPrice =
                  prices[item.type]
                    ?.buy || 0;

                const quantity =
                  Number(item.qty);

                const buyPrice =
                  Number(item.cost);

                const cost =
                  buyPrice *
                  quantity;

                const value =
                  currentPrice *
                  quantity;

                const delta =
                  value - cost;

                const deltaPct =
                  cost > 0
                    ? (delta /
                      cost) *
                    100
                    : 0;

                const goldName =
                  options.find(
                    ([code]) =>
                      code ===
                      item.type
                  )?.[1] ||
                  item.type;

                return (
                  <div
                    className="holding"
                    key={item._id}
                  >
                    <div>
                      <strong>
                        {goldName}
                      </strong>

                      <small>
                        {quantity}{' '}
                        lượng · vốn{' '}
                        {vi(
                          buyPrice
                        )}
                        ₫/lượng
                      </small>

                      <small>
                        Giá hiện tại{' '}
                        {vi(
                          currentPrice
                        )}
                        ₫/lượng
                      </small>
                    </div>

                    <div>
                      <strong>
                        {vi(value)}₫
                      </strong>

                      <small
                        className={
                          delta >= 0
                            ? 'green'
                            : 'red'
                        }
                      >
                        {delta >= 0
                          ? '+'
                          : ''}
                        {vi(delta)}₫ ·{' '}
                        {deltaPct >= 0
                          ? '+'
                          : ''}
                        {deltaPct.toFixed(
                          2
                        )}
                        %
                      </small>
                    </div>

                    <div className="holding-actions">
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Sửa danh mục"
                        onClick={() => startEdit(item)}
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        className="icon-btn danger"
                        aria-label="Xóa khỏi danh mục"
                        onClick={() => removeItem(item._id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form
          className="section-card form-card"
          onSubmit={submitForm}
        >
          <span className="eyebrow">
            {editingId
              ? 'CHỈNH SỬA'
              : 'THÊM VÀNG'}
          </span>

          <h2>
            {editingId
              ? 'Cập nhật danh mục'
              : 'Thêm vào danh mục'}
          </h2>

          <label>
            Loại vàng

            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type:
                    e.target.value,
                })
              }
            >
              {options.map(
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
          </label>

          <label>
            Số lượng (lượng)

            <input
              type="number"
              min="0.1"
              step="0.1"
              required
              value={form.qty}
              onChange={(e) =>
                setForm({
                  ...form,
                  qty:
                    e.target.value,
                })
              }
            />
          </label>

          <label>
            Giá mua / lượng

            <input
              type="text"
              inputMode="numeric"
              required
              value={
                form.cost
                  ? vi(form.cost)
                  : ''
              }
              onChange={(e) => {
                const rawValue =
                  e.target.value.replace(/\D/g, '');

                setForm({
                  ...form,
                  cost: rawValue,
                });
              }}
            />
          </label>

          <div className="form-actions">
            <button
              className="primary-btn"
              type="submit"
            >
              {editingId ? (
                <>
                  <Pencil size={17} />
                  Cập nhật
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Thêm vàng
                </>
              )}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
              >
                <X size={17} />
                Hủy chỉnh sửa
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}