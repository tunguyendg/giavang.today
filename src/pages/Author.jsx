import { Link } from "react-router-dom";
import Seo from "../seo/Seo";
import blogPosts from "../data/blogPosts";
import { authorProfileSchema } from "../seo/schema";

export default function Author() {
  const author = {
    name: "Tony Nguyễn",
    slug: "tony-nguyen",
    role: "Founder & Editor, giavang.today",
    bio:
      "Tony có background về IT và Finance, với mối quan tâm đến công nghệ, dữ liệu thị trường và đầu tư.",
    xUrl: "https://x.com/tunguyendg90",
  };

  const authorPosts = blogPosts.filter(
    (post) => post.author.slug === author.slug
  );

  return (
    <>
      <Seo
        title={`${author.name} - Tác giả`}
        description={`${author.name} là ${author.role}. Tìm các bài viết về giá vàng, dữ liệu thị trường và kiến thức vàng trên giavang.today.`}
        path={`/tac-gia/${author.slug}`}
        schema={authorProfileSchema(author)}
      />

      <main className="container">
        <section className="author-profile">
          <p className="eyebrow">
            TÁC GIẢ
          </p>

          <h1>{author.name}</h1>

          <p className="author-role">
            {author.role}
          </p>

          <p className="author-bio">
            {author.bio}
          </p>

          <a
            className="author-social-link"
            href={author.xUrl}
            target="_blank"
            rel="noreferrer"
          >
            X / Twitter →
          </a>
        </section>

        <section className="author-posts">
          <h2>Bài viết của {author.name}</h2>

          <div className="blog-grid">
            {authorPosts.map((post) => (
              <article
                key={post.slug}
                className="blog-card"
              >
                <span className="blog-category">
                  {post.category}
                </span>

                <h3>
                  <Link to={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p>{post.excerpt}</p>

                <Link
                  className="blog-read-more"
                  to={`/blog/${post.slug}`}
                >
                  Đọc bài viết →
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}