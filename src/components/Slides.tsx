'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store'; // chỉnh path nếu cần
import { List, Card, Dropdown, FormProps, Form, Input, Button, Modal } from 'antd';
import {
    DndContext,
    closestCenter,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { reorderSlides, setSelectedSlide } from '@/lib/slidesSlice';
import { setElements } from '@/lib/slideElementSlice';
import SlideFloatButton from './slides/FloatButtonSlide';

const SortableItem: React.FC<{ item: SlidesState; onSelect: (id: number) => void }> = ({ item, onSelect }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: "100%",
        cursor: 'move',
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card
                className={`!w-full ${item.selected ? '!bg-blue-500 !text-white' : ''}`}
                onDoubleClick={() => onSelect(item.id)}
            >
                <strong>{item.name}</strong>
                <p>{item.content}</p>
            </Card>
        </div>
    );
};


const Slides: React.FC = () => {
    const dispatch = useDispatch();
    const slides = useSelector((state: RootState) => state.slides);

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over) return;
        if (active.id !== over.id) {
            const oldIndex = slides.findIndex(slide => slide.id === active.id);
            const newIndex = slides.findIndex(slide => slide.id === over.id);
            dispatch(reorderSlides({ oldIndex, newIndex }));
        }
    };
    const handleSelect = (id: number) => {
        const selectedSlide = slides.find(slide => slide.id === id);
        if (selectedSlide) {
            dispatch(setSelectedSlide(id));
            dispatch(setElements(selectedSlide.data))
            console.log("Selected Slide:", selectedSlide.data);
        } else {
            console.warn("Slide not found with id:", id);
        }
    };
    return (
        <div>

            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext
                    items={slides.map(slide => slide.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <List
                        dataSource={slides}
                        renderItem={(item) => (
                            <List.Item key={item.id}>
                                <SortableItem item={item} onSelect={handleSelect} />
                            </List.Item>
                        )}
                    />
                </SortableContext>
            </DndContext>
            <SlideFloatButton />
        </div>
    );
};

export default Slides;

