import fs from 'fs';
import path from 'path';

// Define the cfg array representing metadata of all articles
const cfg = [
  {
    title: "API Design",
    link: "/api-design",
    summary: "(Mostly) REST based API related",
    active: true,
    articles: [
      {
        title: "Effective REST Controller Design",
        link: "/designing-controllers",
        summary: "Patterns for real world REST APIs.",
        postedDate: new Date("2025-01-05"),
        active: true,
      },
      {
        title: "REST: Exception Handling",
        link: "/exception-handling",
        summary: "A standardized approach to exception handling in REST APIs.",
        postedDate: new Date("2025-01-20"),
        active: true,
      },
      {
        title: "REST: Thoughts on Caching",
        link: "/caching",
        summary: "Making use of HTTP header cache control directives",
        postedDate: new Date("2025-01-20"),
        active: true,
      },
    ],
  },
  {
    title: "Applications",
    link: "/apps",
    summary: "Side projects...",
    active: true,
    articles: [],
    children: [
      {
        title: "ERP Demo",
        link: "/erp",
        summary: "A real world application example",
        active: true,
        articles: [
          {
            title: "ERP Demo: An Introduction",
            link: "/introduction",
            summary: "An introduction to the project",
            postedDate: new Date("2025-01-01"),
            active: true,
          },
          {
            title: "ERP Demo: (Part 1) Understanding the Problem Domain",
            link: "/problem-domain",
            summary: "Background on the domain problem at hand",
            postedDate: new Date("2025-01-01"),
            active: true,
          },
          {
            title: "ERP Demo: (Part 2) System Architecture",
            link: "/architecture",
            summary: "Technical design decisions",
            postedDate: new Date("2025-01-01"),
            active: true,
          },
          {
            title: "ERP Demo: (Part 3) Defining the core modules",
            link: "/core-modules",
            summary: "Implementing a home for shared code",
            postedDate: new Date("2025-01-01"),
            active: true,
          },
          {
            title: "ERP Demo: (Part 4) Entity management api",
            link: "/entity-management-api",
            summary: "Initial module for managing various entities",
            postedDate: new Date("2025-01-01"),
            active: true,
          },
          {
            title: "ERP Demo: (Part 5) Entity management-ui",
            link: "/entity-management-ui",
            summary:
              "Initial module for managing various entities (user interface)",
            postedDate: new Date("2025-01-01"),
            active: true,
          },
        ],
      },
    ],
  },
  {
    title: "Software Engineering",
    link: "/software-engineering",
    summary: "Thoughts/obervations of the tech industry",
    active: true,
    articles: [
      {
        title: "Auditing Complex Processes",
        link: "/complex-process-auditing",
        summary: "Transitioning complex processes from a black box",
        postedDate: new Date("2024-07-06"),
        active: true,
      },
      {
        title: "DSL Based Code Generation",
        link: "/dsl-based-code-generation",
        summary: "An experiment in reversing an RDMBs into ORM source",
        postedDate: new Date("2024-06-18"),
        active: false,
      },
      {
        title: "Applied Unit Testing",
        link: "/applied-unit-testing",
        summary: "An working example of applied unit testing",
        postedDate: new Date("2025-08-05"),
        active: true,
      },
      {
        title: "Request Scoped Variables",
        link: "/request-scoped-variables",
        summary: "How to scope variables at a request level",
        postedDate: new Date("2025-05-15"),
        active: true,
      },
      {
        title: "Modeling an Inventory Tracking System",
        link: "/modeling-an-inventory-tracking-system",
        summary:
          "A deep dive into modeling an inventory system used in the beverage manufacturing process",
        postedDate: new Date("2025-06-14"),
        active: true,
      },
      {
        title: "The chain of responsibility pattern",
        link: "/chain-of-responsibility-pattern",
        summary:
          "A real world example of the chain of responsibility design pattern",
        postedDate: new Date("2025-12-02"),
        active: true,
      },
    ],
  },
  {
    title: "Node.js, Typescript, React",
    link: "/node-typescript",
    summary: "Thoughts/obervations of the tech industry",
    active: true,
    articles: [
      {
        title: "Creating shared modules with node",
        link: "/creating-shared-modules",
        summary: "Developing shared modules in Node.js",
        postedDate: new Date("2024-06-18"),
        active: true,
      },
      {
        title: "Node REST API Boilerplate",
        link: "/node-api-boilerplate",
        summary: "Developing a REST API with a shared module",
        postedDate: new Date("2024-06-18"),
        active: false,
      },
      {
        title: "Tankstack in Action",
        link: "/tanstack-in-action",
        summary: "Developing a REST API with a shared module",
        postedDate: new Date("2025-08-28"),
        active: true,
      },
    ],
  },
];

