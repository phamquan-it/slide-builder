import React from "react";

interface Position {
  x: number;
  y: number;
}

interface BrushCursorProps {
  hoverScreenPos: Position | null;
  brushSize: number;
  scale: number;
}

const BrushCursor: React.FC<BrushCursorProps> = ({ hoverScreenPos, brushSize, scale }) => {
  if (!hoverScreenPos) return null;

  const size = brushSize * 2 * scale;
  const style: React.CSSProperties = {
    position: "fixed",
    left: hoverScreenPos.x - brushSize * scale,
    top: hoverScreenPos.y - brushSize * scale,
    width: size,
    height: size,
    border: "2px solid red",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 9999,
  };

  return <div style={style} />;
};

export default BrushCursor;

