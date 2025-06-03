import { Tabs, TabsProps } from 'antd';
import React from 'react';
import WrapBox from '../layouts/WrapBox';
import Slides from '../Slides';
import MakeWorkspace from './MakeWorkspace';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

const SlideElementsTable = dynamic(() => import('../../components/SlideElements'), { ssr: false });

const LastMenu: React.FC = () => {
    const slides = useSelector((state: RootState) => state.slides);
    const items: TabsProps['items'] = [
        {
            key: 'slide',
            label: 'Slides',
            children: <WrapBox scrollToBottomWhenDataChange={slides}>
                <Slides />
            </WrapBox>
        },
        {
            key: 'component',
            label: 'Components',
            children: (
                <WrapBox>
                    <SlideElementsTable />
                </WrapBox>
            )
        },
        {
            key: 'toolbox',
            label: 'Toolbox',
            children: (<></>),
        },
    ];
    return <>
        <Tabs defaultActiveKey="1" items={items} />
    </>
}

export default LastMenu
