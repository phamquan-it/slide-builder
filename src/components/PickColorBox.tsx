'use client';
import React, { useState, useRef } from 'react';
import {
    Button,
    Tooltip,
    message,
    ColorPicker,
    Card,
} from 'antd';
import Title from 'antd/es/typography/Title';
import { BgColorsOutlined, CloseOutlined } from '@ant-design/icons';
import {
    DndContext,
    useDraggable,
    useSensor,
    useSensors,
    PointerSensor,
} from '@dnd-kit/core';

const RECENT_COLORS = [
    '#ff4d4f', '#ffa940', '#ffec3d', '#73d13d', '#40a9ff', '#9254de',
    '#f5222d', '#fa8c16', '#fadb14', '#52c41a', '#1890ff', '#722ed1',
    '#d9d9d9', '#8c8c8c', '#262626',
];

export const DraggableCard = ({
    id,
    children,
    position,
    dragHandleRef,
    disableDrag = false,
}: any) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });

    const style: React.CSSProperties = {
        transform: transform
            ? `translate3d(${position.x + transform.x}px, ${position.y + transform.y}px, 0)`
            : `translate3d(${position.x}px, ${position.y}px, 0)`,
        position: 'absolute',
        zIndex: 10,
        width: 340,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div
                ref={dragHandleRef}
                {...(disableDrag ? {} : attributes)}
                {...(disableDrag ? {} : listeners)}
            >
                {children}
            </div>
        </div>
    );
};

const PickColorBox: React.FC = () => {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [showFloatPicker, setShowFloatPicker] = useState(false);
    const [position, setPosition] = useState({ x: -10, y: 100 });
    const [isHoveringClose, setIsHoveringClose] = useState(false);

    const dragHandleRef = useRef<HTMLDivElement>(null);
    const wasDragging = useRef(false); // Prevent click after drag

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragStart = () => {
        wasDragging.current = false;
    };

    const handleDragMove = () => {
        wasDragging.current = true;
    };

    const handleDragEnd = (event: any) => {
        const { delta } = event;
        setPosition((prev) => ({
            x: prev.x + delta.x,
            y: prev.y + delta.y,
        }));
        setTimeout(() => {
            wasDragging.current = false; // reset after drag
        }, 0); // wait for click event to finish
    };

    const handleColorClick = async (color: string) => {
        if (wasDragging.current) return; // Ignore accidental clicks after dragging
        setSelectedColor(color);
        try {
            await navigator.clipboard.writeText(color);
            messageApi.success(`Copied ${color} to clipboard`);
        } catch (err) {
            messageApi.error('Failed to copy');
        }
    };

    return (
        <>
            {contextHolder}
            <Button
                type={showFloatPicker ? 'primary' : 'default'}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 80,
                    fontWeight: 500,
                }}

                onClick={() => setShowFloatPicker(!showFloatPicker)}>
                Pick
                <div>
                    <BgColorsOutlined />
                </div>
            </Button>

            {showFloatPicker && (
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                >
                    <DraggableCard
                        id="color-card"
                        position={position}
                        dragHandleRef={dragHandleRef}
                        disableDrag={isHoveringClose}
                    >
                        <Card
                            title={
                                <div ref={dragHandleRef} style={{ cursor: 'move' }}>
                                    Custom Color Picker
                                </div>
                            }
                            size="small"
                            extra={
                                <Button
                                    type="text"
                                    icon={<CloseOutlined />}
                                    onClick={() => setShowFloatPicker(false)}
                                    onMouseEnter={() => setIsHoveringClose(true)}
                                    onMouseLeave={() => setIsHoveringClose(false)}
                                />
                            }
                            classNames={{ body: 'p-2' }}
                        >
                            <div
                                onMouseEnter={() => setIsHoveringClose(true)}
                                onMouseLeave={() => setIsHoveringClose(false)}
                            >
                                <ColorPicker
                                    showText

                                    defaultValue={selectedColor || '#ffffff'}
                                    onChangeComplete={(color) => {
                                        const hex = color.toHexString();
                                        handleColorClick(hex);
                                    }}
                                />
                            </div>
                            <Title level={5} style={{ marginTop: 24 }}>
                                Recent Colors (click to copy):
                            </Title>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                    maxWidth: 320,
                                }}
                            >
                                {RECENT_COLORS.map((color) => (
                                    <Tooltip title={`Click to copy ${color}`} key={color}>
                                        <Button
                                            style={{
                                                backgroundColor: color,
                                                cursor: 'pointer',
                                                border:
                                                    selectedColor === color
                                                        ? '1px solid black'
                                                        : '1px solid #ccc',
                                                outline: selectedColor === color
                                                    ? '1px solid black'
                                                    : '1px solid transparent',

                                            }}
                                            type="text"
                                            onMouseEnter={() => setIsHoveringClose(true)}
                                            onClick={() => handleColorClick(color)}
                                            onMouseLeave={() => setIsHoveringClose(false)}
                                        />
                                    </Tooltip>
                                ))}
                            </div>

                            {selectedColor && (
                                <p style={{ marginTop: 16 }}>
                                    Selected Color:{' '}
                                    <span style={{ fontWeight: 'bold', color: selectedColor }}>
                                        {selectedColor}
                                    </span>
                                </p>
                            )}
                        </Card>
                    </DraggableCard>
                </DndContext>
            )}
        </>
    );
};

export default PickColorBox;

