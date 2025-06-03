import { setElements } from '@/lib/slideElementSlice';
import { RootState } from '@/lib/store';
import { Checkbox, CheckboxChangeEvent, Form, Input, Modal, Slider } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
interface EditTextElementProps {
    id: string | number,
    isModalOpen: boolean,
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const EditTextElement: React.FC<EditTextElementProps> = ({ id, isModalOpen, setIsModalOpen }) => {
    const dispatch = useDispatch();

    const elements = useSelector((state: RootState) => state.sliceElements);
    const [form] = Form.useForm();

    const element = elements.find(e => e.id === id);
    const handleContentChange = (id: string, newValues: any) => {
        const updated = elements.map(el =>
            el.id === id ? {
                ...el, ...newValues,
                fontWeight: form.getFieldValue('fontWeight') ? 'bold' : 'normal'
            } : el
        );
        dispatch(setElements(updated));
    };

    const handleFontWeightChange = (e: CheckboxChangeEvent) => {
        const updated: SlideElement[] = elements.map(el =>
            el.id === id ? { ...el, fontWeight: e.target.checked ? 'bold' : 'normal' } : el
        );
        dispatch(setElements(updated));
    };

    return <>
        <Modal
            destroyOnClose={true}
            title="Edit"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={() => form.submit()}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    content: element?.content,
                    color: element?.color ?? '#000000',
                    fontSize: element?.fontSize,
                    fontWeight: element?.fontWeight === 'bold',
                }}
                autoComplete="off"
                onFinish={(value) => {
                    handleContentChange(id + '', value);
                    setIsModalOpen(false);
                }}
            >
                <Form.Item label="Content" name="content" rules={[{ required: true }]}>
                    <Input.TextArea autoSize />
                </Form.Item>
                <Form.Item
                    label="Text Color"
                    name="color"
                    rules={[{ required: true, message: 'Text color is required' }]}
                >
                    <Input type="color" />
                </Form.Item>
                <Form.Item
                    label="Font Size"
                    name="fontSize"
                    rules={[{ required: true, message: 'Font size is required' }]}
                >
                    <Slider />
                </Form.Item>
                <Form.Item
                    name="fontWeight"
                    valuePropName="checked"
                >
                    <Checkbox onChange={handleFontWeightChange}>Bold</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default EditTextElement
