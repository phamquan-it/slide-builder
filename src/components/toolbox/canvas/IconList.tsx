'use client';

import React, { useState, useMemo } from 'react';
import * as Icons from '@ant-design/icons';
import { Input, Pagination, Select, Spin, Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addElement } from '@/lib/slideElementSlice';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import { debounce } from 'lodash';

const { Option } = Select;
const suffixes = ['Outlined', 'Filled', 'TwoTone'];

const IconList: React.FC = () => {
    const dispatch = useAppDispatch();
    const elements = useAppSelector((state) => state.sliceElements);

    const allIconNames = useMemo(() => Object.keys(Icons), []);
    const [search, setSearch] = useState('');
    const [filterSuffix, setFilterSuffix] = useState<string>('Outlined');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50;

    const filteredIconNames = useMemo(() => {
        return allIconNames.filter(
            (name) =>
                name.endsWith(filterSuffix) &&
                name.toLowerCase().includes(search.toLowerCase())
        );
    }, [allIconNames, filterSuffix, search]);

    const currentIcons = filteredIconNames.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Convert icon React component to base64 image
    const convertIconToBase64 = (IconComponent: React.FC<any>): Promise<string> => {
        return new Promise((resolve) => {
            // Create a hidden container div with transparent background and no border
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '-10000px';
            container.style.left = '-10000px';
            container.style.width = '64px';
            container.style.height = '64px';
            container.style.backgroundColor = 'transparent';  // Ensure transparent background
            container.style.border = 'none';                   // Remove any border
            container.style.padding = '0';                      // Remove padding

            document.body.appendChild(container);

            // Render the icon into container using React 18 createRoot
            const root = createRoot(container);
            root.render(<IconComponent style={{ fontSize: 64, color: 'black', backgroundColor: 'transparent' }} />);

            // Wait a short moment to ensure render completed
            setTimeout(() => {
                html2canvas(container, { backgroundColor: null }).then((canvas) => {
                    const base64 = canvas.toDataURL('image/png');
                    root.unmount();
                    document.body.removeChild(container);
                    resolve(base64);
                });
            }, 100); // 100ms delay
        });
    };

    const [loading, setLoading] = useState(false)
    const handleIconClick = debounce(async (name: string) => {
        setLoading(true)
        const IconComponent = Icons[name as keyof typeof Icons] as React.FC<any>;
        try {
            const base64 = await convertIconToBase64(IconComponent);

            const newElement: SlideElement = {
                id: (elements.length + 1).toString(),
                x: 100,
                y: 100,
                type: 'image' as SlideElementType,
                content: base64,
                fontSize: 18,
                fontWeight: 'normal',
            };
            dispatch(addElement(newElement));
            console.log('Added image element', newElement);
        } catch (error) {
            console.error('Error converting icon to image', error);
        }
        setLoading(false)
    }, 500);
    if(loading) return <Spin/>
    return (
        <div className="p-4">
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <Input
                    placeholder="Search icon"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    style={{ width: 200 }}
                />
                <Select
                    value={filterSuffix}
                    onChange={(value) => {
                        setFilterSuffix(value);
                        setCurrentPage(1);
                    }}
                    style={{ width: 150 }}
                >
                    {suffixes.map((suffix) => (
                        <Option key={suffix} value={suffix}>
                            {suffix}
                        </Option>
                    ))}
                </Select>
            </div>

            <div className="h-64 !overflow-y-auto grid grid-cols-7 gap-2 -me-4 mb-2">
                {currentIcons.map((name) => {
                    const IconComponent = Icons[name as keyof typeof Icons] as React.FC<
                        React.HTMLAttributes<HTMLElement>
                    >;
                    return (
                        <Tooltip title={name} key={name}>
                            <div
                                onClick={() => handleIconClick(name)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="border border-gray-100 rounded p-4 flex items-center justify-center">
                                    <IconComponent style={{ fontSize: 24 }} />
                                </div>
                            </div>
                        </Tooltip>
                    );
                })}
            </div>

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredIconNames.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
                style={{ textAlign: 'center' }}
            />
        </div>
    );
};

export default IconList;

