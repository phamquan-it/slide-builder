export function flipCanvasImage(
    canvas: HTMLCanvasElement,
    flipHorizontal: boolean,
    flipVertical: boolean
) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Lấy ảnh hiện tại dưới dạng ImageData hoặc từ chính canvas
    const width = canvas.width;
    const height = canvas.height;

    // Tạo 1 canvas tạm để lưu ảnh hiện tại
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.drawImage(canvas, 0, 0);

    // Xóa canvas chính
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(flipHorizontal ? width : 0, flipVertical ? height : 0);
    ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);

    // Vẽ lại ảnh từ tempCanvas (ảnh hiện tại)
    ctx.drawImage(tempCanvas, 0, 0);

    ctx.restore();
}


//export function drawFlippedImage(
//  canvas: HTMLCanvasElement,
//  offscreenCanvas: HTMLCanvasElement | null,
//  image: HTMLImageElement,
//  scale: number,
//  flipHorizontal: boolean,
//  flipVertical: boolean
//) {
//  if (!canvas || !image) return;
//
//  const ctx = canvas.getContext('2d');
//  if (!ctx) return;
//
//  const width = image.width;
//  const height = image.height;
//
//  // Set canvas size to image size * scale
//  canvas.width = width * scale;
//  canvas.height = height * scale;
//
//  ctx.save();
//
//  // Translate context to flip origin point if flipping
//  ctx.translate(
//    flipHorizontal ? canvas.width : 0,
//    flipVertical ? canvas.height : 0
//  );
//
//  // Scale context for flip and zoom
//  ctx.scale(
//    flipHorizontal ? -scale : scale,
//    flipVertical ? -scale : scale
//  );
//
//  // Draw the image at 0,0
//  ctx.drawImage(image, 0, 0);
//
//  ctx.restore();
//
//  // Update offscreen canvas for further processing (erase, history, etc.)
//  if (offscreenCanvas) {
//    offscreenCanvas.width = width;
//    offscreenCanvas.height = height;
//
//    const offCtx = offscreenCanvas.getContext('2d');
//    if (!offCtx) return;
//
//    offCtx.save();
//    offCtx.clearRect(0, 0, width, height);
//
//    offCtx.translate(flipHorizontal ? width : 0, flipVertical ? height : 0);
//    offCtx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
//
//    offCtx.drawImage(image, 0, 0);
//
//    offCtx.restore();
//  }
//}
//
