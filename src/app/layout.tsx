//"use client";
//
//import 'antd/dist/reset.css';
//import './globals.css';
//import 'nprogress/nprogress.css'; // NProgress styles
//import '@ant-design/v5-patch-for-react-19';
//
//import { AntdRegistry } from '@ant-design/nextjs-registry';
//import CommonLayout from '@/components/layouts/CommonLayout';
//import EmptyLayout from '@/components/layouts/EmptyLayout';
//
//import { ConfigProvider, unstableSetRender } from 'antd';
//import { createRoot } from 'react-dom/client';
//import { useEffect } from 'react';
//import { usePathname } from 'next/navigation';
//
//import NProgress from 'nprogress';
//
//// Optional: Customize NProgress settings
//NProgress.configure({
//  showSpinner: false,
//  trickleSpeed: 100,
//  easing: 'ease',
//  speed: 300,
//});
//
//unstableSetRender((node, container: any) => {
//  container._reactRoot ||= createRoot(container);
//  const root = container._reactRoot;
//  root.render(node);
//  return async () => {
//    await new Promise((resolve) => setTimeout(resolve, 0));
//    root.unmount();
//  };
//});
//
//export default function RootLayout({ children }: { children: React.ReactNode }) {
//  const pathname = usePathname();
//
//  useEffect(() => {
//    NProgress.start();
//
//    const timeout = setTimeout(() => {
//      NProgress.done();
//    }, 300); // adjust to match perceived load time
//
//    return () => clearTimeout(timeout);
//  }, [pathname]);
//
//  const AppLayout = !pathname?.includes("/dashboard") ? CommonLayout : EmptyLayout;
//
//  return (
//    <html lang="en" suppressHydrationWarning>
//      <body suppressHydrationWarning>
//        <ConfigProvider
//          theme={{
//            components: {
//              Layout: {
//                headerBg: 'white',
//                siderBg: 'white',
//                headerPadding: 0,
//                bodyBg: 'white',
//              },
//            },
//          }}
//        >
//          <AntdRegistry>
//            <AppLayout>{children}</AppLayout>
//          </AntdRegistry>
//        </ConfigProvider>
//      </body>
//    </html>
//  );
//}
import {ReactNode} from 'react';

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({children}: Props) {
  return children;
}
