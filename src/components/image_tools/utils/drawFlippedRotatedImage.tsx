export function flipRotateCurrentCanvasImage(
  canvas: HTMLCanvasElement,
  flipHorizontal: boolean,
  flipVertical: boolean,
  rotationRadians: number,
  scale: number
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Lưu lại nội dung hiện tại của canvas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.save();

  // Áp dụng flip lên ảnh gốc trong tempCanvas
  tempCtx.translate(
    flipHorizontal ? width : 0,
    flipVertical ? height : 0
  );
  tempCtx.scale(
    flipHorizontal ? -1 : 1,
    flipVertical ? -1 : 1
  );

  tempCtx.drawImage(canvas, 0, 0);
  tempCtx.restore();

  // Tính kích thước bounding box sau khi xoay
  const sin = Math.abs(Math.sin(rotationRadians));
  const cos = Math.abs(Math.cos(rotationRadians));
  const rotatedWidth = width * cos + height * sin;
  const rotatedHeight = width * sin + height * cos;

  // Resize canvas chính để chứa ảnh xoay + scale
  canvas.width = rotatedWidth * scale;
  canvas.height = rotatedHeight * scale;

  ctx.save();

  // Dịch tâm để xoay quanh trung tâm canvas
  ctx.translate(canvas.width / 2, canvas.height / 2);

  // Xoay
  ctx.rotate(rotationRadians);

  // Scale
  ctx.scale(scale, scale);

  // Vẽ ảnh đã được flip từ tempCanvas
  ctx.drawImage(tempCanvas, -width / 2, -height / 2);

  ctx.restore();
}

