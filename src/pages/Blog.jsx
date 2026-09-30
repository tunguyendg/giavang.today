import { Link } from "react-router-dom";
import Seo from "../seo/Seo";
import blogPosts from "../data/blogPosts";

export default function Blog() {
    return (
        <>
            <Seo
                title="Blog kiến thức vàng"
                description="Kiến thức về giá vàng, vàng SJC, giá vàng thế giới, chênh lệch giá và cách theo dõi thị trường vàng."
                path="/blog"
            />

            <main className="container">
                <section className="blog-hero">
                    <p className="eyebrow">
                        KIẾN THỨC VÀNG
                    </p>

                    <h1>Blog giavang.today</h1>

                    <p>
                        Giải thích dữ liệu, thuật ngữ và cách
                        theo dõi thị trường vàng theo cách đơn
                        giản, dễ hiểu.
                    </p>
                </section>

                <section className="blog-grid">
                    {blogPosts.map((post) => (
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
                                        src={post.heroImage}
                                        alt={post.title}
                                        width="1200"
                                        height="630"
                                        loading="lazy"
                                    />
                                </Link>
                            )}
                            <span className="blog-category">
                                {post.category}
                            </span>

                            <h2>
                                <Link to={`/blog/${post.slug}`}>
                                    {post.title}
                                </Link>
                            </h2>

                            <p>{post.excerpt}</p>

                            <div className="blog-meta">
                                <span>{post.author.name}</span>
                                <span>•</span>
                                <time dateTime={post.publishedAt}>
                                    {new Date(
                                        post.publishedAt
                                    ).toLocaleDateString("vi-VN")}
                                </time>
                            </div>

                            <Link
                                className="blog-read-more"
                                to={`/blog/${post.slug}`}
                            >
                                Đọc bài viết →
                            </Link>
                        </article>
                    ))}
                </section>
            </main>
        </>
    );
}