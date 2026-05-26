import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
}

const CONTENT_ROOT = path.join(process.cwd(), 'src/content');

/**
 * Simple frontmatter parser extracts YAML-like fields between --- delimiters.
 */
function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: fileContent };
  }

  const rawYaml = match[1];
  const content = match[2];
  const data: Record<string, string> = {};

  rawYaml.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      data[key] = value;
    }
  });

  return { data, content };
}

export function getAllBlogPosts(collection: string = 'articles'): BlogPost[] {
  const directory = path.join(CONTENT_ROOT, collection);
  
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = fs.readdirSync(directory);
  const posts = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace('.md', '');
      const fullPath = path.join(directory, file);
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = parseFrontmatter(fileContent);

      return {
        slug,
        title: data.title || 'Untitled',
        date: data.date || 'Unknown Date',
        excerpt: data.excerpt || '',
        category: data.category || 'General',
        readTime: data.readTime || '5 min read',
        content: content.trim()
      };
    });

  // Sort by date (descending)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPostBySlug(slug: string, collection: string = 'articles'): BlogPost | null {
  const fullPath = path.join(CONTENT_ROOT, collection, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = parseFrontmatter(fileContent);

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || 'Unknown Date',
    excerpt: data.excerpt || '',
    category: data.category || 'General',
    readTime: data.readTime || '5 min read',
    content: content.trim()
  };
}
