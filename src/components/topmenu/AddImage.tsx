'use client';

import { FileImageOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addElement } from '@/lib/slideElementSlice';

const AddImage: React.FC = () => {
    const dispatch = useAppDispatch();
    const elements = useAppSelector((state) => state.sliceElements);

    const addImageElement = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                const newElement: SlideElement = {
                    id: elements.length + 1 + '',
                    x: 100,
                    y: 100,
                    type: 'image' as SlideElementType,
                    content: reader.result as string,
                    fontSize: 18,
                    fontWeight: 'normal',
                };
                dispatch(addElement(newElement));
                console.log('New element', newElement);
            };

            reader.readAsDataURL(file);
        };

        input.click();
    };

    return (
        <Button icon={<FileImageOutlined />} onClick={addImageElement}>
            Thêm hình ảnh
        </Button>
    );
};

export default AddImage;


//import { FileImageOutlined } from '@ant-design/icons';
//import { Button, Upload, UploadProps } from 'antd';
//import React, { Dispatch, SetStateAction } from 'react';
//interface AddImageProps {
//    elements: SlideElement[],
//    setElements: Dispatch<SetStateAction<SlideElement[]>>,
//}
//
//const AddImage: React.FC<AddImageProps> = ({ elements, setElements }) => {
//
//    const addImageElement = () => {
//        const input = document.createElement('input');
//        input.type = 'file';
//        input.accept = 'image/*';
//        input.onchange = () => {
//            const file = input.files?.[0];
//            if (!file) return;
//
//            const reader = new FileReader();
//            reader.onload = () => {
//                const newElement: SlideElement = {
//                    id: (elements.length + 1).toString(),
//                    x: 100,
//                    y: 100,
//                    type: 'image',
//                    content: reader.result as string,
//                    fontSize: 18,
//                    fontWeight: 'normal',
//                };
//                setElements((prev) => [...prev, newElement]);
//                console.log("New element", newElement)
//            };
//
//            reader.readAsDataURL(file);
//        };
//        input.click();
//    };
//    return <>
//        <div className="inline-block">
//            <Button icon={<FileImageOutlined />} onClick={addImageElement}>Thêm hình ảnh</Button>
//        </div>
//
//    </>
//}
//
//export default AddImage
