import { useEffect, useMemo, useState } from 'react';
import {
    Link,
    Navigate,
    useParams,
} from 'react-router-dom';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';

import Seo from '../seo/Seo.jsx';

import {
    getPrice,
    getHistory,
    normalizeOne,
    parseHistory,
} from '../services/goldApi.js';

import {
    goldSeoPages,
} from '../data/goldSeoPages.js';

import { goldPageSchema } from '../seo/schema.js';
import Breadcrumb from '../components/Breadcrumb.jsx';

const vi = (number) =>
    new Intl.NumberFormat('vi-VN', {
        maximumFractionDigits: 2,
    }).format(
        Number(number || 0)
    );

export default function GoldDetail() {
    const { slug } = useParams();

    const page = Object.values(
        goldSeoPages
    ).find(
        (item) =>
            item.slug === slug
    );

    const [price, setPrice] =
        useState(null);

    const [history, setHistory] =
        useState([]);

    const [days, setDays] =
        useState(30);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        if (!page) {
            return;
        }

        async function loadPrice() {
            try {
                setLoading(true);

                const response =
                    await getPrice(
                        page.type
                    );

                setPrice(
                    normalizeOne(
                        response,
                        page.type
                    )
                );
            } catch (error) {
                console.error(
                    'Load gold detail error:',
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        loadPrice();

        const interval = setInterval(
            loadPrice,
            5 * 60 * 1000
        );

        return () =>
            clearInterval(interval);
    }, [page]);

    useEffect(() => {
        if (!page) {
            return;
        }

        getHistory(
            page.type,
            days
        )
            .then((response) =>
                setHistory(
                    parseHistory(
                        response,
                        page.type
                    )
                )
            )
            .catch(() =>
                setHistory([])
            );
    }, [page, days]);

    const isSinglePrice =
        page?.priceMode === 'single';

    const mainPriceField =
        page?.priceField || 'sell';

    const formatPrice = (
        value,
        unit = '₫'
    ) => {
        return `${vi(value)} ${unit}`.trim();
    };

    const mainPrice =
        Number(
            price?.[
            mainPriceField
            ] || 0
        );
    const priceMultiplier =
        Number(
            page?.priceMultiplier || 1
        );

    const displayBuy =
        Number(price?.buy || 0) *
        priceMultiplier;

    const displaySell =
        Number(price?.sell || 0) *
        priceMultiplier;

    const spread = useMemo(() => {
        if (isSinglePrice) {
            return 0;
        }

        return (
            displaySell -
            displayBuy
        );
    }, [
        price,
        isSinglePrice,
    ]);

    const spreadPercent = useMemo(() => {
        if (isSinglePrice) {
            return 0;
        }

        const sell =
            displaySell;

        if (!sell) {
            return 0;
        }

        return (
            (spread / sell) *
            100
        );
    }, [
        price,
        spread,
        isSinglePrice,
    ]);

    const priceChange =
        Number(
            isSinglePrice
                ? price?.change_buy ??
                price?.change_sell ??
                0
                : (price?.change_sell || 0) *
                priceMultiplier
        );

    const periodStats = useMemo(() => {
        if (!history.length) {
            return null;
        }

        const values = history
            .map((item) =>
                Number(
                    item[
                    isSinglePrice
                        ? mainPriceField
                        : 'sell'
                    ]
                ) *
                (isSinglePrice
                    ? 1
                    : priceMultiplier)
            )
            .filter(
                (value) =>
                    Number.isFinite(
                        value
                    ) &&
                    value > 0
            );

        if (!values.length) {
            return null;
        }

        const highest =
            Math.max(...values);

        const lowest =
            Math.min(...values);

        const oldestItem =
            history[
            history.length - 1
            ];

        const oldestPrice =
            Number(
                oldestItem?.[
                isSinglePrice
                    ? mainPriceField
                    : 'sell'
                ] || 0
            ) *
            (isSinglePrice
                ? 1
                : priceMultiplier);

        const currentPrice =
            Number(
                isSinglePrice
                    ? mainPrice
                    : displaySell ||
                    (Number(
                        history[0]?.sell ||
                        0
                    ) * priceMultiplier)
            );

        const change =
            currentPrice -
            oldestPrice;

        const changePercent =
            oldestPrice > 0
                ? (change /
                    oldestPrice) *
                100
                : 0;

        return {
            highest,
            lowest,
            range:
                highest - lowest,
            oldestPrice,
            currentPrice,
            change,
            changePercent,
        };
    }, [
        history,
        price,
        mainPrice,
        mainPriceField,
        isSinglePrice,
        displaySell,
        priceMultiplier,
    ]);

    const chartHistory = useMemo(() => {
        if (isSinglePrice) {
            return history;
        }

        return history.map((item) => ({
            ...item,
            buy:
                Number(item.buy || 0) *
                priceMultiplier,
            sell:
                Number(item.sell || 0) *
                priceMultiplier,
        }));
    }, [
        history,
        isSinglePrice,
        priceMultiplier,
    ]);

    const relatedPages =
        page?.related?.filter(
            (relatedItem) =>
                Object.values(
                    goldSeoPages
                ).some(
                    (item) =>
                        `/${item.slug}` ===
                        relatedItem.path
                )
        ) || [];

    if (!page) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return (
        <>
            <Seo
                title={page.title}
                description={
                    page.description
                }
                path={`/${page.slug}`}
                image={page.ogImage}
                schema={goldPageSchema(page)}
            />

            <section className="container page-stack">
                {/* HERO */}
                <Breadcrumb current={page.name} />

                <div className="page-title">
                    <div>
                        <span className="eyebrow">
                            GIÁ VÀNG HÔM NAY
                        </span>

                        <h1>
                            {page.h1}
                        </h1>

                        <p>
                            {page.intro}
                        </p>
                    </div>
                </div>

                {/* GIÁ HIỆN TẠI */}
                <section className="section-card">
                    <span className="eyebrow">
                        GIÁ HIỆN TẠI
                    </span>

                    {isSinglePrice ? (
                        <>
                            <h2>
                                Giá {page.name} hiện tại
                            </h2>

                            <div className="summary-grid">
                                <div className="summary-card">
                                    <span>
                                        Giá XAU/USD
                                    </span>

                                    <strong>
                                        {loading
                                            ? 'Đang tải...'
                                            : formatPrice(
                                                mainPrice,
                                                page.unit
                                            )}
                                    </strong>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2>
                                Giá {page.name} mua vào, bán ra hôm nay
                            </h2>

                            <div className="summary-grid">
                                <div className="summary-card">
                                    <span>
                                        Mua vào
                                    </span>

                                    <strong>
                                        {loading
                                            ? 'Đang tải...'
                                            : formatPrice(
                                                displayBuy
                                            )}
                                    </strong>
                                </div>

                                <div className="summary-card">
                                    <span>
                                        Bán ra
                                    </span>

                                    <strong>
                                        {loading
                                            ? 'Đang tải...'
                                            : formatPrice(
                                                displaySell
                                            )}
                                    </strong>
                                </div>

                                <div className="summary-card">
                                    <span>
                                        Chênh lệch mua bán
                                    </span>

                                    <strong>
                                        {loading
                                            ? 'Đang tải...'
                                            : formatPrice(
                                                spread
                                            )}
                                    </strong>

                                    {!loading && (
                                        <small>
                                            {spreadPercent.toFixed(
                                                2
                                            )}
                                            %
                                        </small>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </section>

                {/* TĂNG / GIẢM */}
                <section className="section-card">
                    <span className="eyebrow">
                        BIẾN ĐỘNG
                    </span>

                    <h2>
                        Giá {page.name} hôm nay tăng hay giảm?
                    </h2>

                    {priceChange === 0 ? (
                        <p>
                            Giá hiện chưa ghi nhận thay đổi
                            so với mốc cập nhật trước.
                        </p>
                    ) : priceChange > 0 ? (
                        <p>
                            Giá {page.name} đang tăng khoảng{' '}
                            <strong>
                                {formatPrice(
                                    priceChange,
                                    isSinglePrice
                                        ? page.unit
                                        : '₫'
                                )}
                            </strong>{' '}
                            so với mốc cập nhật trước.
                        </p>
                    ) : (
                        <p>
                            Giá {page.name} đang giảm khoảng{' '}
                            <strong>
                                {formatPrice(
                                    Math.abs(
                                        priceChange
                                    ),
                                    isSinglePrice
                                        ? page.unit
                                        : '₫'
                                )}
                            </strong>{' '}
                            so với mốc cập nhật trước.
                        </p>
                    )}

                    <p className="muted">
                        Dữ liệu giá được cập nhật định kỳ,
                        vì vậy mức biến động có thể thay đổi
                        trong ngày.
                    </p>
                </section>

                {/* THỐNG KÊ */}
                {periodStats && (
                    <section className="section-card">
                        <span className="eyebrow">
                            THỐNG KÊ
                        </span>

                        <h2>
                            Thống kê giá {page.name} {days} ngày
                        </h2>

                        <p>
                            Tổng hợp biến động giá trong {days} ngày gần nhất.
                        </p>

                        <div className="summary-grid">
                            <div className="summary-card">
                                <span>
                                    Giá đầu kỳ
                                </span>

                                <strong>
                                    {formatPrice(
                                        periodStats.oldestPrice,
                                        isSinglePrice
                                            ? page.unit
                                            : '₫'
                                    )}
                                </strong>
                            </div>

                            <div className="summary-card">
                                <span>
                                    Cao nhất
                                </span>

                                <strong>
                                    {formatPrice(
                                        periodStats.highest,
                                        isSinglePrice
                                            ? page.unit
                                            : '₫'
                                    )}
                                </strong>
                            </div>

                            <div className="summary-card">
                                <span>
                                    Thấp nhất
                                </span>

                                <strong>
                                    {formatPrice(
                                        periodStats.lowest,
                                        isSinglePrice
                                            ? page.unit
                                            : '₫'
                                    )}
                                </strong>
                            </div>

                            <div className="summary-card">
                                <span>
                                    Biên độ
                                </span>

                                <strong>
                                    {formatPrice(
                                        periodStats.range,
                                        isSinglePrice
                                            ? page.unit
                                            : '₫'
                                    )}
                                </strong>
                            </div>

                            <div
                                className={`summary-card ${periodStats.change >= 0
                                    ? 'profit'
                                    : 'loss'
                                    }`}
                            >
                                <span>
                                    Biến động từ đầu kỳ
                                </span>

                                <strong>
                                    {periodStats.change >= 0
                                        ? '+'
                                        : ''}

                                    {formatPrice(
                                        periodStats.change,
                                        isSinglePrice
                                            ? page.unit
                                            : '₫'
                                    )}
                                </strong>

                                <small>
                                    {periodStats.changePercent >= 0
                                        ? '+'
                                        : ''}

                                    {periodStats.changePercent.toFixed(
                                        2
                                    )}
                                    %
                                </small>
                            </div>
                        </div>
                    </section>
                )}

                {/* CHART */}
                <section className="section-card">
                    <div className="section-head">
                        <div>
                            <span className="eyebrow">
                                BIỂU ĐỒ
                            </span>

                            <h2>
                                {page.history.title}
                            </h2>

                            <p>
                                {
                                    page.history
                                        .description
                                }
                            </p>
                        </div>

                        <div className="segmented">
                            {[7, 30].map(
                                (dayCount) => (
                                    <button
                                        key={dayCount}
                                        className={
                                            days ===
                                                dayCount
                                                ? 'active'
                                                : ''
                                        }
                                        onClick={() =>
                                            setDays(
                                                dayCount
                                            )
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
                                    data={chartHistory}
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

                                    {isSinglePrice ? (
                                        <Line
                                            type="monotone"
                                            dataKey={
                                                mainPriceField
                                            }
                                            stroke="#f3c21b"
                                            strokeWidth={3}
                                            dot={false}
                                        />
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart">
                                Chưa có dữ liệu lịch sử.
                            </div>
                        )}
                    </div>
                </section>

                {/* LỊCH SỬ GIÁ */}
                <section className="section-card">
                    <span className="eyebrow">
                        LỊCH SỬ GIÁ
                    </span>

                    <h2>
                        Giá {page.name} gần đây
                    </h2>

                    <p>
                        Một số mốc giá gần nhất giúp bạn
                        quan sát diễn biến của {page.name}.
                    </p>

                    {history.length > 0 && (
                        <div className="price-table-wrap">
                            <table className="price-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Thời gian
                                        </th>

                                        {isSinglePrice ? (
                                            <th>
                                                Giá ({page.unit})
                                            </th>
                                        ) : (
                                            <>
                                                <th>
                                                    Mua vào
                                                </th>

                                                <th>
                                                    Bán ra
                                                </th>
                                            </>
                                        )}
                                    </tr>
                                </thead>

                                <tbody>
                                    {history
                                        .slice(0, 8)
                                        .map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <tr
                                                    key={`${item.label}-${index}`}
                                                >
                                                    <td>
                                                        {
                                                            item.label
                                                        }
                                                    </td>

                                                    {isSinglePrice ? (
                                                        <td>
                                                            {formatPrice(
                                                                item[
                                                                mainPriceField
                                                                ],
                                                                page.unit
                                                            )}
                                                        </td>
                                                    ) : (
                                                        <>
                                                            <td>
                                                                {formatPrice(
                                                                    Number(item.buy || 0) *
                                                                    priceMultiplier
                                                                )}
                                                            </td>

                                                            <td>
                                                                {formatPrice(
                                                                    Number(item.sell || 0) *
                                                                    priceMultiplier
                                                                )}
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            )
                                        )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* SPREAD / COMPARISON */}
                <section className="section-card">
                    <span className="eyebrow">
                        CHÊNH LỆCH GIÁ
                    </span>

                    <h2>
                        {page.spread.title}
                    </h2>

                    <p>
                        {
                            page.spread
                                .description
                        }
                    </p>

                    {!isSinglePrice && (
                        <p>
                            Với mức giá hiện tại, chênh
                            lệch mua bán khoảng{' '}
                            <strong>
                                {formatPrice(
                                    spread
                                )}
                            </strong>
                            , tương đương khoảng{' '}
                            <strong>
                                {spreadPercent.toFixed(
                                    2
                                )}
                                %
                            </strong>{' '}
                            giá bán.
                        </p>
                    )}
                </section>

                {/* KIẾN THỨC */}
                <section className="section-card">
                    <span className="eyebrow">
                        KIẾN THỨC
                    </span>

                    <h2>
                        {page.about.title}
                    </h2>

                    {page.about.paragraphs.map(
                        (
                            paragraph,
                            index
                        ) => (
                            <p key={index}>
                                {paragraph}
                            </p>
                        )
                    )}

                    {page.homeLink && (
                        <p>
                            <Link
                                to={
                                    page.homeLink
                                        .path
                                }
                            >
                                {
                                    page.homeLink
                                        .label
                                }
                            </Link>{' '}
                            để so sánh thêm với các loại vàng khác.
                        </p>
                    )}
                </section>

                {/* SO SÁNH */}
                <section className="section-card">
                    <span className="eyebrow">
                        SO SÁNH
                    </span>

                    <h2>
                        {
                            page.comparison
                                .title
                        }
                    </h2>

                    {page.comparison.paragraphs.map(
                        (
                            paragraph,
                            index
                        ) => (
                            <p key={index}>
                                {paragraph}
                            </p>
                        )
                    )}
                </section>

                {/* NGUỒN DỮ LIỆU */}
                {page.source && (
                    <section className="section-card">
                        <span className="eyebrow">
                            MINH BẠCH DỮ LIỆU
                        </span>

                        <h2>
                            Nguồn dữ liệu và phương pháp cập nhật
                        </h2>

                        <p>
                            {
                                page.source
                                    .provider
                                    .note
                            }
                        </p>

                        <p>
                            Nguồn dữ liệu hiện tại:{' '}
                            <a
                                href={
                                    page.source
                                        .provider
                                        .url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {
                                    page.source
                                        .provider
                                        .name
                                }
                            </a>
                            .
                        </p>

                        {page.source.officialReference && (
                            <p>
                                Để đối chiếu, bạn có thể xem{' '}
                                <a
                                    href={
                                        page.source
                                            .officialReference
                                            .url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {
                                        page.source
                                            .officialReference
                                            .name
                                    }
                                </a>
                                .
                            </p>
                        )}

                        <p className="muted">
                            Giá trên giavang.today phục vụ mục đích
                            theo dõi và tham khảo. Khi giao dịch thực tế,
                            nên kiểm tra lại mức giá niêm yết trực tiếp
                            tại đơn vị cung cấp.
                        </p>
                    </section>
                )}

                {/* FAQ */}
                <section className="section-card">
                    <span className="eyebrow">
                        CÂU HỎI THƯỜNG GẶP
                    </span>

                    <h2>
                        FAQ về {page.name}
                    </h2>

                    <div className="faq-list">
                        {page.faq.map(
                            (item) => (
                                <details
                                    className="faq-item"
                                    key={
                                        item.question
                                    }
                                >
                                    <summary>
                                        <span>
                                            {
                                                item.question
                                            }
                                        </span>

                                        <span
                                            className="faq-plus"
                                            aria-hidden="true"
                                        >
                                            +
                                        </span>
                                    </summary>

                                    <div className="faq-answer">
                                        <p>
                                            {
                                                item.answer
                                            }
                                        </p>
                                    </div>
                                </details>
                            )
                        )}
                    </div>
                </section>

                {/* RELATED BLOG */}
                {page.relatedArticles?.length > 0 && (
                    <section className="section-card">
                        <span className="eyebrow">
                            BÀI VIẾT LIÊN QUAN
                        </span>

                        <h2>
                            Kiến thức về {page.name}
                        </h2>

                        <div className="page-stack">
                            {page.relatedArticles.map(
                                (article) => (
                                    <Link
                                        key={
                                            article.path
                                        }
                                        to={
                                            article.path
                                        }
                                        className="related-article-card"
                                    >
                                        <strong>
                                            {
                                                article.title
                                            }
                                        </strong>

                                        {article.description && (
                                            <span>
                                                {
                                                    article.description
                                                }
                                            </span>
                                        )}
                                    </Link>
                                )
                            )}
                        </div>
                    </section>
                )}

                {/* RELATED GOLD */}
                {relatedPages.length > 0 && (
                    <section className="section-card">
                        <span className="eyebrow">
                            XEM THÊM
                        </span>

                        <h2>
                            Giá vàng liên quan
                        </h2>

                        <div className="form-actions">
                            {relatedPages.map(
                                (item) => (
                                    <Link
                                        key={
                                            item.path
                                        }
                                        to={
                                            item.path
                                        }
                                        className="secondary-btn"
                                    >
                                        {
                                            item.label
                                        }
                                    </Link>
                                )
                            )}
                        </div>
                    </section>
                )}
            </section>
        </>
    );
}