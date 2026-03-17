import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Preloads a JPEG frame sequence and exposes a draw(progress) function
 * that paints the correct frame onto a <canvas>.
 *
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef
 * @param {{ path: string, prefix: string, total: number }} opts
 * @returns {{ ready: boolean, loaded: number, total: number, draw: (progress: number) => void }}
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

  /** Build the URL for a 1-indexed frame number. */
  const frameUrl = useCallback(
    (i) => `${path}/${prefix}-${String(i).padStart(4, '0')}.${ext}`,
    [path, prefix, ext]
  );

  // ── Preload all frames ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const imgs = new Array(total);
    let count = 0;

    const onComplete = () => {
      if (cancelled) return;
      count++;
      setLoaded(count);
      if (count === total) {
        images.current = imgs;
        setReady(true);
      }
    };

    for (let i = 0; i < total; i++) {
      const img = new Image();
      img.src = frameUrl(i + 1); // 1-indexed filenames
      img.onload = () => { imgs[i] = img; onComplete(); };
      img.onerror = onComplete; // count it so we don't hang
    }

    // Draw frame 1 as soon as it loads (perceived instant start)
    const first = new Image();
    first.src = frameUrl(1);
    first.onload = () => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = first.naturalWidth;
      canvas.height = first.naturalHeight;
      ctx.drawImage(first, 0, 0);
    };

    return () => { cancelled = true; };
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

    // Skip redundant draws — same frame is already on screen
    if (index === lastIndexRef.current) return;
    lastIndexRef.current = index;

    const img = imgs[index];
    if (!img) return;

    const ctx = canvas.getContext('2d');
    if (canvas.width !== img.naturalWidth) canvas.width = img.naturalWidth;
    if (canvas.height !== img.naturalHeight) canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, [canvasRef, total]);

  return { ready, loaded, total, draw };
}
