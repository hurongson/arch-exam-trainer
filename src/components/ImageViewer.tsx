'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ImageViewerProps {
  src: string;
  alt: string;
  title?: string;
}

/**
 * 图片查看器 - 支持点击放大、滚轮缩放、拖拽移动
 */
export function ImageViewer({ src, alt, title }: ImageViewerProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 重置状态
  const reset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // 打开查看器
  const openViewer = () => {
    reset();
    setOpen(true);
  };

  // 关闭查看器
  const closeViewer = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  // 滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => {
      const next = Math.min(Math.max(prev + delta, 0.5), 5);
      return next;
    });
  }, []);

  // 鼠标按下开始拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // 鼠标移动拖拽
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  // 鼠标松开结束拖拽
  const handleMouseUp = () => {
    setDragging(false);
  };

  // 放大
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 5));
  };

  // 缩小
  const zoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.25, 0.5);
      if (next <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  // 键盘事件
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeViewer();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === '0') reset();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, closeViewer, reset]);

  // 防止背景滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* 缩略图 - 点击放大 */}
      <div
        onClick={openViewer}
        className="group relative cursor-zoom-in overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all hover:border-primary-300 hover:shadow-md"
      >
        <img
          src={src}
          alt={alt}
          className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
          style={{ maxHeight: '400px', objectFit: 'contain' }}
        />
        <div className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="h-4 w-4 text-white" />
        </div>
        {title && (
          <div className="border-t border-gray-100 bg-white px-3 py-2">
            <p className="text-xs font-medium text-gray-700">{title}</p>
          </div>
        )}
      </div>

      {/* 全屏查看器 */}
      {open && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
          onClick={closeViewer}
          onWheel={handleWheel}
        >
          {/* 顶部工具栏 */}
          <div
            className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/10 px-2 py-1.5 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={zoomOut}
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              title="缩小 (-)"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[50px] text-center text-xs font-medium text-white/80">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              title="放大 (+)"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={reset}
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              title="重置 (0)"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <div className="mx-1 h-4 w-px bg-white/20" />
            <button
              onClick={closeViewer}
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              title="关闭 (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 图片标题 */}
          {title && (
            <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 backdrop-blur-sm">
              <p className="text-sm font-medium text-white">{title}</p>
            </div>
          )}

          {/* 图片容器 */}
          <div
            className={`flex h-full w-full items-center justify-center ${dragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-zoom-out'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => {
              if (scale <= 1) closeViewer();
              e.stopPropagation();
            }}
          >
            <img
              src={src}
              alt={alt}
              className="max-h-[90vh] max-w-[90vw] select-none object-contain transition-transform duration-75"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              }}
              draggable={false}
            />
          </div>

          {/* 操作提示 */}
          <div className="absolute bottom-6 right-6 z-10 text-right text-[11px] text-white/50">
            <p>滚轮缩放 · 拖拽移动 · Esc关闭</p>
          </div>
        </div>
      )}
    </>
  );
}
