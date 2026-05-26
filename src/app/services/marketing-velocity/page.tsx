import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/blog-loader";
import PostClient from "@/components/Blog/PostClient";

export async function generateMetadata(): Promise<Metadata> {
  const post = getBlogPostBySlug("marketing-velocity", "pages");
  if (!post) {
    return {
      title: "Matthew Dalby: Services: Marketing Velocity",
    };
  }

  return {
    title: `Matthew Dalby: ${post.title}`,
    description: post.excerpt,
  };
}

export default async function MarketingVelocityPage() {
  const post = getBlogPostBySlug("marketing-velocity", "pages");

  if (!post) {
    notFound();
  }

  return (
    <PostClient
      post={post}
      backUrl="/"
      backLabel="Back to home"
    />
  );
}
