import { useEffect, useRef, useState, useCallback } from 'react';

const MAX_RETRIES = 3;

/**
 * Preloads a frame sequence and exposes a draw(progress) function
 * that paints the correct frame onto a <canvas>.
 */
export default function useFrameSequence(canvasRef, {
  path = '/frames',
  prefix = 'hero',
  total = 192,
  ext = 'jpg',
} = {}) {
  const images = useRef([]);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const lastIndexRef = useRef(-1);
  const firstDrawnRef = useRef(false);
  const ctxRef = useRef(null);

  const frameUrl = useCallback(
    (i) => `${path}/${prefix}-${String(i).padStart(4, '0')}.${ext}`,
    [path, prefix, ext]
  );

  // ── Preload all frames in parallel with retry ───────────────────
  useEffect(() => {
    let cancelled = false;
    const imgs = new Array(total);
    let completedCount = 0;
    let rafId = null;
    let pendingUpdate = false;

    // Batch state updates via rAF to avoid 192 individual re-renders
    function scheduleUpdate() {
      if (pendingUpdate) return;
      pendingUpdate = true;
      rafId = requestAnimationFrame(() => {
        pendingUpdate = false;
        if (!cancelled) setLoaded(completedCount);
      });
    }

    function loadWithRetry(i, retries) {
      const img = new Image();
      img.src = frameUrl(i + 1);
      img.onload = () => {
        if (cancelled) return;
        imgs[i] = img;
        completedCount++;
        scheduleUpdate();

        // Draw frame 1 immediately for perceived instant start
        if (i === 0 && !firstDrawnRef.current) {
          firstDrawnRef.current = true;
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              ctx.drawImage(img, 0, 0);
              ctxRef.current = ctx;
            }
          }
        }

        if (completedCount === total) {
          images.current = imgs;
          if (!cancelled) setReady(true);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        if (retries < MAX_RETRIES) {
          setTimeout(() => loadWithRetry(i, retries + 1), 300 * (retries + 1));
        } else {
          // Count permanent failure so we don't hang forever
          completedCount++;
          scheduleUpdate();
          if (completedCount === total) {
            images.current = imgs;
            if (!cancelled) setReady(true);
          }
        }
      };
    }

    // Fire all requests — browser connection pool handles concurrency
    for (let i = 0; i < total; i++) {
      loadWithRetry(i, 0);
    }

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [canvasRef, frameUrl, total]);

  // ── Draw the frame for a given scroll progress (0–1) ───────────
  const draw = useCallback((progress) => {
    const canvas = canvasRef.current;
    const imgs = images.current;
    if (!canvas || imgs.length === 0) return;

    const index = Math.min(
      total - 1,
      Math.max(0, Math.round(progress * (total - 1)))
    );

    if (index === lastIndexRef.current) return;
    lastIndexRef.current = index;

    const img = imgs[index];
    if (!img) return;

    // Cache the context to avoid repeated getContext calls
    let ctx = ctxRef.current;
    if (!ctx) {
      ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctxRef.current = ctx;
    }

    if (canvas.width !== img.naturalWidth) canvas.width = img.naturalWidth;
    if (canvas.height !== img.naturalHeight) canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, [canvasRef, total]);

  return { ready, loaded, total, draw };
}
