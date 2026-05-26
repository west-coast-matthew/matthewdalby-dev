"use client";

import { useState, ReactNode, FC } from "react";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, Share2, Printer, Play } from "lucide-react";
import { Fade } from "react-awesome-reveal";
import { VideoModal, type VideoContent } from "@/components/VideoModal/VideoModal";
import { ImageModal, type ModalImage } from "@/components/ImageModal/ImageModal";
import CodeSnippet from "@/components/CodeSnippet";
import { type BlogPost } from "@/lib/blog-loader";
import styles from "./PostClient.module.scss";

interface PostClientProps {
  post: BlogPost;
  backUrl: string;
  backLabel: string;
}

export const PostClient: FC<PostClientProps> = ({ post, backUrl, backLabel }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoContent | null>(null);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<ModalImage | null>(null);

  const handleOpenVideo = (title: string, url: string, description?: string) => {
    setCurrentVideo({ title, url, description });
    setIsVideoModalOpen(true);
  };

  const handleOpenImage = (title: string, src: string, alt: string, description?: string) => {
    setCurrentImage({ title, src, alt, description });
    setIsImageModalOpen(true);
  };

  const parseInlineMarkdown = (text: string) => {
    if (!text) return text;

    // Handle bold (**text**) and italics (*text*)
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className={styles["bold-text"]}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className={styles["italic-text"]}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const renderContent = (content: string) => {
    if (!content || typeof content !== 'string') return null;
    const lines = content.split('\n');
    const elements: ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed === '') {
        i++;
        continue;
      }

      // Headers
      if (trimmed.startsWith('#### ')) {
        elements.push(<h4 key={i} className={styles["heading-4"]}>{parseInlineMarkdown(trimmed.substring(5))}</h4>);
        i++; continue;
      }
      if (trimmed.startsWith('### ')) {
        elements.push(<h3 key={i} className={styles["heading-3"]}>{parseInlineMarkdown(trimmed.substring(4))}</h3>);
        i++; continue;
      }
      if (trimmed.startsWith('## ')) {
        elements.push(<h2 key={i} className={styles["heading-2"]}>{parseInlineMarkdown(trimmed.substring(3))}</h2>);
        i++; continue;
      }
      if (trimmed.startsWith('# ')) {
        elements.push(<h1 key={i} className={styles["heading-1"]}>{parseInlineMarkdown(trimmed.substring(2))}</h1>);
        i++; continue;
      }

      // Blockquote: lines starting with >
      if (trimmed.startsWith('>')) {
        let quoteLines = [];
        let j = i;
        while (j < lines.length) {
          const currentTrimmed = lines[j].trim();
          if (currentTrimmed === '') break;
          if (currentTrimmed.startsWith('>')) {
            quoteLines.push(currentTrimmed.substring(1).trim());
            j++;
          } else {
            break;
          }
        }
        elements.push(
          <blockquote key={i} className={styles["blockquote"]}>
            <span className={styles["quote-mark-left"]}>&ldquo;</span>
            <span className={styles["quote-content"]}>
              {parseInlineMarkdown(quoteLines.join(' '))}
            </span>
            <span className={styles["quote-mark-right"]}>&rdquo;</span>
          </blockquote>
        );
        i = j;
        continue;
      }

      // Code Block: [code: title] ... [/code]
      if (trimmed.startsWith('[code')) {
        const titleMatch = trimmed.match(/\[code:\s*(.*?)\]/i);
        const title = titleMatch ? titleMatch[1] : '';
        let codeLines = [];
        i++; // skip opening tag
        while (i < lines.length && !lines[i].trim().startsWith('[/code]')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing tag
        elements.push(
          <div key={i} className={styles["code-wrapper"]}>
            {title && <div className={styles["code-title"]}>{title}</div>}
            <CodeSnippet srcCode={codeLines.join('\n')} />
          </div>
        );
        continue;
      }

      // Media Tags: [title || description || path] or [title || path]
      const mediaTagRegex = /\[(.*?)\]/g;
      const matches = [...trimmed.matchAll(mediaTagRegex)];

      // Media Tags: Group consecutive lines containing media tags
      if (matches.length > 0 && (trimmed.includes('||') || trimmed.startsWith('[VIDEO_CTA:'))) {
        const mediaGroup: ReactNode[] = [];
        let j = i;

        // Look ahead to group consecutive lines with media tags
        while (j < lines.length) {
          const nextLine = lines[j].trim();
          if (nextLine === '') {
            // Allow single empty lines between consecutive media blocks for grouping
            const followUpLine = lines[j + 1]?.trim() || '';
            const followUpMatches = [...followUpLine.matchAll(mediaTagRegex)];
            if (followUpMatches.length > 0 && (followUpLine.includes('||') || followUpLine.startsWith('[VIDEO_CTA:'))) {
              j++;
              continue;
            }
            break;
          }

          const nextMatches = [...nextLine.matchAll(mediaTagRegex)];
          if (nextMatches.length > 0 && (nextLine.includes('||') || nextLine.startsWith('[VIDEO_CTA:'))) {
            nextMatches.forEach((match, idx) => {
              const rawTag = match[1];
              let title = '';
              let description = '';
              let path = '';

              if (rawTag.startsWith('VIDEO_CTA:')) {
                const parts = rawTag.substring(10).split(':');
                title = parts[0];
                path = parts[1];
                const thumb = parts[2] || '/image-placeholder.png';
                mediaGroup.push(renderMediaBlock(title, '', path, thumb, 'video', `media-${j}-${idx}`));
              } else if (rawTag.includes('||')) {
                const parts = rawTag.split('||').map(p => p.trim());
                if (parts.length >= 2) {
                  let title = '', description = '', path = '', thumb = '';

                  if (parts.length === 4) {
                    [title, description, thumb, path] = parts;
                  } else if (parts.length === 3) {
                    [title, description, path] = parts;
                    const isVideo = /\.(mp4|webm|ogg)$/i.test(path) || /youtube\.com|youtu\.be/i.test(path);
                    const isImg = /\.(png|jpg|jpeg|webp)$/i.test(description);
                    if (isVideo && isImg) {
                      thumb = description;
                      description = '';
                    }
                  } else {
                    [title, path] = parts;
                  }

                  const isVideo = /\.(mp4|webm|ogg)$/i.test(path) || /youtube\.com|youtu\.be/i.test(path);
                  const type: 'video' | 'image' = isVideo ? 'video' : 'image';

                  if (type === 'image') {
                    thumb = path;
                  } else if (!thumb) {
                    thumb = '/video-placeholder.png';
                  }

                  mediaGroup.push(renderMediaBlock(title, description, path, thumb, type, `media-${j}-${idx}`));
                }
              }
            });
            j++;
          } else {
            break;
          }
        }

        if (mediaGroup.length > 0) {
          const isSingle = mediaGroup.length === 1;
          const gridClass = isSingle ? styles["media-grid-single"] : styles["media-grid-multi"];

          elements.push(
            <div key={i} className={`${styles["media-grid-wrapper"]} ${gridClass}`}>
              {mediaGroup.map((item) => item)}
            </div>
          );
          i = j;
          continue;
        }
      }

      // Unordered Lists: lines starting with * or -
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const listItems: string[] = [];
        let j = i;
        let currentItemText = '';

        while (j < lines.length) {
          const currentLine = lines[j];
          const currentTrimmed = currentLine.trim();

          if (currentTrimmed === '') {
            // Check if we have another list item following this empty line
            let nextIndex = j + 1;
            let foundNextItem = false;
            while (nextIndex < lines.length) {
              const nextLineTrimmed = lines[nextIndex].trim();
              if (nextLineTrimmed !== '') {
                if (nextLineTrimmed.startsWith('* ') || nextLineTrimmed.startsWith('- ')) {
                  foundNextItem = true;
                }
                break;
              }
              nextIndex++;
            }
            if (foundNextItem) {
              if (currentItemText) {
                listItems.push(currentItemText);
                currentItemText = '';
              }
              j = nextIndex - 1;
            } else {
              break;
            }
          } else if (currentTrimmed.startsWith('* ') || currentTrimmed.startsWith('- ')) {
            if (currentItemText) {
              listItems.push(currentItemText);
            }
            currentItemText = currentTrimmed.substring(2).trim();
          } else {
            // Continuation line
            if (currentTrimmed.startsWith('#') || currentTrimmed.startsWith('[code') || currentTrimmed.startsWith('[/code]') || /^\d+\.\s+/.test(currentTrimmed)) {
              break;
            }
            const nextMatches = [...currentTrimmed.matchAll(mediaTagRegex)];
            if (nextMatches.length > 0 && (currentTrimmed.includes('||') || currentTrimmed.startsWith('[VIDEO_CTA:'))) {
              break;
            }
            currentItemText = currentItemText ? `${currentItemText} ${currentTrimmed}` : currentTrimmed;
          }
          j++;
        }

        if (currentItemText) {
          listItems.push(currentItemText);
        }

        elements.push(
          <ul key={`ul-${i}`} className={styles["unordered-list"]}>
            {listItems.map((itemText, idx) => (
              <li key={`li-${i}-${idx}`} className={styles["list-item"]}>
                {parseInlineMarkdown(itemText)}
              </li>
            ))}
          </ul>
        );
        i = j;
        continue;
      }

      // Ordered Lists: lines starting with numbers
      if (/^\d+\.\s+/.test(trimmed)) {
        const listItems: string[] = [];
        let j = i;
        let currentItemText = '';

        while (j < lines.length) {
          const currentLine = lines[j];
          const currentTrimmed = currentLine.trim();

          if (currentTrimmed === '') {
            // Check if we have another list item following this empty line
            let nextIndex = j + 1;
            let foundNextItem = false;
            while (nextIndex < lines.length) {
              const nextLineTrimmed = lines[nextIndex].trim();
              if (nextLineTrimmed !== '') {
                if (/^\d+\.\s+/.test(nextLineTrimmed)) {
                  foundNextItem = true;
                }
                break;
              }
              nextIndex++;
            }
            if (foundNextItem) {
              if (currentItemText) {
                listItems.push(currentItemText);
                currentItemText = '';
              }
              j = nextIndex - 1;
            } else {
              break;
            }
          } else if (/^\d+\.\s+/.test(currentTrimmed)) {
            if (currentItemText) {
              listItems.push(currentItemText);
            }
            const match = currentTrimmed.match(/^\d+\.\s+(.*)/);
            currentItemText = match ? match[1].trim() : currentTrimmed;
          } else {
            // Continuation line
            if (currentTrimmed.startsWith('#') || currentTrimmed.startsWith('[code') || currentTrimmed.startsWith('[/code]') || currentTrimmed.startsWith('* ') || currentTrimmed.startsWith('- ')) {
              break;
            }
            const nextMatches = [...currentTrimmed.matchAll(mediaTagRegex)];
            if (nextMatches.length > 0 && (currentTrimmed.includes('||') || currentTrimmed.startsWith('[VIDEO_CTA:'))) {
              break;
            }
            currentItemText = currentItemText ? `${currentItemText} ${currentTrimmed}` : currentTrimmed;
          }
          j++;
        }

        if (currentItemText) {
          listItems.push(currentItemText);
        }

        elements.push(
          <ol key={`ol-${i}`} className={styles["unordered-list"]} style={{ listStyleType: "decimal" }}>
            {listItems.map((itemText, idx) => (
              <li key={`ol-li-${i}-${idx}`} className={styles["list-item"]}>
                {parseInlineMarkdown(itemText)}
              </li>
            ))}
          </ol>
        );
        i = j;
        continue;
      }

      // Default paragraph: group consecutive regular lines to prevent each line being rendered in its own <p>
      const paragraphLines: string[] = [];
      let j = i;
      while (j < lines.length) {
        const currentLine = lines[j];
        const currentTrimmed = currentLine.trim();

        if (currentTrimmed === '') break;
        if (currentTrimmed.startsWith('#')) break;
        if (currentTrimmed.startsWith('>')) break;
        if (currentTrimmed.startsWith('[code')) break;
        if (currentTrimmed.startsWith('[/code]')) break;
        if (currentTrimmed.startsWith('* ') || currentTrimmed.startsWith('- ')) break;
        if (/^\d+\.\s+/.test(currentTrimmed)) break;

        const nextMatches = [...currentTrimmed.matchAll(mediaTagRegex)];
        if (nextMatches.length > 0 && (currentTrimmed.includes('||') || currentTrimmed.startsWith('[VIDEO_CTA:'))) {
          break;
        }

        paragraphLines.push(currentTrimmed);
        j++;
      }

      if (paragraphLines.length > 0) {
        elements.push(
          <p key={i} className={styles["paragraph"]}>
            {parseInlineMarkdown(paragraphLines.join(' '))}
          </p>
        );
        i = j;
      } else {
        i++;
      }
    }

    return elements;
  };

  const renderMediaBlock = (title: string, description: string, path: string, thumb: string, type: 'video' | 'image', key: string) => {
    return (
      <div key={key} className={styles["media-card"]}>
        <div className={styles["media-thumbnail-container"]}>
          <img
            src={thumb}
            alt={title}
            className={styles["media-thumbnail"]}
          />
          <div className={styles["media-overlay-play"]}>
            <button
              onClick={() => type === 'video' ? handleOpenVideo(title, path, description) : handleOpenImage(title, path, title, description)}
              className={styles["play-button"]}
            >
              <Play className={styles["play-icon"]} />
            </button>
          </div>
        </div>
        <div className={styles["media-info"]}>
          <h4 className={styles["media-title"]}>{title}</h4>
          <button
            onClick={() => type === 'video' ? handleOpenVideo(title, path, description) : handleOpenImage(title, path, title, description)}
            className={styles["view-button"]}
          >
            View
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className={styles["detail-layout"]}>
      {/* Background Decorative Blur Gradients */}
      <div className={styles["glow-1"]} />
      <div className={styles["glow-2"]} />

      <div className={styles["detail-container"]}>
        <Fade delay={50} duration={300} triggerOnce>
          <Link
            href={backUrl}
            className={styles["back-link"]}
          >
            <ChevronLeft className={styles["back-icon"]} />
            {backLabel}
          </Link>
        </Fade>

        <article className={styles["article-body"]}>
          <header className={styles["article-header"]}>
            <Fade delay={100} duration={300} triggerOnce>
              <div className={styles["category-badge"]}>
                <span>{post.category}</span>
              </div>
            </Fade>

            <Fade delay={150} duration={350} triggerOnce>
              <h1 className={styles["article-title"]}>
                {post.title}
              </h1>
            </Fade>

            <Fade delay={200} duration={400} triggerOnce>
              <div className={styles["article-meta-bar"]}>
                <div className={styles["meta-item"]}>
                  <Calendar className={styles["meta-icon"]} />
                  {post.date}
                </div>
                <div className={styles["meta-item"]}>
                  <Clock className={styles["meta-icon"]} />
                  {post.readTime}
                </div>
                <div className={styles["meta-item-separator"]} />
                <div className={styles["meta-author"]}>
                  By Matthew Dalby
                </div>

                <div className={styles["meta-spacer"]} />

                <div className={styles["meta-actions"]}>
                  <button className={styles["action-btn"]} aria-label="Share">
                    <Share2 className={styles["action-icon"]} />
                  </button>
                  <button className={styles["action-btn"]} aria-label="Print" onClick={() => window.print()}>
                    <Printer className={styles["action-icon"]} />
                  </button>
                </div>
              </div>
            </Fade>
          </header>

          <Fade delay={250} duration={450} triggerOnce>
            <div className={styles["content-card"]}>
              <div className={styles["prose-content"]}>
                {renderContent(post.content)}
              </div>
            </div>
          </Fade>
        </article>
      </div>

      <VideoModal
        isOpen={isVideoModalOpen}
        video={currentVideo}
        onClose={() => setIsVideoModalOpen(false)}
      />

      <ImageModal
        isOpen={isImageModalOpen}
        image={currentImage}
        onClose={() => setIsImageModalOpen(false)}
      />
    </main>
  );
};

export default PostClient;
