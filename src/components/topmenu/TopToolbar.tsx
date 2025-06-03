'use client';

import React from 'react';
import { Button, Space, Select, Dropdown, Tooltip, Divider, Upload, ColorPicker, message } from 'antd';
import {
    FileImageOutlined,
    BgColorsOutlined,
    ExportOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload';
import { useDispatch } from 'react-redux';
import { updateSlideBackground } from '@/lib/slidesSlice';
import AddText from './AddText';
import AddImage from './AddImage';

type Mode = 'move' | 'resize';

interface TopToolbarProps {
    mode: Mode;
    onModeChange: (value: Mode) => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({
    mode,
    onModeChange,
}) => {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage()
    const handleImageUpload = (file: RcFile) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            dispatch(updateSlideBackground({ backgroundImage: base64 }));
            messageApi.success('Đã đặt hình nền');
        };
        reader.readAsDataURL(file);
        return false; // Prevent default upload behavior
    };

    const backgroundMenu = {
        items: [
            {
                key: 'color',
                label: (
                    <ColorPicker
                        showText
                        onChange={(color) =>
                            dispatch(updateSlideBackground({ backgroundColor: color.toHexString() }))
                        }
                    />
                ),
            },
            {
                key: 'image',
                label: (
                    <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={handleImageUpload}
                    >
                        <Button type="text" size="small">
                            Chọn hình ảnh
                        </Button>
                    </Upload>
                ),
            },
        ],
    };

    return (
        <div className="bg-white px-4 py-2 border-b border-gray-200 shadow-sm flex justify-between items-center mb-2">
            {contextHolder}
            {/* Left side: Action buttons */}
            <Space>
                <AddText />
                <AddImage/>
                <Dropdown menu={backgroundMenu}>

                    <Button icon={<BgColorsOutlined />}>Nền</Button>
                </Dropdown>
            </Space>
            {/* Right side: Export + Mode */}
            <Space>
                <Tooltip title="Xuất file PPTX">
                    <Button icon={<ExportOutlined />}>
                        Export PPTX
                    </Button>
                </Tooltip>

                <Divider type="vertical" />

                <Select
                    value={mode}
                    onChange={(value) => onModeChange(value as Mode)}
                    style={{ width: 160 }}
                    options={[
                        { value: 'move', label: 'Di chuyển (m)' },
                        { value: 'resize', label: 'Thay đổi kích thước (r)' },
                    ]}
                />
            </Space>
        </div>
    );
};

export default TopToolbar;

