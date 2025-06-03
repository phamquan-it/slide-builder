'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FloatButton,
    Modal,
    Input,
    Form,
    Tooltip,
    message,
    Segmented,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RootState } from '@/lib/store';
import {
    addSlideDeck,
    updateDeckName,
    deleteSlideDeck,
} from '@/lib/slidesSlice';

const SlideFloatButton = () => {
    const dispatch = useDispatch();
    const slides = useSelector((state: RootState) => state.slides);
    const selectedIndex = slides.findIndex((s) => s.selected);
    const selectedSlide = slides[selectedIndex];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [action, setAction] = useState<'add' | 'update' | 'delete'>('add');

    const showModal = () => {
        setIsModalOpen(true);
        if (selectedSlide && action !== 'add') {
            form.setFieldsValue({
                title: selectedSlide.name,
                content: selectedSlide.content,
            });
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { title, content } = values;

            if (action === 'add') {
                const newDeck: SlidesState = {
                    id: Date.now(),
                    name: title,
                    content: content || '',
                    data: [],
                    selected: false,
                };
                dispatch(addSlideDeck(newDeck));
                messageApi.success('Slide deck added!');
            }

            if (action === 'update' && selectedIndex !== -1) {
                dispatch(updateDeckName({ index: selectedIndex, name: title }));
                messageApi.success('Slide title updated!');
            }

            if (action === 'delete' && selectedIndex !== -1) {
                dispatch(deleteSlideDeck(selectedIndex));
                messageApi.success('Slide deck deleted!');
            }

            form.resetFields();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Form error:', error);
        }
    };

    const onSegmentChange = (value: string) => {
        setAction(value as typeof action);
        if (value === 'add') {
            form.resetFields();
        } else if (selectedSlide) {
            form.setFieldsValue({
                title: selectedSlide.name,
                content: selectedSlide.content,
            });
        }
    };

    return (
        <>
            {contextHolder}
            <Tooltip title="Manage slide deck">
                <FloatButton
                    icon={<PlusOutlined />}
                    onClick={showModal}
                    style={{ right: 24, bottom: 24, width: 50, height: 50 }}
                />
            </Tooltip>

            <Modal
                title="Slide Deck"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={action === 'delete' ? 'Xóa' : 'OK'}
            >
                <Segmented
                    style={{ marginBottom: 16 }}
                    value={action}
                    onChange={onSegmentChange}
                    options={[
                        { label: 'Thêm mới', value: 'add' },
                        {
                            label: 'Cập nhật',
                            value: 'update',
                            disabled: selectedIndex === -1,
                        },
                        {
                            label: 'Xóa',
                            value: 'delete',
                            disabled: selectedIndex === -1,
                        },
                    ]}
                />

                {(action === 'add' || action === 'update') && (
                    <Form form={form} layout="vertical" name="slide_deck_form">
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{ required: true, message: 'Please input the title!' }]}
                        >
                            <Input placeholder="Enter deck title" />
                        </Form.Item>
                        <Form.Item label="Content" name="content">
                            <Input.TextArea placeholder="Enter deck content (optional)" rows={4} />
                        </Form.Item>
                    </Form>
                )}

                {action === 'delete' && (
                    <div style={{ color: 'red', fontWeight: 'bold' }}>
                        Bạn có chắc xóa slide đã chọn không?
                    </div>
                )}
            </Modal>
        </>
    );
};

export default SlideFloatButton;

