"use client";

import { useEffect, FC } from "react";
import { X } from "lucide-react";
import styles from "./VideoModal.module.scss";

export interface VideoContent {
  url: string;
  title?: string;
  description?: string;
}

interface VideoModalProps {
  isOpen: boolean;
  video: VideoContent | null;
  onClose: () => void;
}

export const VideoModal: FC<VideoModalProps> = ({ isOpen, video, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  // Determine if it's a YouTube URL and convert to embed format
  const getEmbedUrl = (url: string) => {
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(youtubeRegex);

    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(video.url);
  const isYouTube = embedUrl.includes("youtube.com/embed");

  return (
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div className={styles["modal-container"]} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={styles["close-button"]}
          aria-label="Close modal"
        >
          <X className={styles["close-icon"]} />
        </button>

        {/* Video Content */}
        <div className={styles["video-container"]}>
          {isYouTube ? (
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={video.title || "Video"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles["iframe-video"]}
            />
          ) : (
            <video
              src={video.url}
              controls
              autoPlay
              className={styles["native-video"]}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Caption/Description */}
        {(video.title || video.description) && (
          <div className={styles["caption-panel"]}>
            {video.title && <h3 className={styles["caption-title"]}>{video.title}</h3>}
            {video.description && (
              <p className={styles["caption-description"]}>{video.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoModal;
