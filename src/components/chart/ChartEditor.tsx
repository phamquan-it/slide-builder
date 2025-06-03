import React, { useRef, useState } from 'react';
import { Button, Form, Input, Space, InputNumber, Image, Checkbox } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Bar,
  Column,
  Line,
  Area,
  Pie,
  Radar,
  Scatter,
  Datum,
} from '@ant-design/plots';
import html2canvas from 'html2canvas';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addElement } from '@/lib/slideElementSlice';

// Import Redux hooks and actions (adjust paths to your project)

interface Props {
  chartKey: string;
  data: Datum;
  onCancel: () => void;
  onSave?: (data: { chartData: any[]; imageBase64: string; background: string }) => void;
}

// Define your SlideElement interface matching your store

const ChartEditor: React.FC<Props> = ({ chartKey, data, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const [previewData, setPreviewData] = useState(data);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [useTransparentBg, setUseTransparentBg] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Redux dispatch and elements state
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.sliceElements);

  const isXYChart = chartKey === 'scatter' || chartKey === 'bubble';

  // Generate next incremental string ID for new element
  const getNextId = (): string => {
    const numericIds = elements
      .map((el) => Number(el.id))
      .filter((num) => !isNaN(num));
    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
    return (maxId + 1).toString();
  };

  const onFinish = async (values: any) => {
    try {
      if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: useTransparentBg ? null : bgColor,
        });
        const imageBase64 = canvas.toDataURL('image/png');
        setImageSrc(imageBase64);

        const payload = {
          chartData: values.data,
          imageBase64,
          background: useTransparentBg ? 'transparent' : bgColor,
        };

        console.log('Saved chart data:', payload);

        // Push image element to redux store
        const newImageElement: SlideElement = {
          id: getNextId(),
          x: 100,
          y: 100,
          type: 'image' as SlideElementType,
          content: imageBase64,
          fontSize: 18,
          fontWeight: 'normal',
        };
        dispatch(addElement(newImageElement));

        if (onSave) {
          onSave(payload);
        }
      }
    } catch (err) {
      console.error('Failed to convert chart to image:', err);
    }
  };

  const renderPreviewChart = () => {
    const chartProps = { height: 300, data: previewData };
    switch (chartKey) {
      case 'bar':
      case 'bar3D':
        return <Bar {...chartProps} xField="value" yField="type" seriesField="type" />;
      case 'col':
      case 'col3D':
        return <Column {...chartProps} xField="type" yField="value" seriesField="type" />;
      case 'line':
      case 'line3D':
        return <Line {...chartProps} xField="type" yField="value" />;
      case 'area':
      case 'area3D':
        return <Area {...chartProps} xField="type" yField="value" />;
      case 'pie':
      case 'pie3D':
      case 'doughnut':
        return (
          <Pie
            {...chartProps}
            angleField="value"
            colorField="type"
            radius={1}
            innerRadius={chartKey === 'doughnut' ? 0.5 : 0}
          />
        );
      case 'radar':
        return <Radar {...chartProps} xField="type" yField="value" seriesField="type" />;
      case 'scatter':
      case 'bubble':
        return <Scatter {...chartProps} xField="x" yField="y" />;
      default:
        return <div>Biểu đồ chưa hỗ trợ</div>;
    }
  };

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Left: Form */}
      <div style={{ flex: 1, minWidth: 300 }}>
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{ data }}
          onValuesChange={(_, allValues) => setPreviewData(allValues.data || [])}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item label="Nền">
            <Space align="center">
              <Checkbox
                checked={useTransparentBg}
                onChange={(e) => setUseTransparentBg(e.target.checked)}
              >
                Nền trong suốt
              </Checkbox>
              {!useTransparentBg && (
                <Input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ width: 60, padding: 0, border: 'none' }}
                />
              )}
            </Space>
          </Form.Item>

          <Form.List name="data">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    {isXYChart ? (
                      <>
                        <Form.Item {...rest} name={[name, 'x']} rules={[{ required: true, message: 'Nhập x' }]}>
                          <InputNumber placeholder="x" />
                        </Form.Item>
                        <Form.Item {...rest} name={[name, 'y']} rules={[{ required: true, message: 'Nhập y' }]}>
                          <InputNumber placeholder="y" />
                        </Form.Item>
                      </>
                    ) : (
                      <>
                        <Form.Item {...rest} name={[name, 'type']} rules={[{ required: true, message: 'Nhập nhãn' }]}>
                          <Input placeholder="Label" />
                        </Form.Item>
                        <Form.Item {...rest} name={[name, 'value']} rules={[{ required: true, message: 'Nhập giá trị' }]}>
                          <InputNumber placeholder="Value" />
                        </Form.Item>
                      </>
                    )}
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      if (isXYChart) {
                        add({ x: 0, y: 0 });
                      } else {
                        add({ type: 'new', value: 0 });
                      }
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm điểm dữ liệu
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
              <Button onClick={onCancel}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      {/* Right: Chart preview */}
      <div style={{ flex: 1, minWidth: 300 }}>
        <strong>Preview:</strong>
        <div
          ref={chartRef}
          style={{
            border: '1px solid #ddd',
            padding: 16,
            borderRadius: 4,
            background: useTransparentBg ? 'transparent' : bgColor,
          }}
        >
          {renderPreviewChart()}
        </div>
      </div>
    </div>
  );
};

export default ChartEditor;

