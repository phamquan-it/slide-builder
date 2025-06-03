import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const handleBeforeUpload = (file: File) => {
    onUpload(file);
    return false; // Ngăn upload tự động
  };

  return (
    <Upload
      beforeUpload={handleBeforeUpload}
      accept="image/*"
      maxCount={1}
      showUploadList={false}
    >
      <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
    </Upload>
  );
};

export default ImageUploader;

