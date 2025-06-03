'use client';
import React, { useState, useRef } from 'react';
import { Button, Tooltip, Card, Space, Input, Form, message } from 'antd';
import {
    CloseOutlined,
    DragOutlined,
    BorderOutlined,
    MessageOutlined,
} from '@ant-design/icons';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { ResizableBox } from 'react-resizable';
import { DraggableCard } from '../PickColorBox'; // Custom draggable component
import Ajv from 'ajv';
import slidesListSchema from '@/slidesListSchema.json';
import { useDispatch } from 'react-redux';
import { setAllSlides } from '@/lib/slidesSlice';

const ajv = new Ajv({ allErrors: true });
const validateSlidesList = ajv.compile(slidesListSchema);

const ImportSlide: React.FC = () => {
    const [showFloatPanel, setShowFloatPanel] = useState(false);
    const [position, setPosition] = useState({ x: -10, y: 100 });
    const [mode, setMode] = useState<'move' | 'resize'>('move');
    const [isHoveringClose, setIsHoveringClose] = useState(false);
    const [size, setSize] = useState({ width: 600, height: 300 });

    const sensors = useSensors(useSensor(PointerSensor));
    const dragHandleRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const handleSelectFolder = () => {
        setIsHoveringClose(false);
        setShowFloatPanel(true);
    };

    const handleDragEnd = (event: any) => {
        const { delta } = event;
        setPosition(prev => ({
            x: prev.x + delta.x,
            y: prev.y + delta.y,
        }));
    };

    const handleValidateJson = (values: any) => {
        try {
            const parsed = JSON.parse(values.slide);

            const isValid = validateSlidesList(parsed);
            if (isValid) {
                dispatch(setAllSlides(parsed as SlidesState[]));
                messageApi.success('✅ JSON is valid and slides imported!');
            } else {
                messageApi.error('❌ JSON structure is invalid!');
                console.warn(validateSlidesList.errors);
            }
        } catch (error) {
            messageApi.error('❌ Invalid JSON format!');
        }
    };

    return (
        <>
            {contextHolder}
            <Button
                type={showFloatPanel ? 'primary' : 'default'}
                onClick={handleSelectFolder}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 80,
                    fontWeight: 500,
                }}
            >
                <div className="!text-center">Import</div>
                <MessageOutlined />
            </Button>

            {showFloatPanel && (
                <DndContext
                    key={`${position.x}-${position.y}`}
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                >
                    <DraggableCard
                        id="import-slide-card"
                        position={position}
                        dragHandleRef={dragHandleRef}
                        disableDrag={mode === 'resize' || isHoveringClose}
                    >
                        <Card
                            className="!border"
                            style={{ width: size.width + 10, height: size.height + 100 }}
                            title={<div ref={dragHandleRef}>ImportSlide</div>}
                            classNames={{ header: '!p-2', body: '!p-0' }}
                            extra={
                                <Space>
                                    <Tooltip title={mode === 'resize' ? 'Switch to move' : 'Switch to resize'}>
                                        <Button
                                            icon={mode === 'resize' ? <DragOutlined /> : <BorderOutlined />}
                                            onClick={() => setMode(prev => prev === 'move' ? 'resize' : 'move')}
                                        />
                                    </Tooltip>
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined />}
                                        onClick={() => {
                                            setShowFloatPanel(false);
                                            setMode('move');
                                        }}
                                        onMouseEnter={() => setIsHoveringClose(true)}
                                        onMouseLeave={() => setIsHoveringClose(false)}
                                    />
                                </Space>
                            }
                            styles={{
                                title: {
                                    cursor: mode === 'resize' ? 'nwse-resize' : 'move',
                                    userSelect: 'none',
                                },
                                body: { overflow: 'hidden' },
                            }}
                        >
                            <div
                                onMouseEnter={() => setMode('resize')}
                                onMouseLeave={() => setMode('move')}
                            >
                                <ResizableBox
                                    width={size.width}
                                    height={size.height + 20}
                                    onResizeStop={(_, { size }) => setSize(size)}
                                >
                                    <div className="px-2 pt-1">
                                        <Form
                                            name="importSlideForm"
                                            layout="vertical"
                                            autoComplete="off"
                                            onFinish={handleValidateJson}
                                        >
                                            <Form.Item
                                                name="slide"
                                                rules={[{ required: true, message: 'Please paste JSON content' }]}
                                            >
                                                <Input.TextArea rows={11} placeholder="Paste JSON here..." />
                                            </Form.Item>

                                            <Form.Item>
                                                <Button type="primary" block htmlType="submit">
                                                    Validate JSON
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                </ResizableBox>
                            </div>
                        </Card>
                    </DraggableCard>
                </DndContext>
            )}
        </>
    );
};

export default ImportSlide;

