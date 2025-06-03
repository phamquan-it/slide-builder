import React, { useState } from 'react';
import { Upload, Button, Spin, Image, Typography, Row, Col, message, Radio } from 'antd';
import { UploadOutlined, DownloadOutlined, BgColorsOutlined } from '@ant-design/icons';
import { removeBackground } from '@imgly/background-removal';
import { saveAs } from 'file-saver';

const { Dragger } = Upload;
const { Title } = Typography;

const bgColors = [
    { name: 'Trong suốt', value: 'transparent' },
    { name: 'Trắng', value: '#ffffff' },
    { name: 'Xanh lá', value: '#ccffcc' },
    { name: 'Hồng nhạt', value: '#ffe6f0' },
    { name: 'Vàng nhạt', value: '#fff7cc' },
];

const BackgroundRemover: React.FC = () => {
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [bgColor, setBgColor] = useState<string>('transparent');
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage()
    const handleUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            messageApi.error('Vui lòng chọn file ảnh hợp lệ');
            return false;
        }

        setOriginalUrl(URL.createObjectURL(file));
        setLoading(true);

        try {
            const resultBlob = await removeBackground(file);
            setProcessedBlob(resultBlob);
            setBgColor('transparent');
            await createPreviewWithBackground(resultBlob, 'transparent');
            messageApi.success('Đã xoá nền thành công!');
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi xử lý ảnh');
        } finally {
            setLoading(false);
        }

        return false; // Ngăn không upload thực tế
    };

    const createPreviewWithBackground = async (blob: Blob, background: string) => {
        const img = await createImageBitmap(blob);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        if (background !== 'transparent') {
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob((resultBlob) => {
            if (resultBlob) {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(URL.createObjectURL(resultBlob));
            }
        }, 'image/png');
    };

    const handleDownload = () => {
        if (previewUrl) {
            const name = `no-bg-${bgColor === 'transparent' ? 'transparent' : bgColor.replace('#', '')}.png`;
            saveAs(previewUrl, name);
        }
    };

    const handleColorChange = (e: any) => {
        const newColor = e.target.value;
        setBgColor(newColor);
        if (processedBlob) {
            createPreviewWithBackground(processedBlob, newColor);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
            {contextHolder}
            <Title level={3}>🎨 Xoá nền & đổi nền ảnh</Title>

            <Dragger
                beforeUpload={handleUpload}
                accept="image/*"
                showUploadList={false}
                maxCount={1}
                onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleUpload(file);
                }}
            >
                <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                </p>
                <p className="ant-upload-text">Kéo và thả ảnh vào đây hoặc bấm để chọn ảnh</p>
            </Dragger>

            {loading && <Spin className="mt-6"></Spin>}

            {previewUrl && (
                <>
                    <div className="pt-6">
                        <Title level={5} className="mb-2 flex items-center gap-2">
                            <BgColorsOutlined /> Màu nền thay thế:
                        </Title>
                        <Radio.Group
                            value={bgColor}
                            onChange={handleColorChange}
                            optionType="button"
                            buttonStyle="solid"
                        >
                            {bgColors.map((bg) => (
                                <Radio key={bg.value} value={bg.value}>
                                    {bg.name}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </div>

                    <Row gutter={24} className="mt-6">
                        {originalUrl && (
                            <Col xs={24} md={12}>
                                <Title level={5}>Ảnh gốc</Title>
                                <Image src={originalUrl} alt="Ảnh gốc" className="rounded-lg" />
                            </Col>
                        )}
                        <Col xs={24} md={12}>
                            <div className="flex justify-between items-center mb-2">
                                <Title level={5}>Ảnh đã xoá nền</Title>
                                <Button
                                    icon={<DownloadOutlined />}
                                    type="primary"
                                    onClick={handleDownload}
                                >
                                    Tải ảnh
                                </Button>
                            </div>
                            <Image src={previewUrl} alt="Ảnh xử lý" className="rounded-lg" />
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default BackgroundRemover;

