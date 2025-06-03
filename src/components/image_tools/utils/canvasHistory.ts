import { RefObject } from "react";

export type HistoryHandlers = {
    saveToHistory: () => void;
    handleUndo: () => void;
    handleRedo: () => void;
};

export function createCanvasHistoryHandlers(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    setHistory: React.Dispatch<React.SetStateAction<string[]>>,
    setRedoStack: React.Dispatch<React.SetStateAction<string[]>>,
    history: string[],
    redoStack: string[]
): HistoryHandlers {
    const saveToHistory = () => {
        if (!canvasRef.current) return;
        const dataURL = canvasRef.current.toDataURL();
        setHistory((prev) => [...prev.slice(-2), dataURL]); // Keep max 2 previous states
        setRedoStack([]);
    };

    const handleUndo = () => {
        if (!canvasRef.current || history.length === 0) return;
        const last = history[history.length - 1];
        setRedoStack((r) => [...r, canvasRef.current!.toDataURL()]);
        const img = new Image();
        img.onload = () => {
            const ctx = canvasRef.current!.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = last;
        setHistory((h) => h.slice(0, -1));
    };

    const handleRedo = () => {
        if (!canvasRef.current || redoStack.length === 0) return;
        const next = redoStack[redoStack.length - 1];
        setHistory((h) => [...h.slice(-2), canvasRef.current!.toDataURL()]);
        const img = new Image();
        img.onload = () => {
            const ctx = canvasRef.current!.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = next;
        setRedoStack((r) => r.slice(0, -1));
    };

    return {
        saveToHistory,
        handleUndo,
        handleRedo,
    };
}


export function getCanvasCoordsFromEvent(
    e: React.MouseEvent<HTMLCanvasElement>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    scale: number
) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    return { x, y };
}

type CanvasHandlersParams = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    scale: number;
    setBaseColor: (rgb: [number, number, number]) => void;
    setDrawing: (d: boolean) => void;
    setHoverScreenPos: (a:any)=>void;
    eraseAtPoint: (x: number, y: number) => void;
    saveToHistory: () => void;
    mousePosRef: React.MutableRefObject<{ x: number; y: number } | null>;
    hoverScreenPosRef: React.MutableRefObject<{ x: number; y: number } | null>;
};

export function createCanvasMouseHandlers({
    canvasRef,
    scale,
    setBaseColor,
    setDrawing,
    eraseAtPoint,
    saveToHistory,
    setHoverScreenPos,
    mousePosRef,
    hoverScreenPosRef,
}: CanvasHandlersParams) {
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const { x, y } = getCanvasCoordsFromEvent(e, canvasRef, scale);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const pixel = ctx.getImageData(x, y, 1, 1).data;
        setBaseColor([pixel[0], pixel[1], pixel[2]]);
        saveToHistory();
        setDrawing(true);
        eraseAtPoint(x, y);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getCanvasCoordsFromEvent(e, canvasRef, scale);
        mousePosRef.current = pos;
        hoverScreenPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => setDrawing(false);

    const handleMouseLeave = () => {
        setDrawing(false);
        hoverScreenPosRef.current = null;
        setHoverScreenPos(null);
    };


    return { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave };
}

