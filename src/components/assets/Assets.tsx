'use client';
import React, { useState, useRef } from 'react';
import { Button, Card, Space, Tooltip, message, Spin } from 'antd';
import {
    FolderAddOutlined,
    CloseOutlined,
    DragOutlined,
    BorderOutlined,
} from '@ant-design/icons';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { ResizableBox } from 'react-resizable';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addElement } from '@/lib/slideElementSlice';
import { debounce } from 'lodash';
import { getFileIcon, isVideoFile, listFilesByFolder } from './checkfile';
import { DraggableCard } from '../PickColorBox';

export type FileWithPreview = {
    handle: FileSystemFileHandle;
    url?: string;
};

const Assets: React.FC = () => {
    const [folderData, setFolderData] = useState<{ [folder: string]: FileWithPreview[] }>({});
    const [showFloatPanel, setShowFloatPanel] = useState(false);
    const [position, setPosition] = useState({ x: -10, y: 100 });
    const [mode, setMode] = useState<'move' | 'resize'>('move');
    const [isHoveringClose, setIsHoveringClose] = useState(false);
    const [size, setSize] = useState({ width: 500, height: 400 });
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const elements = useAppSelector((state) => state.sliceElements);

    const dragHandleRef = useRef<HTMLDivElement>(null);
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: any) => {
        const { delta } = event;
        setPosition((prev) => ({ x: prev.x + delta.x, y: prev.y + delta.y }));
    };

    const handleSelectFolder = async () => {
        try {
            setIsHoveringClose(false);
            setLoading(true);
            const dirHandle = await (window as any).showDirectoryPicker();
            const data = await listFilesByFolder(dirHandle);
            setFolderData(data);
            setShowFloatPanel(true);
        } catch (error) {
            console.error('Folder selection canceled or failed', error);
        } finally {
            setLoading(false);
        }
    };

    const [messageApi, contextHolder] = message.useMessage();
    const [processingFiles, setProcessingFiles] = useState<Set<string>>(new Set());

    return (
        <>
            {contextHolder}
            <Button
                type="primary"
                onClick={handleSelectFolder}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 80,
                    fontWeight: 500,
                    marginBottom: 10,
                }}
                disabled={loading}
            >
                {loading ? <Spin size="small" /> : <div className="!text-center">Load Folder</div>}
                <FolderAddOutlined />
            </Button>

            {showFloatPanel && (
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <DraggableCard
                        id="assets-card"
                        position={position}
                        dragHandleRef={dragHandleRef}
                        disableDrag={mode === 'resize' || isHoveringClose}
                    >
                        <Card
                            title={<div ref={dragHandleRef}>Assets</div>}
                            className="!border"
                            style={{ width: size.width, height: size.height }}
                            extra={
                                <Space>
                                    <Tooltip title={mode === 'resize' ? 'Switch to move' : 'Switch to resize'}>
                                        <Button
                                            icon={mode === 'resize' ? <DragOutlined /> : <BorderOutlined />}
                                            onClick={() => setMode((prev) => (prev === 'move' ? 'resize' : 'move'))}
                                        />
                                    </Tooltip>
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined />}
                                        onClick={() => setShowFloatPanel(false)}
                                        onMouseEnter={() => setIsHoveringClose(true)}
                                        onMouseLeave={() => setIsHoveringClose(false)}
                                    />
                                </Space>
                            }
                            styles={{ title: { cursor: 'move', userSelect: 'none' } }}
                        >
                            <ResizableBox
                                width={size.width - 30}
                                height={size.height - 100}
                                onResizeStop={(_, { size }) => setSize(size)}
                            >
                                <div className="overflow-y-auto h-full space-y-4 p-2">
                                    {loading ? (
                                        <div className="flex justify-center items-center h-full">
                                            <Spin tip="Loading..." />
                                        </div>
                                    ) : (
                                        Object.entries(folderData).map(([folder, files]) => (
                                            <div key={folder}>
                                                <Title level={5} className="mb-2">📁 {folder}</Title>
                                                <div className="grid grid-cols-5 gap-3">
                                                    {files.map((file, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={debounce(async () => {
                                                                const fileName = file.handle.name;
                                                                if (processingFiles.has(fileName)) return;

                                                                const newSet = new Set(processingFiles);
                                                                newSet.add(fileName);
                                                                setProcessingFiles(newSet);

                                                                try {
                                                                    const fileData = await file.handle.getFile();
                                                                    const reader = new FileReader();

                                                                    reader.onloadend = () => {
                                                                        const base64 = reader.result as string;
                                                                        const newElement: SlideElement = {
                                                                            id: `${elements.length + 1}`,
                                                                            x: 100,
                                                                            y: 100,
                                                                            type: 'image' as SlideElementType,
                                                                            content: base64,
                                                                            fontSize: 18,
                                                                            fontWeight: 'normal',
                                                                        };
                                                                        dispatch(addElement(newElement));
                                                                        messageApi.success(`✅ Đã thêm ảnh: ${fileName}`);
                                                                    };

                                                                    reader.onerror = () => {
                                                                        messageApi.error(`❌ Không thể đọc file: ${fileName}`);
                                                                    };

                                                                    reader.readAsDataURL(fileData);
                                                                } catch (error) {
                                                                    console.error("❌ Failed to add image:", error);
                                                                    messageApi.error(`❌ Thêm ảnh thất bại: ${fileName}`);
                                                                } finally {
                                                                    const updated = new Set(processingFiles);
                                                                    updated.delete(fileName);
                                                                    setProcessingFiles(new Set(updated));
                                                                }
                                                            }, 500)} // 500ms debounce

                                                            className="cursor-pointer hover:bg-gray-100 border border-gray-100 rounded p-2 flex flex-col items-center text-center overflow-hidden"
                                                        >
                                                            {file.url ? (
                                                                isVideoFile(file.handle.name) ? (
                                                                    <video
                                                                        src={file.url}
                                                                        controls
                                                                        className="max-w-full max-h-20 object-contain mb-1"
                                                                        onLoadedData={(e) =>
                                                                            URL.revokeObjectURL((e.target as HTMLVideoElement).src)
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={file.url}
                                                                        alt={file.handle.name}
                                                                        className="max-w-full max-h-20 object-contain mb-1"
                                                                        onLoad={(e) =>
                                                                            URL.revokeObjectURL((e.target as HTMLImageElement).src)
                                                                        }
                                                                    />
                                                                )
                                                            ) : (
                                                                getFileIcon(file.handle.name)
                                                            )}
                                                            <span className="truncate text-xs">{file.handle.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ResizableBox>
                        </Card>
                    </DraggableCard>
                </DndContext>
            )}
        </>
    );
};

export default Assets;

