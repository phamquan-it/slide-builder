'use client';

import 'antd/dist/reset.css';
import '../../app/globals.css';
import 'nprogress/nprogress.css';
import '@ant-design/v5-patch-for-react-19';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ConfigProvider } from 'antd';
import NProgress from 'nprogress';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import CommonLayout from '@/components/layouts/CommonLayout';
import EmptyLayout from '@/components/layouts/EmptyLayout';
NProgress.configure({ showSpinner: false }); // Disable the spinner
export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // NProgress loading bar on route change
    useEffect(() => {
        NProgress.start();
        const timeout = setTimeout(() => {
            NProgress.done();
        }, 300);
        return () => clearTimeout(timeout);
    }, [pathname]);

    const AppLayout = !pathname?.includes('/dashboard') ? CommonLayout : EmptyLayout;

    return (
        <ConfigProvider
            theme={{
                components: {
                    Layout: {
                        headerBg: 'white',
                        siderBg: 'white',
                        headerPadding: 0,
                        bodyBg: 'white',
                    },
                },
            }}
        >
            <AntdRegistry>
                <AppLayout>{children}</AppLayout>
            </AntdRegistry>
        </ConfigProvider>
    );
}

