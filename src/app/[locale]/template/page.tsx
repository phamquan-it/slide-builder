'use client';

import React, { useState } from 'react';
import { Button, Space, Select, Dropdown, Tooltip, Divider } from 'antd';
import {
  FileImageOutlined,
  BgColorsOutlined,
  ExportOutlined,
  PlusOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Option } = Select;

const Page = () => {
  const [mode, setMode] = useState<'move' | 'resize'>('move');

  const handleMenuClick = (key: string) => {
    if (key === 'color') {
      console.log('Set Background Color');
    } else if (key === 'image') {
      console.log('Set Background Image');
    }
  };

  const backgroundMenu = {
    items: [
      { key: 'color', label: 'Đặt màu nền' },
      { key: 'image', label: 'Đặt hình nền' },
    ],
    onClick: ({ key }: any) => handleMenuClick(key),
  };

  return (
    <div className="bg-white px-4 py-2 border-b border-gray-500/0  shadow-sm flex justify-between items-center">
      {/* Left side: Action buttons */}
      <Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => console.log('Thêm Text')}>
          Thêm Text
        </Button>
        <Button icon={<FileImageOutlined />} onClick={() => console.log('Thêm Hình Ảnh')}>
          Thêm hình ảnh
        </Button>
        <Dropdown menu={backgroundMenu}>
          <Button icon={<BgColorsOutlined />}>Nền</Button>
        </Dropdown>
      </Space>

      {/* Right side: Export + Mode */}
      <Space>
        <Tooltip title="Xuất file PPTX">
          <Button icon={<ExportOutlined />} onClick={() => console.log('Export PPTX')}>
            Export PPTX
          </Button>
        </Tooltip>

        <Divider type="vertical" />

        <Select
          value={mode}
          onChange={(value) => setMode(value)}
          style={{ width: 140 }}
          options={[
            { value: 'move', label: 'Di chuyển (m)' },
            { value: 'resize', label: 'Thay đổi kích thước (r)' },
          ]}
        />
      </Space>
    </div>
  );
};

export default Page;

