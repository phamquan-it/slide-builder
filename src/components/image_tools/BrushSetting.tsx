import React from "react";
import { Space, Slider, Radio, Button, Dropdown, Card } from "antd";
import { HighlightOutlined } from '@ant-design/icons';

interface BrushSettingsProps {
    brushSize: number;
    setBrushSize: (value: number) => void;

    tolerance: number;
    setTolerance: (value: number) => void;

    scale: number;
    setScale: (value: number) => void;

    eraseMode: "color" | "feather" | "other";
    setEraseMode: (value: "color" | "feather" | "other") => void;
}

const BrushSettings: React.FC<BrushSettingsProps> = ({
    brushSize,
    setBrushSize,
    tolerance,
    setTolerance,
    scale,
    setScale,
    eraseMode,
    setEraseMode,
}) => {

    return (
        <>
            <Dropdown placement="bottomLeft" dropdownRender={() => (
                <Card>
                    <span>Brush size: {brushSize}px</span>
                    <Slider min={1} max={100} value={brushSize} onChange={setBrushSize} />

                    <span>Tolerance: {tolerance}</span>
                    <Slider min={10} max={100} value={tolerance} onChange={setTolerance} />

                    <span>Zoom: {scale.toFixed(1)}x</span>
                    <Slider min={1} max={5} step={0.1} value={scale} onChange={setScale} />

                    <Radio.Group
                        value={eraseMode}
                        onChange={(e) => setEraseMode(e.target.value as "color" | "feather")}
                    >
                        <Radio value="color">Xóa theo màu</Radio>
                        <Radio value="feather">Làm mờ mềm</Radio>
                    </Radio.Group>
                </Card>
            )}>
                <Button className="!mx-2" icon={<HighlightOutlined/>}>Brush</Button>
            </Dropdown>
        </>
    );
};

export default BrushSettings;

