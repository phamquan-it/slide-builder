import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

type Props = {
    children?: ReactNode;
    title: ReactNode;
};

export default function PageLayout({ children, title }: Props) {
    const t = useTranslations('PageLayout');
    return (
        <div className="">
            <h1>
                {title}
            </h1>
            {children}
        </div>
    );
}
