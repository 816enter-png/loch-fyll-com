import { useEffect, useRef, useState, useCallback } from 'react';

const BATCH_SIZE = 12;
const MAX_RETRIES = 3;

/**
 * Preloads a frame sequence in batches and exposes a draw(progress) function
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

  const frameUrl = useCallback(
    (i) => `${path}/${prefix}-${String(i).padStart(4, '0')}.${ext}`,
    [path, prefix, ext]
  );

  // ── Load a single frame with retry ──────────────────────────────
  const loadFrame = useCallback((url, retries = 0) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => {
        if (retries < MAX_RETRIES) {
          setTimeout(() => resolve(loadFrame(url, retries + 1)), 200 * (retries + 1));
        } else {
          resolve(null);
        }
      };
    });
  }, []);

  // ── Preload frames in batches ───────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const imgs = new Array(total);
    let completedCount = 0;

    async function preload() {
      for (let batchStart = 0; batchStart < total; batchStart += BATCH_SIZE) {
        if (cancelled) return;

        const batchEnd = Math.min(batchStart + BATCH_SIZE, total);
        const batch = [];

        for (let i = batchStart; i < batchEnd; i++) {
          batch.push(
            loadFrame(frameUrl(i + 1)).then((img) => {
              if (cancelled) return;
              if (img) imgs[i] = img;
              completedCount++;
              setLoaded(completedCount);

              // Draw frame 1 immediately for perceived instant start
              if (i === 0 && img && !firstDrawnRef.current) {
                firstDrawnRef.current = true;
                const canvas = canvasRef.current;
                if (canvas) {
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    ctx.drawImage(img, 0, 0);
                  }
                }
              }
            })
          );
        }

        await Promise.all(batch);
      }

      if (!cancelled) {
        images.current = imgs;
        setReady(true);
      }
    }

    preload();
    return () => { cancelled = true; };
  }, [canvasRef, frameUrl, total, loadFrame]);

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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (canvas.width !== img.naturalWidth) canvas.width = img.naturalWidth;
    if (canvas.height !== img.naturalHeight) canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, [canvasRef, total]);

  return { ready, loaded, total, draw };
}
