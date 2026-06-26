'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  videoUrl?: string | null;
}

export default function ImageGallery({ images, videoUrl }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Combine images and video into a single gallery list
  // The structure is: { type: 'image' | 'video', url: string }
  const mediaItems: { type: 'image' | 'video'; url: string }[] = images.map((url) => ({
    type: 'image',
    url,
  }));

  if (videoUrl) {
    mediaItems.push({
      type: 'video',
      url: videoUrl,
    });
  }

  const activeMedia = mediaItems[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  // Helper to determine if video is a YouTube embed or direct URL
  const renderVideoPlayer = (url: string) => {
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    
    if (isYouTube) {
      // Basic youtube parser
      let embedId = '';
      if (url.includes('v=')) {
        embedId = url.split('v=')[1]?.split('&')[0];
      } else {
        embedId = url.split('/').pop() || '';
      }
      return (
        <iframe
          src={`https://www.youtube.com/embed/${embedId}`}
          className="absolute inset-0 h-full w-full rounded-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }

    return (
      <video
        src={url}
        controls
        className="absolute inset-0 h-full w-full rounded-2xl object-contain bg-slate-900"
      />
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Active Media Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm md:aspect-square">
        {activeMedia?.type === 'image' ? (
          <div className="relative h-full w-full group cursor-zoom-in" onClick={() => setIsZoomed(true)}>
            <Image
              src={activeMedia.url}
              alt="Active product media"
              fill
              priority
              className="object-cover object-center transition-opacity"
            />
            {/* Zoom Overlay Indicator */}
            <div className="absolute right-4 bottom-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-md backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="h-4 w-4" />
            </div>
          </div>
        ) : (
          <div className="relative h-full w-full">
            {renderVideoPlayer(activeMedia?.url)}
          </div>
        )}

        {/* Carousel Arrow Controls (only show if multi-media) */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-[2px] hover:bg-blue-600 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-[2px] hover:bg-blue-600 hover:text-white transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails list */}
      {mediaItems.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {mediaItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border bg-slate-50 transition-all sm:w-20 ${
                activeIndex === idx
                  ? 'border-blue-600 ring-2 ring-blue-100'
                  : 'border-slate-100 opacity-70 hover:opacity-100'
              }`}
            >
              {item.type === 'image' ? (
                <Image
                  src={item.url}
                  alt={`Thumbnail ${idx}`}
                  fill
                  className="object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-white">
                  <Play className="h-5 w-5 fill-current text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Click to Zoom Lightbox Modal */}
      {isZoomed && activeMedia?.type === 'image' && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="relative h-full max-h-[85vh] w-full max-w-5xl">
            <Image
              src={activeMedia.url}
              alt="Zoomed Product View"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
