import React, { useState } from 'react';
import { Card, Typography, Modal } from 'antd';
import { Bar, Column, Line, Area, Pie, Scatter } from '@ant-design/plots';
import ChartEditor from '@/components/chart/ChartEditor';

const { Text, Title } = Typography;

const chartTypes = [
    { key: 'bar', label: 'Bar Chart' },
    { key: 'col', label: 'Column Chart' },
    { key: 'line', label: 'Line Chart' },
    { key: 'area', label: 'Area Chart' },
    { key: 'pie', label: 'Pie Chart' },
    { key: 'scatter', label: 'Scatter Chart' },
];

const defaultChartData = {
    bar: [{ type: 'A', value: 10 }, { type: 'B', value: 10 }],
    col: [{ type: 'A', value: 20 }],
    line: [{ type: 'A', value: 20 }, { type: 'B', value: 30 }],
    area: [{ type: 'A', value: 8 }, { type: 'B', value: 10 }],
    pie: [{ type: 'A', value: 15 }, { type: 'B', value: 25 }],
    scatter: [{ x: 10, y: 20 }, { x: 30, y: 50 }],
};

const AllCharts: React.FC = () => {
    const [selectedChartKey, setSelectedChartKey] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chartConfigs, setChartConfigs] = useState<any>(defaultChartData);

    const openEditor = (key: string) => {
        setSelectedChartKey(key);
        setIsModalOpen(true);
    };

    const handleSave = (key: string, newData: any) => {
        setChartConfigs((prev: any) => ({ ...prev, [key]: newData }));
        setIsModalOpen(false);
    };

    const renderChart = (key: string) => {
        const config = chartConfigs[key];
        if (!config) return null;

        switch (key) {
            case 'bar':
                return <Bar height={200} data={config} xField="value" yField="type" />;
            case 'col':
                return <Column height={200} data={config} xField="type" yField="value" />;
            case 'line':
                return <Line height={200} data={config} xField="type" yField="value" />;
            case 'area':
                return <Area height={200} data={config} xField="type" yField="value" />;
            case 'pie':
                return <Pie height={200} data={config} angleField="value" colorField="type" />;
            case 'scatter':
                return <Scatter height={200} data={config} xField="x" yField="y" />;
            default:
                return <Text type="secondary">Unsupported</Text>;
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <Title level={4}>Tất cả biểu đồ</Title>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
                    gap: 16,
                    height: 400,
                    overflowY: "auto"
                }}
            >
                {chartTypes.map(({ key, label }) => (
                    <Card
                        key={key}
                        title={label}
                        hoverable
                        onClick={() => openEditor(key)}
                        style={{ minWidth: '10rem' }}
                    >
                        {renderChart(key)}
                    </Card>
                ))}
            </div>

            <Modal
                title="Chỉnh sửa biểu đồ"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
            >
                {selectedChartKey && (
                    <ChartEditor
                        chartKey={selectedChartKey}
                        data={[...chartConfigs[selectedChartKey]]}
                        onCancel={() => setIsModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default AllCharts;

