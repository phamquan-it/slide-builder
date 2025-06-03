'use client';
import React, { useState, useRef } from 'react';
import { Button, Tooltip, Card, Space, Tabs, TabsProps } from 'antd';
import {
    CloseOutlined,
    DragOutlined,
    BorderOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { ResizableBox } from 'react-resizable';
import { DraggableCard } from '../PickColorBox'; // cần có DraggableCard định nghĩa rõ
import IconList from './canvas/IconList';
import FontList from './canvas/FontList';
import ShapeList from './canvas/ShapeList';
import LayoutList from './canvas/LayoutList';
import ColorList from './canvas/ColorList';
import ChartList from './canvas/ChartList';
import SubjectList from './canvas/SubjectList';

const Canvas: React.FC = () => {
    const [showFloatPanel, setShowFloatPanel] = useState(false);
    const [position, setPosition] = useState({ x: -10, y: 100 });
    const [mode, setMode] = useState<'move' | 'resize'>('move');
    const [isHoveringClose, setIsHoveringClose] = useState(false);
    const dragHandleRef = useRef<HTMLDivElement>(null);
    const sensors = useSensors(useSensor(PointerSensor));
    const [size, setSize] = useState({ width: 600, height: 300 });

    const handleDragStart = () => { };
    const handleDragMove = () => { };
    const handleDragEnd = (event: any) => {
        const { delta } = event;
        setPosition((prev) => ({
            x: prev.x + delta.x,
            y: prev.y + delta.y,
        }));
    };

    const handleSelectFolder = async () => {
        setIsHoveringClose(false)
        setShowFloatPanel(true);
    };
    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Layouts',
            children: <LayoutList/>,
        },
         {
            key: '2',
            label: 'Subjects',
            children: <SubjectList/>,
        },
        {
            key: '3',
            label: 'Shapes',
            children: <ShapeList/>,
        },
        {
            key: '4',
            label: 'Colors',
            children: <ColorList/>,
        },
        {
            key: '5',
            label: 'Icons',
            children: (<IconList />),
        },
        {
            key: '6',
            label: 'Fonts',
            children: (<FontList />),
        },
        {
            key: '7',
            label: 'Charts',
            children: (<ChartList />),
        },
    ];
    return (
        <>
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
                <div className="!text-center">Canvas</div>
                <SettingOutlined />
            </Button>

            {showFloatPanel && (
                <DndContext
                    key={`${position.x}-${position.y}`} // 👈 ép DndContext reset khi position thay đổi
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                >
                    <DraggableCard
                        id="color-card"
                        position={position}
                        dragHandleRef={dragHandleRef}
                        disableDrag={mode === 'resize' || isHoveringClose}
                    >
                        <Card
                            className="!border"
                            style={{ width: size.width + 10, height: size.height + 100 }}
                            title={<div ref={dragHandleRef}>Canvas</div>}
                            classNames={{ header: '!p-2', body: "!p-0" }}
                            extra={
                                <Space>
                                    <Tooltip title={mode === 'resize' ? 'Switch to move' : 'Switch to resize'}>
                                        <Button
                                            icon={mode === 'resize' ? <DragOutlined /> : <BorderOutlined />}
                                            onClick={() =>
                                                setMode((prev) => (prev === 'move' ? 'resize' : 'move'))
                                            }
                                        />
                                    </Tooltip>
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined />}
                                        onClick={() => {
                                            setShowFloatPanel(false)
                                            setMode('move')
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
                                    height={size.height+20}
                                    onResizeStop={(_, { size }) => {
                                        setSize(size);
                                    }}
                                >
                                    <div className="h-full !ps-3">
                                        <Tabs className="ms-2 !h-full !w-full" defaultActiveKey="1" items={items} onChange={onChange} />
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

export default Canvas;

