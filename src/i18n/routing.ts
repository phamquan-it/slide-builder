import { Path } from '@/enums/path';
import { defineRouting } from 'next-intl/routing';

const locales = ['en', 'de'] as const;
const defaultLocale = 'en' as const;

// Dynamically generate pathnames
const pathnames = Object.fromEntries(
    Object.values(Path).map((path) => [path, path])
);

export const routing = defineRouting({
    locales,
    defaultLocale,
    pathnames
});

