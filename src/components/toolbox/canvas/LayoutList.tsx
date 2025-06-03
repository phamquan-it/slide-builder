import React, { useState } from 'react';
import { Card, Typography, Row, Col, Tooltip } from 'antd';

const { Text } = Typography;

const layouts = [
  { key: 'title', label: 'Title Slide' },
  { key: 'title_content', label: 'Title + Content' },
  { key: 'two_content', label: 'Two Content' },
  { key: 'comparison', label: 'Comparison' },
  { key: 'pic_caption', label: 'Picture with Caption' },
];

const renderLayoutPreview = (key: string) => {
  switch (key) {
    case 'title':
      return (
        <svg width="100%" height="60" viewBox="0 0 100 60">
          <rect x="10" y="10" width="80" height="10" fill="#1890ff" />
        </svg>
      );
    case 'title_content':
      return (
        <svg width="100%" height="60" viewBox="0 0 100 60">
          <rect x="10" y="8" width="80" height="10" fill="#1890ff" />
          <rect x="10" y="25" width="80" height="25" fill="#d9d9d9" />
        </svg>
      );
    case 'two_content':
      return (
        <svg width="100%" height="60" viewBox="0 0 100 60">
          <rect x="10" y="8" width="80" height="10" fill="#1890ff" />
          <rect x="10" y="25" width="35" height="25" fill="#d9d9d9" />
          <rect x="55" y="25" width="35" height="25" fill="#d9d9d9" />
        </svg>
      );
    case 'comparison':
      return (
        <svg width="100%" height="60" viewBox="0 0 100 60">
          <rect x="10" y="8" width="80" height="10" fill="#1890ff" />
          <rect x="10" y="22" width="35" height="8" fill="#91d5ff" />
          <rect x="10" y="32" width="35" height="18" fill="#d9d9d9" />
          <rect x="55" y="22" width="35" height="8" fill="#91d5ff" />
          <rect x="55" y="32" width="35" height="18" fill="#d9d9d9" />
        </svg>
      );
    case 'pic_caption':
      return (
        <svg width="100%" height="60" viewBox="0 0 100 60">
          <rect x="10" y="8" width="80" height="35" fill="#b7eb8f" />
          <rect x="10" y="45" width="80" height="8" fill="#434343" />
        </svg>
      );
    default:
      return <Text>Unknown</Text>;
  }
};

const LayoutList: React.FC = () => {
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);

  return (
    <div style={{ padding: 16 }}>
      <Typography.Title level={4}>Chọn Layout Slide</Typography.Title>
      <Row gutter={[12, 12]}>
        {layouts.map(({ key, label }) => (
          <Col key={key} xs={12} sm={8} md={6} lg={4}>
            <Tooltip title={label}>
              <Card
                hoverable
                onClick={() => setSelectedLayout(key)}
                style={{
                  textAlign: 'center',
                  border:
                    selectedLayout === key ? '2px solid #1890ff' : undefined,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {renderLayoutPreview(key)}
              </Card>
            </Tooltip>
          </Col>
        ))}
      </Row>

      {selectedLayout && (
        <Card
          style={{ marginTop: 20 }}
          type="inner"
          title="Layout đã chọn"
        >
          <Text strong>{layouts.find(l => l.key === selectedLayout)?.label}</Text>
        </Card>
      )}
    </div>
  );
};

export default LayoutList;

