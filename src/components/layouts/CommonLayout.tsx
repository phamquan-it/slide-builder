'use client'
import React, { ReactNode, useState } from 'react';
import { Avatar, Button, Card, Col, Divider, Dropdown, Input, Layout, Menu, MenuProps, Row, Space, Spin } from 'antd';
import { BarChartOutlined, BookOutlined, CalendarOutlined, CameraOutlined, FacebookFilled, GithubOutlined, GlobalOutlined, HistoryOutlined, HomeOutlined, InfoCircleOutlined, LinkedinFilled, MailOutlined, MenuOutlined, PlusCircleOutlined, SearchOutlined, SettingOutlined, TwitterCircleFilled, UnorderedListOutlined, UserOutlined, VideoCameraOutlined, YoutubeFilled } from '@ant-design/icons';
import { Path } from '@/enums/path';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavigationLink from '../core/NavigationLink';
const { Header, Footer, Sider, Content } = Layout;
const { Item } = Menu
interface CommonLayoutProps {
    children: ReactNode
}

const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
    const pathname = usePathname(); // Get the current pathname
    const key = pathname.replace(/^\/(en|de|vi)(\/|$)/, '/');
    type MenuItem = Required<MenuProps>['items'][number];

    const items: MenuItem[] = [
        {
            key: Path.HOME,
            label: <NavigationLink href={Path.HOME}>Home</NavigationLink>,
            icon: <HomeOutlined />,
        },
        {
            key: Path.TEMPLATE,
            label: <NavigationLink href={Path.TEMPLATE}>Template</NavigationLink>,
            icon: <VideoCameraOutlined />,
        },
        
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
    };


    const [collapsed, setCollapsed] = useState(true)

    return <>
        <Layout className="h-screen">
            <Content className="h-full overflow-auto">
                <div className="">
                    {children}
                </div>
            </Content>
        </Layout>
    </>
}

export default CommonLayout
