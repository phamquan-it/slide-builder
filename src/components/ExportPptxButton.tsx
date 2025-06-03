'use client';
import React from 'react';
import { Button } from 'antd';

interface ExportPptxClientButtonProps {
  elements: SlideElement[];
  background?: string;
  filename?: string;
}

const ExportPptxClientButton: React.FC<ExportPptxClientButtonProps> = ({
  elements,
  background,
  filename = 'presentation.pptx',
}) => {
  const handleExport = async () => {
    try {
      const res = await fetch('/api/export-pptx', {
        method: 'POST',
        body: JSON.stringify({ elements, background }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Export failed');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export PPTX');
      console.error(err);
    }
  };

  return (
    <Button type="primary" onClick={handleExport}>
      Export PPTX
    </Button>
  );
};

export default ExportPptxClientButton;