// Helper to resolve code snippet path and read its content
function resolveCodeSnippet(expression, relativeDir) {
  const cleanExpr = expression.trim();
  
  if (relativeDir.includes('api-design/designing-controllers')) {
    const match = cleanExpr.match(/getArticleContent\((['"`])(.*)\1\)/);
    if (match) {
      const fileName = match[2];
      return fs.readFileSync(path.join(process.cwd(), 'public/article-content/api-design/effective-rest-controllers', `${fileName}.txt`), 'utf8');
    }
  }
  
  if (relativeDir.includes('node-typescript/tanstack-in-action')) {
    const match = cleanExpr.match(/getArticleContent\((['"`])(.*)\1\)/);
    if (match) {
      const fileName = match[2];
      return fs.readFileSync(path.join(process.cwd(), 'public/article-content/node/adventures-in-tanstack', `${fileName}.txt`), 'utf8');
    }
  }
  
  if (relativeDir.includes('node-typescript/creating-shared-modules')) {
    if (cleanExpr === 'exportCfg') {
      return fs.readFileSync(path.join(process.cwd(), 'public/article-content/node/creating-shared-modules/bundler-export.txt'), 'utf8');
    }
    if (cleanExpr === 'clientPackageJson') {
      return fs.readFileSync(path.join(process.cwd(), 'public/article-content/node/creating-shared-modules/example-shared-package-json.txt'), 'utf8');
    }
  }
  
  if (relativeDir.includes('api-design/exception-handling')) {
    const match = cleanExpr.match(/getArticleContent\((['"`])(.*)\1\)/);
    if (match) {
      const fileName = match[2];
      return fs.readFileSync(path.join(process.cwd(), 'public/article-content/api-design/exception-handling', `${fileName}.txt`), 'utf8');
    }
  }
  
  if (relativeDir.includes('software-engineering/request-scoped-variables')) {
    if (cleanExpr === 'getExample1()') {
      return fs.readFileSync(path.join(process.cwd(), 'public/article-content/se/request-scoped-variables/java-impl.txt'), 'utf8');
    }
    if (cleanExpr === 'getExample2()') {
      return fs.readFileSync(path.join(process.cwd(), 'public/article-content/se/request-scoped-variables/node-impl.txt'), 'utf8');
    }
  }
  
  if (relativeDir.includes('software-engineering/chain-of-responsibility-pattern')) {
    if (cleanExpr === 'getHeaderComments()') {
      return fs.readFileSync(path.join(process.cwd(), 'public/article-content/se/chain-of-reponsibility-pattern/header-comments.txt'), 'utf8');
    }
    if (cleanExpr === 'getJavaExample()') {
      return fs.readFileSync(path.join(process.cwd(), 'public/article-content/se/chain-of-reponsibility-pattern/java-impl.txt'), 'utf8');
    }
  }
  
  if (relativeDir.includes('software-engineering/modeling-an-inventory-tracking-system')) {
    const match = cleanExpr.match(/getArticleContent\((['"`])(.*)\1\s*,\s*(['"`])(.*)\3\)/);
    if (match) {
      const dirName = match[2];
      const fileName = match[4];
      return fs.readFileSync(path.join(process.cwd(), 'public/article-content/se', dirName, `${fileName}.txt`), 'utf8');
    }
  }
  
  if (relativeDir.includes('software-engineering/applied-unit-testing')) {
    if (cleanExpr === 'getExample1()') {
      return fs.readFileSync(path.join(process.cwd(), 'public/article-content/se/applied-unit-testing/node-mocking.txt'), 'utf8');
    }
  }
  
  if (relativeDir.includes('software-engineering/complex-process-auditing')) {
    if (cleanExpr === 'transactionSrc1') {
      return fs.readFileSync(path.join(process.cwd(), 'public/article-content/se/business-logic-monitoring/transaction-num-est.txt'), 'utf8');
    }
    if (cleanExpr === 'agentInteraction') {
      return fs.readFileSync(path.join(process.cwd(), 'public/article-content/se/business-logic-monitoring/agent-interaction.txt'), 'utf8');
    }
  }
  
  throw new Error(`Unhandled code snippet expression "${cleanExpr}" in ${relativeDir}`);
}

// Main migration runner
function migrate() {
  const oldArticlesDir = path.join(process.cwd(), 'src/app/articles/old');
  const contentArticlesDir = path.join(process.cwd(), 'src/content/articles');
  
  if (!fs.existsSync(contentArticlesDir)) {
    fs.mkdirSync(contentArticlesDir, { recursive: true });
  }

  // Find all page.tsx files recursively under oldArticlesDir
  function getPageFiles(dir, files = []) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        getPageFiles(fullPath, files);
      } else if (file === 'page.tsx') {
        files.push(fullPath);
      }
    }
    return files;
  }

  const pageFiles = getPageFiles(oldArticlesDir);
  console.log(`Found ${pageFiles.length} page.tsx files to migrate.`);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function formatDate(d) {
    return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  for (const pageFile of pageFiles) {
    const relativePath = path.relative(oldArticlesDir, pageFile); // e.g. api-design/caching/page.tsx
    const dirParts = path.dirname(relativePath).split(path.sep); // e.g. ['api-design', 'caching']
    
    let topicSlug = '';
    let subTopicSlug = '';
    let articleSlug = '';
    
    if (dirParts.length === 2) {
      topicSlug = dirParts[0];
      articleSlug = dirParts[1];
    } else if (dirParts.length === 3) {
      topicSlug = dirParts[0];
      subTopicSlug = dirParts[1];
      articleSlug = dirParts[2];
    } else {
      console.warn(`Skipping unhandled directory structure: ${relativePath}`);
      continue;
    }

    // Lookup metadata in cfg
    let matchedArticle = null;
    let categoryName = '';
    
    const topic = cfg.find(t => t.link === `/${topicSlug}`);
    if (topic) {
      if (subTopicSlug) {
        const subTopic = topic.children && topic.children.find(st => st.link === `/${subTopicSlug}`);
        if (subTopic) {
          categoryName = subTopic.title;
          matchedArticle = subTopic.articles && subTopic.articles.find(a => a.link === `/${articleSlug}`);
        }
      } else {
        categoryName = topic.title;
        matchedArticle = topic.articles && topic.articles.find(a => a.link === `/${articleSlug}`);
      }
    }

    if (!matchedArticle) {
      console.warn(`Could not find metadata in cfg for: ${relativePath}. Using defaults.`);
      matchedArticle = {
        title: articleSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        summary: 'Technical article reference.',
        postedDate: new Date()
      };
      categoryName = topic ? topic.title : 'General';
    }

    // Read the page.tsx file
    const fileContent = fs.readFileSync(pageFile, 'utf8');
    
    // Extract JSX body inside ArticleTemplateLayout
    const layoutStartTag = '<ArticleTemplateLayout';
    const layoutEndTag = '</ArticleTemplateLayout>';
    
    const startIndex = fileContent.indexOf(layoutStartTag);
    if (startIndex === -1) {
      console.error(`Could not find ArticleTemplateLayout in ${relativePath}`);
      continue;
    }
    
    const endTagIndex = fileContent.indexOf(layoutEndTag, startIndex);
    if (endTagIndex === -1) {
      console.error(`Could not find closing ArticleTemplateLayout in ${relativePath}`);
      continue;
    }
    
    const contentStartIndex = fileContent.indexOf('>', startIndex) + 1;
    let jsxBody = fileContent.substring(contentStartIndex, endTagIndex).trim();

    // Perform transformations
    // 1. Strip comments
    jsxBody = jsxBody.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/<!--[\s\S]*?-->/g, '');
    
    // 2. Strip Fade wrapper
    jsxBody = jsxBody.replace(/<Fade[^>]*>/g, '').replace(/<\/Fade>/g, '');
    
    // 3. Replace ClientModalWrapper tags
    jsxBody = jsxBody.replace(/<ClientModalWrapper[\s\S]*?imgRef=\{?["']([\s\S]*?)["']\}?[\s\S]*?>[\s\S]*?<\/ClientModalWrapper>/g, (match) => {
      const titleMatch = match.match(/title=(?:{?"(.*?)"}?|{'(.*?)'})/);
      const subTitleMatch = match.match(/subTitle=(?:{?"(.*?)"}?|{'(.*?)'})/);
      const imgDescMatch = match.match(/imgDesc=(?:{?"(.*?)"}?|{'(.*?)'})/);
      const imgRefMatch = match.match(/imgRef=(?:{?"(.*?)"}?|{'(.*?)'})/);
      const descMatch = match.match(/description=(?:{?"(.*?)"}?|{'(.*?)'})/);
      
      const title = (titleMatch ? (titleMatch[1] || titleMatch[2]) : '') || (descMatch ? (descMatch[1] || descMatch[2]) : '') || 'Image';
      const description = (imgDescMatch ? (imgDescMatch[1] || imgDescMatch[2]) : '') || (subTitleMatch ? (subTitleMatch[1] || subTitleMatch[2]) : '') || 'Click to expand';
      const imgRef = imgRefMatch ? (imgRefMatch[1] || imgRefMatch[2]) : '';
      
      return `\n\n[${title.trim()} || ${description.trim()} || ${imgRef.trim()}]\n\n`;
    });
    
    // 4. Replace ImageReference tags
    jsxBody = jsxBody.replace(/<ImageReference[\s\S]*?\/>/g, (match) => {
      const imgRefMatch = match.match(/imgRef=(?:{?"(.*?)"}?|{'(.*?)'})/);
      const descMatch = match.match(/description=(?:{?"(.*?)"}?|{'(.*?)'})/);
      
      const imgRef = imgRefMatch ? (imgRefMatch[1] || imgRefMatch[2]) : '';
      const desc = descMatch ? (descMatch[1] || descMatch[2]) : 'Image';
      
      return `\n\n[${desc.trim()} || ${desc.trim()} || ${imgRef.trim()}]\n\n`;
    });
    
    // 5. Replace Links
    jsxBody = jsxBody.replace(/<Link\s+(?:[^>]*?\s+)?href=\{?["'](.*?)["']\}?[^>]*>([\s\S]*?)<\/Link>/g, '[$2]($1)');
    
    // 6. Replace Headers (h1-h6)
    jsxBody = jsxBody.replace(/<(h[1-6])(?:\s+[^>]*)*>([\s\S]*?)<\/\1>/g, (m, tag, content) => {
      const level = tag[1];
      return `\n\n${'#'.repeat(Number(level))} ${content.trim()}\n\n`;
    });
    
    // 7. Replace Paragraphs
    jsxBody = jsxBody.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, '\n\n$1\n\n');
    
    // 8. Replace bold (b, strong)
    jsxBody = jsxBody.replace(/<(b|strong)[^>]*>([\s\S]*?)<\/\1>/g, '**$2**');
    
    // 9. Replace italics (i, em)
    jsxBody = jsxBody.replace(/<(i|em)[^>]*>([\s\S]*?)<\/\1>/g, '*$2*');
    
    // 10. Replace ordered lists
    jsxBody = jsxBody.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (m, content) => {
      let index = 1;
      return '\n\n' + content.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (m2, liContent) => {
        return `${index++}. ${liContent.trim()}\n`;
      }) + '\n\n';
    });
    
    // 11. Replace unordered lists
    jsxBody = jsxBody.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (m, content) => {
      return '\n\n' + content.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (m2, liContent) => {
        return `* ${liContent.trim()}\n`;
      }) + '\n\n';
    });
    
    // 12. Resolve CodeSnippet tags
    const relativeDir = path.dirname(relativePath);
    const codeSnippetRegex = /<CodeSnippet\s+[^>]*srcCode=\{([^}]+)\}[^>]*>(?:<\/CodeSnippet>)?/g;
    jsxBody = jsxBody.replace(codeSnippetRegex, (match, expr) => {
      const code = resolveCodeSnippet(expr, relativeDir);
      return `\n\n[code]\n${code.trim()}\n[/code]\n\n`;
    });
    
    // 13. Replace html entities
    jsxBody = jsxBody.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    
    // 14. Clean up multiple newlines and spaces
    jsxBody = jsxBody.replace(/\n{3,}/g, '\n\n').trim();
    
    // Calculate readTime dynamically
    const words = jsxBody.replace(/\[code\][\s\S]*?\[\/code\]/g, '').split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(words / 200)) + " min read";

    // Reformat date as Month Day, Year
    const dateStr = formatDate(matchedArticle.postedDate);

    // Build final file content
    const markdownContent = `---
title: "${matchedArticle.title}"
date: "${dateStr}"
excerpt: "${matchedArticle.summary}"
readTime: "${readTime}"
category: "${categoryName}"
---

${jsxBody}
`;

    // Write markdown file
    const outputFilePath = path.join(contentArticlesDir, `${articleSlug}.md`);
    fs.writeFileSync(outputFilePath, markdownContent, 'utf8');
    console.log(`Successfully migrated ${relativePath} to src/content/articles/${articleSlug}.md`);
  }
  
  console.log("Migration complete!");
}

migrate();
