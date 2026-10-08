import { Link, useSearchParams } from "react-router-dom";
import Seo from "../seo/Seo";
import blogPosts from "../data/blogPosts";

export default function Blog() {
    const [searchParams, setSearchParams] = useSearchParams();

    const POSTS_PER_PAGE = 4;

    const currentPage = Math.max(
        1,
        Number(searchParams.get("page")) || 1
    );

    const totalPages = Math.ceil(
        blogPosts.length / POSTS_PER_PAGE
    );

    const safePage = Math.min(
        currentPage,
        totalPages || 1
    );

    const startIndex =
        (safePage - 1) * POSTS_PER_PAGE;

    const visiblePosts = blogPosts.slice(
        startIndex,
        startIndex + POSTS_PER_PAGE
    );

    const seoTitle =
        safePage === 1
            ? "Blog kiến thức vàng"
            : `Blog kiến thức vàng - Trang ${safePage}`;

    const seoDescription =
        safePage === 1
            ? "Kiến thức về giá vàng, vàng SJC, giá vàng thế giới, chênh lệch giá và cách theo dõi thị trường vàng."
            : `Trang ${safePage} của Blog giavang.today với các bài viết về giá vàng, SJC, vàng thế giới, spread và kiến thức thị trường.`;

    const seoPath =
        safePage === 1
            ? "/blog"
            : `/blog?page=${safePage}`;

    const goToPage = (page) => {
        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        if (page === 1) {
            setSearchParams({});
        } else {
            setSearchParams({
                page: String(page),
            });
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            <Seo
                title={seoTitle}
                description={seoDescription}
                path={`/blog/${slug}`}
                path={seoPath}
            />

            <main className="container">
                <section className="blog-hero">
                    <p className="eyebrow">
                        KIẾN THỨC VÀNG
                    </p>

                    <h1>
                        Blog giavang.today
                    </h1>

                    <p>
                        Giải thích dữ liệu, thuật ngữ và cách
                        theo dõi thị trường vàng theo cách đơn
                        giản, dễ hiểu.
                    </p>
                </section>

                <section className="blog-grid">
                    {visiblePosts.map(
                        (post) => (
                            <article
                                key={post.slug}
                                className="blog-card"
                            >
                                {post.heroImage && (
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="blog-card-image-link"
                                    >
                                        <img
                                            className="blog-card-image"
                                            src={
                                                post.heroImage
                                            }
                                            alt={
                                                post.title
                                            }
                                            width="1200"
                                            height="630"
                                            loading="lazy"
                                        />
                                    </Link>
                                )}

                                <span className="blog-category">
                                    {
                                        post.category
                                    }
                                </span>

                                <h2>
                                    <Link
                                        to={`/blog/${post.slug}`}
                                    >
                                        {
                                            post.title
                                        }
                                    </Link>
                                </h2>

                                <p>
                                    {
                                        post.excerpt
                                    }
                                </p>

                                <div className="blog-meta">
                                    <span>
                                        {
                                            post
                                                .author
                                                .name
                                        }
                                    </span>

                                    <span>
                                        •
                                    </span>

                                    <time
                                        dateTime={
                                            post.publishedAt
                                        }
                                    >
                                        {new Date(
                                            post.publishedAt
                                        ).toLocaleDateString(
                                            "vi-VN"
                                        )}
                                    </time>
                                </div>

                                <Link
                                    className="blog-read-more"
                                    to={`/blog/${post.slug}`}
                                >
                                    Đọc bài viết →
                                </Link>
                            </article>
                        )
                    )}
                </section>

                {totalPages > 1 && (
                    <nav
                        className="blog-pagination"
                        aria-label="Phân trang blog"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                goToPage(
                                    safePage - 1
                                )
                            }
                            disabled={
                                safePage === 1
                            }
                            className="blog-pagination-button"
                        >
                            ← Trước
                        </button>

                        <div className="blog-pagination-pages">
                            {Array.from(
                                {
                                    length:
                                        totalPages,
                                },
                                (_, index) => {
                                    const page =
                                        index +
                                        1;

                                    return (
                                        <button
                                            key={
                                                page
                                            }
                                            type="button"
                                            onClick={() =>
                                                goToPage(
                                                    page
                                                )
                                            }
                                            className={`blog-pagination-number ${
                                                safePage ===
                                                page
                                                    ? "active"
                                                    : ""
                                            }`}
                                            aria-current={
                                                safePage ===
                                                page
                                                    ? "page"
                                                    : undefined
                                            }
                                        >
                                            {
                                                page
                                            }
                                        </button>
                                    );
                                }
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                goToPage(
                                    safePage + 1
                                )
                            }
                            disabled={
                                safePage ===
                                totalPages
                            }
                            className="blog-pagination-button"
                        >
                            Sau →
                        </button>
                    </nav>
                )}
            </main>
        </>
    );
}