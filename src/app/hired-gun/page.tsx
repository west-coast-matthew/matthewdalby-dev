import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/blog-loader";
import PostClient from "@/components/Blog/PostClient";

export async function generateMetadata(): Promise<Metadata> {
  const post = getBlogPostBySlug("hired-gun", "pages");
  if (!post) {
    return {
      title: "Matthew Dalby: Hired Gun",
    };
  }

  return {
    title: `Matthew Dalby: ${post.title}`,
    description: post.excerpt,
  };
}

export default async function HiredGunPage() {
  const post = getBlogPostBySlug("hired-gun", "pages");

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
