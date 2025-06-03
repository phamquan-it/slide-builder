// ToolbarActions.tsx
import React from 'react';
import { Button, Space } from 'antd';
import ImageUploader from './ImageUploader';

interface ToolbarActionsProps {
  onUpload: (file: File) => void;
  onEraseBorder: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ToolbarActions: React.FC<ToolbarActionsProps> = ({
  onUpload,
  onEraseBorder,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  return (
    <Space style={{ marginTop: 16 }}>
      <ImageUploader onUpload={onUpload} />
      <Button onClick={onEraseBorder} danger>
        Xoá viền ngoài
      </Button>
      <Button onClick={onUndo} disabled={!canUndo}>
        ↩️ Undo
      </Button>
      <Button onClick={onRedo} disabled={!canRedo}>
        ↪️ Redo
      </Button>
    </Space>
  );
};

export default ToolbarActions;

