// Utility to remove outer background from pixel art sprites and create transparent PNGs in-memory

const cache = new Map<string, string>();

/**
 * Strips outer background from a sprite image using edge-connected flood-fill & color thresholding,
 * returning a true transparent PNG data URL.
 */
export function removeBackground(
  imageSrc: string,
  threshold: number = 45
): Promise<string> {
  if (cache.has(imageSrc)) {
    return Promise.resolve(cache.get(imageSrc)!);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      // Sample 4 corners for background reference
      const c1 = [data[0], data[1], data[2]];
      const c2 = [data[(width - 1) * 4], data[(width - 1) * 4 + 1], data[(width - 1) * 4 + 2]];
      const c3 = [data[(height - 1) * width * 4], data[(height - 1) * width * 4 + 1], data[(height - 1) * width * 4 + 2]];
      const c4 = [data[((height - 1) * width + width - 1) * 4], data[((height - 1) * width + width - 1) * 4 + 1], data[((height - 1) * width + width - 1) * 4 + 2]];

      const bgR = (c1[0] + c2[0] + c3[0] + c4[0]) / 4;
      const bgG = (c1[1] + c2[1] + c3[1] + c4[1]) / 4;
      const bgB = (c1[2] + c2[2] + c3[2] + c4[2]) / 4;

      const visited = new Uint8Array(width * height);
      const queue: number[] = [];

      function isBgColor(r: number, g: number, b: number): boolean {
        const dist = Math.sqrt(
          (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2
        );
        return dist < threshold;
      }

      // Add all boundary pixels that match background to the flood-fill queue
      for (let x = 0; x < width; x++) {
        // Top edge
        const topIdx = x;
        const topPx = topIdx * 4;
        if (isBgColor(data[topPx], data[topPx + 1], data[topPx + 2])) {
          visited[topIdx] = 1;
          queue.push(topIdx);
        }

        // Bottom edge
        const botIdx = (height - 1) * width + x;
        const botPx = botIdx * 4;
        if (isBgColor(data[botPx], data[botPx + 1], data[botPx + 2])) {
          visited[botIdx] = 1;
          queue.push(botIdx);
        }
      }

      for (let y = 0; y < height; y++) {
        // Left edge
        const leftIdx = y * width;
        const leftPx = leftIdx * 4;
        if (isBgColor(data[leftPx], data[leftPx + 1], data[leftPx + 2])) {
          visited[leftIdx] = 1;
          queue.push(leftIdx);
        }

        // Right edge
        const rightIdx = y * width + (width - 1);
        const rightPx = rightIdx * 4;
        if (isBgColor(data[rightPx], data[rightPx + 1], data[rightPx + 2])) {
          visited[rightIdx] = 1;
          queue.push(rightIdx);
        }
      }

      // Flood fill from boundaries inward
      let head = 0;
      while (head < queue.length) {
        const curr = queue[head++];
        const cx = curr % width;
        const cy = Math.floor(curr / width);

        // Make this pixel transparent
        data[curr * 4 + 3] = 0;

        // Check 4 neighbors
        const neighbors = [
          [cx + 1, cy],
          [cx - 1, cy],
          [cx, cy + 1],
          [cx, cy - 1],
        ];

        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = ny * width + nx;
            if (!visited[nIdx]) {
              visited[nIdx] = 1;
              const nPx = nIdx * 4;
              if (isBgColor(data[nPx], data[nPx + 1], data[nPx + 2])) {
                queue.push(nIdx);
              }
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const transparentUrl = canvas.toDataURL('image/png');
      cache.set(imageSrc, transparentUrl);
      resolve(transparentUrl);
    };

    img.onerror = () => {
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
}
