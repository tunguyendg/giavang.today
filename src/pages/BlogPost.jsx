import { Link, useParams } from "react-router-dom";
import Seo from "../seo/Seo";
import blogPosts from "../data/blogPosts";
import { blogPostSchema } from "../seo/schema";

export default function BlogPost() {
    const { slug } = useParams();

    const post = blogPosts.find(
        (item) => item.slug === slug
    );

    if (!post) {
        return (
            <>
                <Seo
                    title="Không tìm thấy bài viết"
                    description="Bài viết không tồn tại."
                    path={`/blog/${slug}`}
                    noindex
                />

                <main className="container">
                    <section className="blog-post-not-found">
                        <h1>Không tìm thấy bài viết</h1>

                        <Link to="/blog">
                            ← Quay lại Blog
                        </Link>
                    </section>
                </main>
            </>
        );
    }

    return (
        <>
            <Seo
                title={post.title}
                description={post.description}
                path={`/blog/${post.slug}`}
                image={post.heroImage}
                type="article"
                schema={blogPostSchema(post)}
            />

            <main className="container">
                <article className="blog-post">
                    <div className="blog-post-header">
                        <Link
                            className="blog-back-link"
                            to="/blog"
                        >
                            ← Blog
                        </Link>

                        <span className="blog-category">
                            {post.category}
                        </span>

                        <h1>{post.title}</h1>

                        <p className="blog-post-excerpt">
                            {post.excerpt}
                        </p>

                        <div className="blog-post-meta">
                            <Link
                                className="blog-author-link"
                                to={`/tac-gia/${post.author.slug}`}
                            >
                                {post.author.name}
                            </Link>

                            <span>•</span>

                            <time dateTime={post.publishedAt}>
                                {new Date(
                                    post.publishedAt
                                ).toLocaleDateString("vi-VN")}
                            </time>
                        </div>

                        {post.heroImage && (
                            <img
                                className="blog-post-hero-image"
                                src={post.heroImage}
                                alt={post.title}
                                width="1200"
                                height="630"
                                loading="eager"
                            />
                        )}
                    </div>

                    <div className="blog-post-content">
                        {post.sections.map(
                            (section, index) => (
                                <section
                                    key={`${post.slug}-${index}`}
                                    className="blog-post-section"
                                >
                                    <h2>
                                        {section.heading}
                                    </h2>

                                    {section.paragraphs.map(
                                        (paragraph, paragraphIndex) => (
                                            <p
                                                key={`${index}-${paragraphIndex}`}
                                            >
                                                {paragraph}
                                            </p>
                                        )
                                    )}
                                </section>
                            )
                        )}
                    </div>

                    {post.relatedLinks?.length > 0 && (
                        <section className="blog-related">
                            <h2>Đọc thêm</h2>

                            <div className="blog-related-links">
                                {post.relatedLinks.map(
                                    (link) => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                        >
                                            {link.label}
                                            <span>→</span>
                                        </Link>
                                    )
                                )}
                            </div>
                        </section>
                    )}
                </article>
            </main>
        </>
    );
}