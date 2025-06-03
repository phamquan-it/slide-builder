import { BulbOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { exportSlidesToJson } from './utils/exportSlides';
import { useAppSelector } from '@/lib/hooks';

const ExportSlidesToJson = () => {
    const slides = useAppSelector((state) => state.slides);
    return <>
        <Button
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 80,
                fontWeight: 500,
            }}
            onClick={() => exportSlidesToJson(slides)}

        >
            <div className="!text-center">
                Export json
            </div>
            <BulbOutlined />
        </Button>
    </>
}

export default ExportSlidesToJson
