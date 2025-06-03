/**
 * Applies feather effect by adjusting the alpha channel of a pixel.
 *
 * @param data - The ImageData.data Uint8ClampedArray containing pixel RGBA values.
 * @param idx - The starting index of the pixel (pixel position * 4).
 * @param featherAlpha - Feather alpha value between 0 (no effect) and 1 (full fade).
 * @param strength - Strength multiplier for the feather effect (default is 1).
 */
export const applyFeatherAlpha = (
    data: Uint8ClampedArray,
    idx: number,
    featherAlpha: number,
    strength: number = 1
): void => {
    const alpha = data[idx + 3];
    const fadedAlpha = alpha * (1 - featherAlpha * strength);
    data[idx + 3] = Math.max(0, Math.min(alpha, fadedAlpha));
};

export const eraseAlphaBorder = (
    canvas: HTMLCanvasElement,
    radius: number = 2
) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const getAlpha = (x: number, y: number) => {
        if (x < 0 || y < 0 || x >= width || y >= height) return 0;
        return data[(y * width + x) * 4 + 3];
    };

    const setAlpha = (x: number, y: number, alpha: number) => {
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        const index = (y * width + x) * 4;
        data[index + 3] = Math.max(0, Math.min(255, alpha));
    };

    const featherTargets: [number, number][] = [];

    // Step 1: Find pixels near transparent border
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const alpha = getAlpha(x, y);
            if (alpha === 0) continue;

            let nearTransparent = false;
            for (let dy = -1; dy <= 1 && !nearTransparent; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    if (getAlpha(x + dx, y + dy) === 0) {
                        nearTransparent = true;
                        break;
                    }
                }
            }

            if (nearTransparent) {
                featherTargets.push([x, y]);
            }
        }
    }

    // Step 2: Apply feather erase to each target
    for (const [cx, cy] of featherTargets) {
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const nx = cx + dx;
                const ny = cy + dy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > radius) continue;

                const falloff = Math.pow(1 - dist / radius, 2);
                const originalAlpha = getAlpha(nx, ny);
                const newAlpha = Math.floor(originalAlpha * falloff);
                setAlpha(nx, ny, newAlpha);
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
};


export function drawImageToCanvas(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  offCanvas: HTMLCanvasElement
) {
  const ctx = canvas.getContext("2d");
  const offCtx = offCanvas.getContext("2d");
  if (!ctx || !offCtx) return;

  offCanvas.width = image.width;
  offCanvas.height = image.height;
  offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
  offCtx.drawImage(image, 0, 0);

  canvas.width = offCanvas.width;
  canvas.height = offCanvas.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
  ctx.putImageData(imgData, 0, 0);
}

