'use client';

import RemoverPickerColor from '@/components/image_tools/RemovePickerColor';
import { useDraggable } from '@dnd-kit/core';
import { ResizableBox } from 'react-resizable';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import 'react-resizable/css/styles.css';
import { Checkbox, CheckboxChangeEvent, Form, Input, Modal, Slider } from 'antd';
import { setElements } from '@/lib/slideElementSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import EditTextElement from './EditElement';
import { SlideElementType } from '@/enums/SlideElementType';

interface SlideElementProps {
    id: string;
    x: number;
    y: number;
    type: SlideElementType;
    content: string;
    fontSize: number;
    fontWeight: 'normal' | 'bold';
    selected: boolean;
    setRef: (el: HTMLDivElement | null) => void;
    onClick: () => void;
    mode: 'move' | 'resize';
    background?: string;
    color?: string;
}

const DraggableElement: React.FC<SlideElementProps> = ({
    id,
    x,
    y,
    type,
    content,
    fontSize,
    fontWeight,
    selected,
    setRef,
    onClick,
    mode,
    background = '#FFD700',
    color = '#000',
}) => {
    const dispatch = useDispatch();
    const isMoveMode = mode === 'move';
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const translateX = transform?.x ?? 0;
    const translateY = transform?.y ?? 0;
    const elements = useSelector((state: RootState) => state.sliceElements);

    const nodeRef = (node: HTMLDivElement | null) => {
        if (isMoveMode) setNodeRef(node);
        setRef(node);
    };

    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);
    const element = elements.find(e => e.id === id);
    const commonStyle: React.CSSProperties = {
        position: 'absolute',
        left: x,
        top: y,
        transform: isMoveMode ? `translate(${translateX}px, ${translateY}px)` : undefined,
        borderRadius: 4,
        userSelect: 'none',
        fontWeight,
        fontSize,
        minWidth: 20,
        textAlign: 'center',
        boxShadow: selected ? '0 0 10px 3px rgba(0, 123, 255, 0.7)' : 'none',
        zIndex: selected ? 10 : 1,
        color: element?.color || '#000',
    };
    const renderNestedList = (lines: string[]) => {
        const getIndentLevel = (line: string) => (line.match(/^\s*/)![0].length) / 2;

        const buildTree = (lines: string[]) => {
            const stack: any[] = [];
            let root: any[] = [];

            lines.forEach((line) => {
                const text = line.trim();
                if (!text) return;
                const level = getIndentLevel(line);
                const node = { text, children: [] };

                while (stack.length && stack[stack.length - 1].level >= level) {
                    stack.pop();
                }

                if (stack.length === 0) {
                    root.push(node);
                    stack.push({ level, children: root[root.length - 1].children });
                } else {
                    stack[stack.length - 1].children.push(node);
                    stack.push({ level, children: node.children });
                }
            });

            return root;
        };

        const renderList = (items: any[]) => (
            <ul className="list-disc pl-6 text-start">
                {items.map((item, idx) => (
                    <li key={idx}>
                        {item.text}
                        {item.children.length > 0 && renderList(item.children)}
                    </li>
                ))}
            </ul>
        );

        return renderList(buildTree(lines));
    };



    const innerContent = (
        <>
            {type == SlideElementType.TEXT && <span>{content}</span>}
            {type == SlideElementType.SHAPE && (
                <div style={{ width: '100%', height: '100%' }}>
                    {element?.content === 'rect' && (
                        <svg width="100%" height="100%">
                            <rect width="100%" height="100%" fill={color} rx="4" />
                        </svg>
                    )}
                    {element?.content === 'ellipse' && (
                        <svg width="100%" height="100%">
                            <ellipse cx="50%" cy="50%" rx="48%" ry="40%" fill={color} />
                        </svg>
                    )}
                    {element?.content === 'triangle' && (
                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                            <polygon points="50,10 90,90 10,90" fill={color} />
                        </svg>
                    )}
                    {element?.content === 'diamond' && (
                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                            <polygon points="50,10 90,50 50,90 10,50" fill={color} />
                        </svg>
                    )}
                </div>
            )}
            {type == SlideElementType.IMAGE && (
                <img
                    src={content}
                    alt="Uploaded"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        pointerEvents: 'none',
                        display: 'block',
                        margin: '0 auto',
                    }}
                    width={element?.w || 100}
                    height={element?.h || 100}
                />
            )}
            {type === SlideElementType.LIST && renderNestedList(content.split('\n'))}

        </>
    );


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleContentChange = (id: string, newValues: any) => {
        const updated = elements.map(el =>
            el.id === id ? { ...el, ...newValues } : el
        );
        dispatch(setElements(updated));
    };

    const handleFontWeightChange = (e: CheckboxChangeEvent) => {
        const updated: SlideElement[] = elements.map(el =>
            el.id === id ? { ...el, fontWeight: e.target.checked ? 'bold' : 'normal' } : el
        );
        dispatch(setElements(updated));
    };

    return (
        <>
            {element?.type == "text" ?
                <EditTextElement id={id} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                :
                <></>}

            {element?.type === 'shape' && (
                <Modal
                    title="Edit Shape"
                    open={isModalOpen}
                    onOk={() => form.submit()} // Gọi submit form khi bấm OK
                    onCancel={() => setIsModalOpen(false)}
                    okText="Apply"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            color: element.color || '#000000',
                            w: element.w || 150,
                            h: element.h || 100,
                        }}
                        onFinish={(values) => {
                            handleContentChange(id, {
                                color: values.color,
                                w: values.w,
                                h: values.h,
                            });
                            setIsModalOpen(false);
                        }}
                    >
                        <Form.Item label="Color" name="color">
                            <Input type="color" />
                        </Form.Item>
                        <Form.Item label="Width" name="w">
                            <Slider min={20} max={1000} />
                        </Form.Item>
                        <Form.Item label="Height" name="h">
                            <Slider min={20} max={1000} />
                        </Form.Item>
                    </Form>
                </Modal>
            )}

            {element?.type === 'image' && (<>
                <Modal
                    width={1200}
                    style={{ top: 20 }}
                    title="Edit Image"
                    destroyOnClose={true}
                    open={isModalOpen}
                    onOk={() => form.submit()} // Gọi submit form khi bấm OK
                    onCancel={() => setIsModalOpen(false)}
                    okText="Apply"
                >
                    <RemoverPickerColor imageBase64={element.content} />
                </Modal>
            </>)}

            <div onDoubleClick={() => setIsModalOpen(true)}>
                {isMoveMode ? (
                    <div
                        ref={nodeRef}
                        {...listeners}
                        {...attributes}
                        style={{
                            ...commonStyle,
                            cursor: 'move',
                            width: element?.w ?? 150,
                            height: element?.h ?? 100,
                        }}
                        onClick={onClick}
                    >
                        {innerContent}
                    </div>
                ) : (
                    <div
                        ref={nodeRef}
                        onClick={onClick}
                        style={{
                            ...commonStyle,
                            cursor: 'nwse-resize',
                        }}
                    >
                        <ResizableBox
                            width={element?.w ?? 150}
                            height={element?.h ?? 100}
                            onResizeStop={(_, { size }) => {
                                const updated = elements.map(el =>
                                    el.id === id ? { ...el, w: size.width, h: size.height } : el
                                );
                                dispatch(setElements(updated));
                            }}
                            minConstraints={[20, 20]}
                            maxConstraints={[1000, 1000]}
                            resizeHandles={['se']}
                        >
                            {innerContent}
                        </ResizableBox>
                    </div>
                )}
            </div>
        </>
    );
};

export default DraggableElement;

