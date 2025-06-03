import { notFound } from 'next/navigation';
import { Locale, hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import './styles.css';
import LayoutClient from '@/components/layouts/ClientLayout';
import StoreProvider from '../StoreProvider';

type Props = {
    children: ReactNode;
    params: Promise<{ locale: Locale }>;
};

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: Omit<Props, 'children'>) {
    const { locale } = await props.params;

    const t = await getTranslations({ locale, namespace: 'LocaleLayout' });

    return {
        title: t('title')
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    // Enable static rendering
    setRequestLocale(locale);
    return (
        <html lang={locale}>
            <body suppressHydrationWarning>
                <StoreProvider count={10}>
                    <NextIntlClientProvider>
                        <LayoutClient>
                            {children}
                        </LayoutClient>
                    </NextIntlClientProvider>
                </StoreProvider>
            </body>
        </html>
    );
}
