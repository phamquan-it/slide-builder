'use client';

import { Button } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { addElement } from '@/lib/slideElementSlice';
import { PlusOutlined } from '@ant-design/icons';

const AddText: React.FC = () => {
    const dispatch = useDispatch();
    const elements = useSelector((state: RootState) => state.sliceElements);

    const addTextElement = () => {
        const newElement: SlideElement = {
            id: crypto.randomUUID(), // or use (elements.length + 1).toString()
            x: 50,
            y: 50,
            type: 'text' as SlideElementType,
            content: 'New Text Element',
            fontSize: 18,
            fontWeight: 'normal' as const,
        };
        dispatch(addElement(newElement));
    };

    return (
        <Button type="primary" onClick={addTextElement} icon={<PlusOutlined />} style={{ marginRight: 10 }}>
            Thêm Text
        </Button>
    );
};

export default AddText;

