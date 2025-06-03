import React, { useState } from 'react';
import { Card, Row, Col, Typography, Tooltip, Button } from 'antd';

const { Text } = Typography;

// Một số màu theme phổ biến của PowerPoint
const colors = [
    '#FFFFFF', '#000000', '#EEECE1', '#1F497D', '#4F81BD',
    '#C0504D', '#9BBB59', '#8064A2', '#4BACC6', '#F79646',
    '#FFFF00', '#00B050', '#0070C0', '#7030A0',
];

const ColorList: React.FC = () => {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    return (
        <div style={{ padding: 16 }}>
            <Typography.Title level={4}>Chọn Màu Sắc</Typography.Title>
            <Row gutter={[12, 12]}>
                {colors.map((color) => (
                    <Col key={color} xs={6} sm={4} md={3} lg={2}>
                        <Tooltip title={color}>
                            <Button
                                onClick={() => setSelectedColor(color)}
                                style={{
                                    border: selectedColor === color ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                    backgroundColor: color,
                                    cursor: 'pointer',
                                }}
                            />
                        </Tooltip>
                    </Col>
                ))}
            </Row>

            {selectedColor && (
                <Card
                    style={{ marginTop: 20, textAlign: 'center' }}
                    type="inner"
                    title="Màu đã chọn"
                >
                    <div style={{ backgroundColor: selectedColor, height: 40, borderRadius: 4 }} />
                    <Text code style={{ display: 'block', marginTop: 8 }}>
                        {selectedColor}
                    </Text>
                </Card>
            )}
        </div>
    );
};

export default ColorList;

