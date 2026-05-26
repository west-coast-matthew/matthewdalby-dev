import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/blog-loader";
import PostClient from "@/components/Blog/PostClient";

export async function generateMetadata(): Promise<Metadata> {
  const post = getBlogPostBySlug("technical-architecture", "pages");
  if (!post) {
    return {
      title: "Matthew Dalby: Leadership: Technical Architecture",
    };
  }

  return {
    title: `Matthew Dalby: ${post.title}`,
    description: post.excerpt,
  };
}

export default async function TechnicalArchitecturePage() {
  const post = getBlogPostBySlug("technical-architecture", "pages");

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
