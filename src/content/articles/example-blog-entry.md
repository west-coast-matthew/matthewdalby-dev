---
title: "Example Blog Entry"
date: "May 21, 2026"
excerpt: "A template entry showing how to use the new DSL-based markdown templates for articles, inclusive of code blocks and media syntax."
readTime: "3 min read"
category: "Guide"
---

# Getting Started with the DSL Markdown Blog

Welcome to the new article templating system! This approach allows you to write all your articles using markdown syntax, supplemented with a custom DSL (Domain Specific Language) for rich features such as responsive image grids, video modals, and code snippets.

## Basic Formatting

You can write normal paragraphs, **bold text**, *italicized text*, and standard headers. The engine parses these structures dynamically. For example, you can write headings from `#` down to `####`.

### Heading 3 Example

This is a paragraph under a heading 3. The markdown parsing handles headers automatically.

## Standard Markdown vs Custom DSL

One of the main benefits is that you can use normal single quotes like 'this' or 'it's easy' directly in your markdown files, and the template engine renders them safely without compilation or linting warnings.

### Including Images

To include an image, use the custom double-pipe syntax inside brackets:
`[Image Title || Optional description text || /image-path.png]`

Here is an example:
[Example Image||A placeholder image displaying a modern blog system workspace.||/images/example-placeholder.jpg]

### Including Videos

Similarly, you can include videos using this syntax:
`[Video Title || / || Optional description text || /video-path.mp4]`

Here is an example:
[Example Video||/||A short recording demonstrating how the user interface interactions behave.||/videos/example-demo.mp4]

### Code Snippets

To write code blocks, you can wrap them in `[code: title]` and `[/code]` tags. This will automatically format the code with syntax highlighting and toggles.

[code: JavaScript Example]
const hello = "world";
console.log(`Hello, ${hello}!`);
[/code]

We look forward to seeing your migrated articles!
