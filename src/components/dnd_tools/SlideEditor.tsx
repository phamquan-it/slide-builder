import { Checkbox, CheckboxChangeEvent, Input, Slider } from 'antd';
import Title from 'antd/es/typography/Title';
import React from 'react';
interface SlideEditorProps {
    selectedElementId: any,
    elements: any,
    setElements: (e: any) => void
}

const SlideEditor: React.FC<SlideEditorProps> = ({ elements, selectedElementId, setElements }) => {

    const handleContentChange = (id: string, newContent: string) => {
        setElements((prev: any) =>
            prev.map((el: any) => el.id === id ? { ...el, content: newContent } : el)
        );
    };

    const handleFontSizeChange = (size: number) => {
        if (selectedElementId) {
            setElements((prev: any) =>
                prev.map((el: any) => el.id === selectedElementId ? { ...el, fontSize: size } : el)
            );
        }
    };

    const handleFontWeightChange = (e: CheckboxChangeEvent) => {
        if (selectedElementId) {
            setElements((prev: any) =>
                prev.map((el: any) => el.id === selectedElementId ? { ...el, fontWeight: e.target.checked ? 'bold' : 'normal' } : el)
            );
        }
    };

    return <>
        <div style={{ marginTop: 20 }}>
            <Title level={4}>Chỉnh sửa văn bản</Title>
            <Input
                value={elements.find((el: any) => el.id === selectedElementId)?.content || ''}
                onChange={(e) => handleContentChange(selectedElementId, e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <div>
                <label>Font Size:</label>
                <Slider
                    min={10}
                    max={50}
                    value={elements.find((el: any) => el.id === selectedElementId)?.fontSize || 18}
                    onChange={handleFontSizeChange}
                    style={{ marginBottom: 10 }}
                />
            </div>
            <div>
                <Checkbox
                    checked={elements.find((el: any) => el.id === selectedElementId)?.fontWeight === 'bold'}
                    onChange={handleFontWeightChange}
                >
                    Bold
                </Checkbox>
            </div>
        </div>
    </>
}

export default SlideEditor
