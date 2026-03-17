/**
 * Extract frames from hero video for canvas-based scroll playback.
 * Uses ffmpeg-static (no system install required).
 *
 * Usage:  node scripts/extract-frames.mjs
 * Output: public/frames/hero-0001.jpg … hero-NNNN.jpg
 */

import { execSync } from 'node:child_process';
import { mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ffmpeg = require('ffmpeg-static');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const INPUT = resolve(ROOT, 'public/assets/animation-2.mp4');
const OUTPUT_DIR = resolve(ROOT, 'public/frames');

// JPEG quality (2 = high quality, lower = better, range 2-31)
const QUALITY = 3;

mkdirSync(OUTPUT_DIR, { recursive: true });

console.log('Extracting frames…');
console.log(`  Input:   ${INPUT}`);
console.log(`  Output:  ${OUTPUT_DIR}`);
console.log(`  Quality: qscale ${QUALITY}`);

execSync(
  `"${ffmpeg}" -i "${INPUT}" -qscale:v ${QUALITY} "${resolve(OUTPUT_DIR, 'hero-%04d.jpg')}"`,
  { stdio: 'inherit', timeout: 60_000 }
);

const frames = readdirSync(OUTPUT_DIR).filter(f => f.startsWith('hero-') && f.endsWith('.jpg'));
console.log(`\nDone — ${frames.length} frames extracted to public/frames/`);
