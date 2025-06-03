// FrameCanvas.tsx
import React from 'react';

interface FrameCanvasProps {
    image: HTMLImageElement | null;
    scale: number;
    drawing: boolean;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    handleMouseDown: React.MouseEventHandler<HTMLCanvasElement>;
    handleMouseMove: React.MouseEventHandler<HTMLCanvasElement>;
    handleMouseUp: React.MouseEventHandler<HTMLCanvasElement>;
    handleMouseLeave: React.MouseEventHandler<HTMLCanvasElement>;
}

const FrameCanvas: React.FC<FrameCanvasProps> = ({
    image,
    scale,
    drawing,
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
}) => {
    if (!image) return null;

    return (
        <div
            style={{
                position: 'relative',
                overflow: 'auto',
                border: '1px solid #ddd',
                marginTop: 24,
                borderRadius: 8,
                display: 'inline-block',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    display: 'block',
                    cursor: drawing ? 'crosshair' : 'default',
                    userSelect: 'none',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            />
        </div>
    );
};

export default FrameCanvas;

