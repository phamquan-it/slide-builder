'use client';
import React, { useState } from 'react';
import {
    Button,
    Tooltip,
    message,
    Card,
} from 'antd';
import {
    FontSizeOutlined,
    PictureOutlined,
    EditOutlined,
    AppstoreAddOutlined,
    BgColorsOutlined,
    ClearOutlined,
    SettingFilled,
    MessageOutlined,
    BulbOutlined,
} from '@ant-design/icons';
import PickColorBox from '../PickColorBox';
import Canvas from '../toolbox/canvas';
import ImportSlide from '../toolbox/code';
import ExportSlidesToJson from '../toolbox/exportSlide';
import Assets from '../assets/Assets';

const GRID_MENU_ITEMS = [
    { key: 'text', label: 'Add Text', icon: <FontSizeOutlined /> },
    { key: 'image', label: 'Upload Image', icon: <PictureOutlined /> },
    { key: 'draw', label: 'Draw', icon: <EditOutlined /> },
    { key: 'shape', label: 'Add Shape', icon: <AppstoreAddOutlined /> },
    { key: 'color', label: 'Pick Color', icon: <BgColorsOutlined /> },
    { key: 'clear', label: 'Clear Canvas', icon: <ClearOutlined /> },
];

const MakeWorkspace: React.FC = () => {
    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    const handleMenuClick = (key: string) => {
        setSelectedTool(key);
        message.info(`Selected: ${key}`);
    };

    return (
        <div style={{ padding: 16 }}>
            {/* Grid Menu */}
            <div className="grid grid-cols-2 gap-2">
                {/* Floating Color Picker */}
                <PickColorBox />

                {/* Assets */}
                <Assets />
                <Canvas />
                <ImportSlide />
                <ExportSlidesToJson />
            </div>

        </div>
    );
};

export default MakeWorkspace;

