import { Button } from 'antd';
import React from 'react';

type DownloadImageButtonProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    imageLoaded: boolean;
    fileName?: string;
    label?: string;
};

export const DownloadImageButton: React.FC<DownloadImageButtonProps> = ({
    canvasRef,
    imageLoaded,
    fileName = 'edited-image.png',
    label = '💾 Tải ảnh đã xử lý',
}) => {
    const handleDownload = () => {
        if (!canvasRef?.current) return;
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <Button
            style={{ marginTop: 24 }}
            onClick={handleDownload}
            disabled={!imageLoaded}
        >
            {label}
        </Button>
    );
};

