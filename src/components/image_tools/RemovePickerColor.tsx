import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    Upload, Button, Typography, message, Slider, Radio,
    Modal
} from 'antd';
import {
    UploadOutlined
} from '@ant-design/icons';
import { DownloadImageButton } from './export';
import { applyFeatherAlpha, drawImageToCanvas, eraseAlphaBorder } from './/utils';
import { createCanvasHistoryHandlers, createCanvasMouseHandlers } from './/utils/canvasHistory';
import callEraseAtPoint from './utils/eraseAtPoint';
import BrushSettings from './BrushSetting';
import BrushCursor from './BrushCursor';
import FrameCanvas from './FrameCanvas';
import ToolbarActions from './ToolbarActions';
import { flipRotateCurrentCanvasImage } from './/utils/drawFlippedRotatedImage';
import { debounce } from 'lodash';

const { Title } = Typography;

interface ZoomBrushRemoverProps {
    imageBase64: string
}
const ZoomBrushRemover: React.FC<ZoomBrushRemoverProps> = ({ imageBase64 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [drawMode, setDrawMode] = useState<'erase' | 'pencil' | 'brush'>('erase');
    const [drawing, setDrawing] = useState(false);
    const [baseColor, setBaseColor] = useState<[number, number, number] | null>(null);
    const [brushSize, setBrushSize] = useState(10);
    const [tolerance, setTolerance] = useState(60);
    const [scale, setScale] = useState(1);
    const [eraseMode, setEraseMode] = useState<'color' | 'feather' | 'other'>('color');
    const mousePosRef = useRef<{ x: number; y: number } | null>(null);
    const hoverScreenPosRef = useRef<{ x: number; y: number } | null>(null);
    const [hoverScreenPos, setHoverScreenPos] = useState<{ x: number; y: number } | null>(null);
    const offscreenCanvas = useRef<HTMLCanvasElement | null>(null);
    const [rotationDegrees, setRotationDegrees] = useState(0);
    const rotationRadians = (rotationDegrees * Math.PI) / 180;
    const [history, setHistory] = useState<string[]>([]);
    const [redoStack, setRedoStack] = useState<string[]>([]);
    const [flipHorizontal, setFlipHorizontal] = useState(false);
    const [flipVertical, setFlipVertical] = useState(false);

    const { saveToHistory, handleUndo, handleRedo } = createCanvasHistoryHandlers(
        canvasRef,
        setHistory,
        setRedoStack,
        history,
        redoStack
    );

    useEffect(() => {
        offscreenCanvas.current = document.createElement('canvas');
    }, [image]);

    useEffect(() => {
        if (!image || !canvasRef.current || !offscreenCanvas.current) return;
        drawImageToCanvas(image, canvasRef.current, offscreenCanvas.current);
        setHistory([]);
        setRedoStack([]);
    }, [image]);

    useEffect(() => {
        let animationFrameId: number;
        const updateHover = () => {
            setHoverScreenPos(hoverScreenPosRef.current);
            animationFrameId = requestAnimationFrame(updateHover);
        };
        animationFrameId = requestAnimationFrame(updateHover);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    useEffect(() => {
        let frameId: number;
        const drawLoop = () => {
            if (drawing && mousePosRef.current) {
                if (drawMode === 'erase') {
                    eraseAtPoint(mousePosRef.current.x, mousePosRef.current.y);
                } else if (drawMode === 'pencil') {
                    drawAtPoint(mousePosRef.current.x, mousePosRef.current.y);
                }
            }
            frameId = requestAnimationFrame(drawLoop);
        };
        frameId = requestAnimationFrame(drawLoop);
        return () => cancelAnimationFrame(frameId);
    }, [drawing, brushSize, tolerance, eraseMode, drawMode]);

    const handleUpload = (file: File) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => setImage(img);
        img.onerror = () => message.error('Failed to load image!');
        img.src = URL.createObjectURL(file);
        return false;
    };

    const eraseAtPoint = (x: number, y: number) => {
        if (!canvasRef.current || !baseColor || drawMode === 'pencil') return;
        callEraseAtPoint({
            canvas: canvasRef.current,
            x,
            y,
            brushSize,
            eraseMode,
            baseColor,
            tolerance,
        });
    };

    const drawAtPoint = (x: number, y: number) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
    };

    const { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } = createCanvasMouseHandlers({
        canvasRef,
        scale,
        setBaseColor,
        setDrawing,
        eraseAtPoint,
        saveToHistory,
        mousePosRef,
        hoverScreenPosRef,
        setHoverScreenPos,
    });

    const eraseBorder = () => {
        if (!canvasRef.current) return;
        eraseAlphaBorder(canvasRef.current, 1);
    };

    useEffect(() => {
        if (image && canvasRef.current && offscreenCanvas.current) {
            flipRotateCanvasImage(
                canvasRef.current,
                offscreenCanvas.current,
                image,
                scale,
                flipHorizontal,
                flipVertical,
                rotationRadians
            );
        }
    }, [image, scale, flipHorizontal, flipVertical, rotationRadians]);
    function flipRotateCanvasImage(
        canvas: HTMLCanvasElement,
        offscreenCanvas: HTMLCanvasElement,
        image: HTMLImageElement,
        scale: number,
        flipH: boolean,
        flipV: boolean,
        rotate: number
    ) {
        const ctx = canvas.getContext('2d');
        const offCtx = offscreenCanvas.getContext('2d');
        if (!ctx || !offCtx) return;

        const width = image.width * scale;
        const height = image.height * scale;

        canvas.width = width;
        canvas.height = height;
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;

        // clear both canvases
        ctx.clearRect(0, 0, width, height);
        offCtx.clearRect(0, 0, width, height);

        // draw original to offscreen
        offCtx.save();
        offCtx.drawImage(image, 0, 0, width, height);
        offCtx.restore();

        // apply transformations to onscreen canvas
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.rotate(rotate);
        ctx.drawImage(offscreenCanvas, -width / 2, -height / 2, width, height);
        ctx.restore();
    }


    const debouncedSetRotationDegrees = useCallback(
        debounce((value: number) => {
            setRotationDegrees(value);
        }, 15),
        []
    );

    const saveCurrentCanvasToOffscreen = () => {
        if (!canvasRef.current || !offscreenCanvas.current) return;
        const ctx = offscreenCanvas.current.getContext('2d');
        offscreenCanvas.current.width = canvasRef.current.width;
        offscreenCanvas.current.height = canvasRef.current.height;
        ctx?.clearRect(0, 0, offscreenCanvas.current.width, offscreenCanvas.current.height);
        ctx?.drawImage(canvasRef.current, 0, 0);
    };

    useEffect(() => {
        if (!imageBase64) return;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => setImage(img);
        img.onerror = () => message.error('Failed to load base64 image!');
        img.src = imageBase64;
    }, [imageBase64]);

    return (
        <div>
            <ToolbarActions
                onUpload={handleUpload}
                onEraseBorder={eraseBorder}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={history.length > 0}
                canRedo={redoStack.length > 0}
            />
            <BrushSettings
                brushSize={brushSize}
                setBrushSize={setBrushSize}
                tolerance={tolerance}
                setTolerance={setTolerance}
                scale={scale}
                setScale={setScale}
                eraseMode={eraseMode}
                setEraseMode={setEraseMode}
            />
            <Button onClick={() => setFlipHorizontal(!flipHorizontal)}>Lật ngang</Button>
            <Button onClick={() => setFlipVertical(!flipVertical)}>Lật dọc</Button>
            <Slider
                min={0}
                max={360}
                step={1}
                value={rotationDegrees}
                onChange={debouncedSetRotationDegrees}
                style={{ width: 200, marginBottom: 16 }}
            />
            <Radio.Group value={drawMode} onChange={(e) => {
                setDrawMode(e.target.value);
                if (e.target.value === 'brush') {
                    setEraseMode('color');
                } else {
                    setEraseMode('other');
                }
            }}>
                <Radio value="brush">Brush</Radio>
                <Radio value="erase">🧽 Erase</Radio>
                <Radio value="pencil">✏️ Pencil</Radio>
            </Radio.Group>
            <div className="h-[50vh] overflow-auto">
                <FrameCanvas
                    image={image}
                    scale={scale}
                    drawing={drawing}
                    canvasRef={canvasRef}
                    handleMouseDown={handleMouseDown}
                    handleMouseMove={handleMouseMove}
                    handleMouseUp={() => {
                        handleMouseUp()
                        saveToHistory();
                    }}
                    handleMouseLeave={handleMouseLeave}
                />
            </div>
            <BrushCursor hoverScreenPos={hoverScreenPos} brushSize={brushSize} scale={scale} />
            <DownloadImageButton
                canvasRef={canvasRef}
                imageLoaded={!!image}
                fileName="result.png"
            />
        </div>
    );
};

export default ZoomBrushRemover;

