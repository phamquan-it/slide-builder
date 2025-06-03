import { applyFeatherAlpha } from ".";
export const isColorClose = (
    r1: number, g1: number, b1: number,
    r2: number, g2: number, b2: number,
    tolerance = 60
) => {
    return (
        Math.abs(r1 - r2) <= tolerance &&
        Math.abs(g1 - g2) <= tolerance &&
        Math.abs(b1 - b2) <= tolerance
    );
};


export interface EraseOptions {
    canvas: HTMLCanvasElement;
    x: number;
    y: number;
    brushSize: number;
    eraseMode: 'color' | 'feather' | 'other';
    baseColor: [number, number, number] | null;
    tolerance: number;
}

export default function eraseAtPoint({
    canvas,
    x,
    y,
    brushSize,
    eraseMode,
    baseColor,
    tolerance,
}: EraseOptions):any {
    if (!canvas || !baseColor) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const pxCenter = Math.round(x);
    const pyCenter = Math.round(y);
    const featherMargin = 4;
    const R = brushSize + featherMargin;

    for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
            const px = pxCenter + dx;
            const py = pyCenter + dy;
            if (px < 0 || py < 0 || px >= width || py >= height) continue;

            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > R) continue;

            const idx = (py * width + px) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            if (eraseMode === 'color') {
                if (dist <= brushSize) {
                    if (isColorClose(r, g, b, baseColor[0], baseColor[1], baseColor[2], tolerance)) {
                        data[idx + 3] = 0; // fully erase
                    }
                }
            } else if (eraseMode === 'feather') {
                const featherAlpha = 1 - dist / R;
                applyFeatherAlpha(data, idx, featherAlpha);
            }else{
                 data[idx + 3] = 0; // fully erase
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
    return imageData
}

