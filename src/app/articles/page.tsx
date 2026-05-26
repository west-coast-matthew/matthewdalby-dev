import Link from "next/link";
import { Metadata } from "next";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getAllBlogPosts } from "@/lib/blog-loader";
import { getAllActiveTopics } from "@/services/api-service.service";
import BreadcrumbPanel from "@/components/Breadcrumb";
import styles from "./articles-list.module.scss";

export const metadata: Metadata = {
  title: "Matthew Dalby: Articles",
  description: "Technical articles and blog posts on React, Node.js, API Design, and Software Engineering.",
};

const categoryDescriptions: Record<string, string> = {
  "Guide": "Practical tutorials, step-by-step guides, and walkthroughs for modern web development.",
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const posts = getAllBlogPosts("articles");
  const topics = getAllActiveTopics();

  // Extract unique categories for the filters
  const uniqueCategories = Array.from(
    new Set(posts.map((post) => post.category).filter(Boolean))
  );

  interface TopicCardItem {
    title: string;
    summary: string;
    link: string;
    isLegacy: boolean;
    count?: number;
  }

  const newTopicItems: TopicCardItem[] = uniqueCategories.map((cat) => ({
    title: cat,
    summary: categoryDescriptions[cat] || `Deep dives, articles, and guides about ${cat}.`,
    link: `/articles?category=${encodeURIComponent(cat)}`,
    isLegacy: false,
    count: posts.filter((p) => p.category === cat).length,
  }));

  const legacyTopicItems: TopicCardItem[] = topics.map((topic) => ({
    title: topic.title,
    summary: topic.summary,
    link: `/articles${topic.link}`,
    isLegacy: true,
  }));

  const allTopics = [...newTopicItems, ...legacyTopicItems];

  // Filter posts if a category is selected
  const selectedCategory = category ? decodeURIComponent(category) : undefined;
  const filteredPosts = selectedCategory
    ? posts.filter(
      (post) => post.category.toLowerCase() === selectedCategory.toLowerCase()
    )
    : posts;

  return (
    <main className={styles["page-layout"]}>
      {/* Decorative Blur Backgrounds */}
      <div className={styles["glow-1"]} />
      <div className={styles["glow-2"]} />

      <div className={styles["page-container"]}>
        <BreadcrumbPanel path="/articles" />

        <header className={styles["page-header"]}>
          <h1 className={styles["page-title"]}>Articles</h1>
          <p className={styles["page-subtitle"]}>
            Thoughts, tutorials, and deep-dives into modern software development.
          </p>
        </header>

        {/* New Markdown Explore by Topic Filter */}
        {uniqueCategories.length > 0 && (
          <section className={styles["section"]}>
            <h2 className={styles["section-title"]}>Filter by Category</h2>
            <div className={styles["categories-list"]}>
              <Link
                href="/articles"
                className={`${styles["category-pill"]} ${!selectedCategory ? styles["pill-active"] : ""
                  }`}
              >
                All Articles ({posts.length})
              </Link>
              {uniqueCategories.map((cat) => {
                const count = posts.filter((p) => p.category === cat).length;
                return (
                  <Link
                    key={cat}
                    href={`/articles?category=${encodeURIComponent(cat)}`}
                    className={`${styles["category-pill"]} ${selectedCategory?.toLowerCase() === cat.toLowerCase()
                      ? styles["pill-active"]
                      : ""
                      }`}
                  >
                    {cat} ({count})
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* New Markdown Articles Grid */}
        <section className={styles["section"]}>
          <h2 className={styles["section-title"]}>
            {selectedCategory ? `Articles: ${selectedCategory}` : "Recent Articles"}
          </h2>
          {filteredPosts.length === 0 ? (
            <div className={styles["empty-state"]}>
              <p>No articles found for this topic. Check back soon!</p>
              {selectedCategory && (
                <Link href="/articles" className={styles["reset-link"]}>
                  View all articles
                </Link>
              )}
            </div>
          ) : (
            <div className={styles["articles-grid"]}>
              {filteredPosts.map((post) => (
                <article key={post.slug} className={styles["post-card"]}>
                  <div className={styles["card-badge"]}>
                    <span>{post.category}</span>
                  </div>
                  <h3 className={styles["card-title"]}>
                    <Link href={`/articles/${post.slug}`} className={styles["card-link"]}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className={styles["card-excerpt"]}>{post.excerpt}</p>
                  <div className={styles["card-meta"]}>
                    <div className={styles["meta-item"]}>
                      <Calendar className={styles["meta-icon"]} />
                      <span>{post.date}</span>
                    </div>
                    <div className={styles["meta-item"]}>
                      <Clock className={styles["meta-icon"]} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className={styles["card-footer"]}>
                    <Link href={`/articles/${post.slug}`} className={styles["read-more"]}>
                      Read Article <ArrowRight className={styles["arrow-icon"]} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Unified Explore by Topic Section */}
        {allTopics.length > 0 && (
          <section className={`${styles["section"]} ${styles["categories-section"]}`}>
            <h2 className={styles["section-title"]}>Explore by Topic</h2>
            <p className={styles["section-description"]}>
              Browse through our technical articles and topics.
            </p>
            <div className={styles["topics-grid"]}>
              {allTopics.map((item) => (
                <div key={`${item.isLegacy ? "legacy" : "new"}-${item.title}`} className={styles["topic-card"]}>
                  <div className={styles["topic-content"]}>
                    <div className={styles["topic-header"]}>
                      <h3 className={styles["topic-title"]}>{item.title}</h3>
                      {item.isLegacy && (
                        <span className={styles["legacy-badge"]}>
                          Legacy
                        </span>
                      )}
                    </div>
                    <p className={styles["topic-summary"]}>{item.summary}</p>
                  </div>
                  <div className={styles["topic-footer"]}>
                    <Link
                      href={item.link}
                      className={styles["explore-link"]}
                    >
                      Explore Articles {item.count !== undefined ? `(${item.count})` : ""} <ArrowRight className={styles["arrow-icon"]} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

