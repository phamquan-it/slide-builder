self.onmessage = (e) => {
  const { imageData, baseColor, brushSize, tolerance, x, y } = e.data;

  const { width, height, data } = imageData;
  const px = Math.round(x);
  const py = Math.round(y);
  const radius = brushSize;

  const isSimilar = (r1, g1, b1, r2, g2, b2) => {
    return (
      Math.abs(r1 - r2) <= tolerance &&
      Math.abs(g1 - g2) <= tolerance &&
      Math.abs(b1 - b2) <= tolerance
    );
  };

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const nx = px + dx;
      const ny = py + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > radius) continue;

      const idx = (ny * width + nx) * 4;
      const [r, g, b, a] = [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
      if (a === 0) continue;
      if (isSimilar(r, g, b, baseColor[0], baseColor[1], baseColor[2])) {
        data[idx + 3] = 0; // transparent
      }
    }
  }

  self.postMessage(imageData);
};

