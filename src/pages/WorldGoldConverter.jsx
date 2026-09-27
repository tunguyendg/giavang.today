import { useEffect, useState } from "react";
import Seo from "../seo/Seo";
import Breadcrumb from "../components/Breadcrumb";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:3000";

function formatVnd(value) {
    if (!value) return "—";

    return new Intl.NumberFormat("vi-VN").format(value);
}

function formatNumber(value, digits = 2) {
    if (value === null || value === undefined) return "—";

    return new Intl.NumberFormat("vi-VN", {
        maximumFractionDigits: digits,
    }).format(value);
}

function WorldGoldConverter() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_BASE_URL}/api/gold/world-conversion`
                );

                if (!response.ok) {
                    throw new Error(
                        "Không thể tải dữ liệu quy đổi"
                    );
                }

                const result = await response.json();

                setData(result.data);

                if (window.gtag) {
                    window.gtag("event", "view_world_gold_converter", {
                        page_path: "/quy-doi-gia-vang-the-gioi",
                    });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <>
            <Seo
                title="Quy đổi giá vàng thế giới sang VND"
                description="Quy đổi giá vàng thế giới XAU/USD sang VND mỗi lượng và so sánh chênh lệch với giá vàng SJC."
                canonical="/quy-doi-gia-vang-the-gioi"
            />

            <main className="container">
                <Breadcrumb
                    current="Quy đổi giá vàng thế giới"
                />

                <section className="converter-hero">
                    <p className="eyebrow">
                        Công cụ giá vàng
                    </p>

                    <h1>
                        Quy đổi giá vàng thế giới sang VND/lượng
                    </h1>

                    <p>
                        Quy đổi XAU/USD theo tỷ giá USD/VND
                        hiện tại và so sánh trực tiếp với giá
                        vàng SJC.
                    </p>
                </section>

                {loading && (
                    <p>Đang tải dữ liệu...</p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {!loading && !error && data && (
                    <>
                        <section className="converter-grid">
                            <article className="converter-card">
                                <span>Giá vàng thế giới</span>

                                <strong>
                                    {formatNumber(data.xauUsd)}
                                </strong>

                                <small>USD/oz</small>
                            </article>

                            <article className="converter-card">
                                <span>Tỷ giá USD/VND</span>

                                <strong>
                                    {formatVnd(data.usdVnd)}
                                </strong>

                                <small>
                                    Vietcombank bán ra
                                </small>
                            </article>

                            <article className="converter-card">
                                <span>
                                    Thế giới quy đổi
                                </span>

                                <strong>
                                    {formatVnd(
                                        data.worldVndPerLuong
                                    )}
                                </strong>

                                <small>đ/lượng</small>
                            </article>

                            <article className="converter-card">
                                <span>SJC bán ra</span>

                                <strong>
                                    {formatVnd(data.sjcSell)}
                                </strong>

                                <small>đ/lượng</small>
                            </article>
                        </section>

                        <section className="premium-card">
                            <div>
                                <span>
                                    Chênh lệch SJC so với thế giới
                                </span>

                                <strong>
                                    +{formatVnd(data.premium)} đ/lượng
                                </strong>
                            </div>

                            <div>
                                <span>Premium</span>

                                <strong>
                                    +{formatNumber(
                                        data.premiumPercent
                                    )}%
                                </strong>
                            </div>
                        </section>

                        <section className="converter-note">
                            <h2>Cách tính</h2>

                            <p>
                                Giá vàng thế giới được quy đổi từ
                                USD/oz sang VND/lượng theo tỷ giá
                                USD bán ra của Vietcombank.
                            </p>

                            <p>
                                1 troy ounce = 31.1034768 gram và
                                1 lượng vàng = 37.5 gram.
                            </p>

                            <p>
                                Premium thể hiện mức chênh lệch
                                giữa giá SJC bán ra và giá vàng
                                thế giới sau quy đổi.
                            </p>
                        </section>
                    </>
                )}
            </main>
        </>
    );
}

export default WorldGoldConverter;