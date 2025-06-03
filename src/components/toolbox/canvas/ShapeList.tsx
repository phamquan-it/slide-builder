import React, { useState } from 'react';
import { Card, Typography, Row, Col, Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addElement } from '@/lib/slideElementSlice';

const { Text } = Typography;

const shapes = ['rect', 'ellipse', 'triangle', 'diamond'];

const shapeIcons: Record<string, React.ReactNode> = {
    rect: (
        <svg width="40" height="40">
            <rect width="30" height="20" x="5" y="10" fill="#1890ff" />
        </svg>
    ),
    ellipse: (
        <svg width="40" height="40">
            <ellipse cx="20" cy="20" rx="15" ry="10" fill="#52c41a" />
        </svg>
    ),
    triangle: (
        <svg width="40" height="40">
            <polygon points="20,5 35,35 5,35" fill="#f5222d" />
        </svg>
    ),
    diamond: (
        <svg width="40" height="40">
            <polygon points="20,5 35,20 20,35 5,20" fill="#722ed1" />
        </svg>
    ),
};

const ShapeList: React.FC = () => {
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const elements = useAppSelector((state) => state.sliceElements);

    const handleAddShape = (shape: string) => {
        dispatch(addElement({
            id: (elements.length + 1).toString(),
            x: 200,
            y: 200,
            w: 100,
            h: 50,
            type: 'shape' as SlideElementType,
            color: '#52c41a',
            content: shape,
            fontSize: 18,
            fontWeight: 'normal'
        }));

        setSelectedShape(shape);
    };

    return (
        <div style={{ padding: 16 }}>
            <Typography.Title level={4}>Chọn Shape</Typography.Title>
            <Row gutter={[12, 12]} style={{ maxHeight: 300 }}>
                {shapes.map((shape) => (
                    <Col key={shape} xs={8} sm={6} md={4} lg={3}>
                        <Tooltip title={shape}>
                            <Card
                                hoverable
                                onClick={() => handleAddShape(shape)}
                                style={{
                                    textAlign: 'center',
                                    border:
                                        selectedShape === shape ? '2px solid #1890ff' : undefined,
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    height: 100,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {shapeIcons[shape] ?? <Text>{shape}</Text>}
                            </Card>
                        </Tooltip>
                    </Col>
                ))}
            </Row>

            {selectedShape && (
                <Card
                    style={{ marginTop: 20, textAlign: 'center' }}
                    type="inner"
                    title="Shape đã chọn"
                >
                    {selectedShape}
                </Card>
            )}
        </div>
    );
};

export default ShapeList;

