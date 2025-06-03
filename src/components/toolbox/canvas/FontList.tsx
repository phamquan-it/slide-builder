import React, { useState } from 'react';
import { Radio, Card, Typography, Space } from 'antd';

const fonts = [
    'Arial',
    'Calibri',
    'Times New Roman',
    'Verdana',
    'Tahoma',
    'Courier New',
    'Georgia',
    'Comic Sans MS',
    'Impact',
    'Trebuchet MS',
    'Lucida Console',
    'Garamond',
    'Franklin Gothic Medium',
    'Palatino Linotype',
];

const FontList: React.FC = () => {
    const [selectedFont, setSelectedFont] = useState<string>(fonts[0]);

    return (
        <div >
            <Typography.Title level={5}>Chọn font chữ:</Typography.Title>

            <Radio.Group
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                style={{ width: '100%', maxHeight: 280, overflowY: 'auto', paddingRight: 8 }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    {fonts.map((font) => (
                        <Radio.Button
                            key={font}
                            value={font}
                            style={{
                                fontFamily: font,
                                width: '100%',
                                textAlign: 'left',
                                borderRadius: 6,
                                boxShadow: '0 2px 5px rgb(0 0 0 / 0.1)',
                                userSelect: 'none',
                            }}
                        >
                            {font}
                        </Radio.Button>
                    ))}
                </Space>
            </Radio.Group>
        </div>
    );
};

export default FontList;

