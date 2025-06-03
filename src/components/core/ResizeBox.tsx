'use client';
import React, { useEffect, useState } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'; // required for styling

interface ResizeElementProps {
    initialWidth?: number;
    initialHeight?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    children?: React.ReactNode;
    disabled?: string,
    onResize?: (width: number, height: number) => void
}

const ResizeElement: React.FC<ResizeElementProps> = ({
    initialWidth = 200,
    initialHeight = 200,
    maxWidth = 500,
    maxHeight = 500,
    children = <span>Contents</span>,
}) => {
    const [size, setSize] = useState({ width: initialWidth, height: initialHeight });

    return (
        <ResizableBox
            width={size.width}
            height={size.height}
            onResizeStop={(e, data) => {
                setSize({ width: data.size.width, height: data.size.height });
            }}
            resizeHandles={['se']} // southeast handle (bottom-right)
        >
            <div style={{ height: '100%', width: '100%' }}>
                {children}
            </div>
        </ResizableBox>
    );
};

export default ResizeElement;

