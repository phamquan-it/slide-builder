'use client';

import clsx from 'clsx';
import {ComponentProps} from 'react';
import {usePathname} from '@/i18n/navigation'; // next-intl version
import {Link} from '@/i18n/navigation';

export default function NavigationLink({
  href,
  ...rest
}: ComponentProps<typeof Link>) {
  const currentPath = usePathname(); // gets full locale-aware pathname (e.g. /en/livestream/settings)
  const isActive = currentPath === href;

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'transition-colors',
        isActive ? 'text-blue-500 hover:text-blue-400' : 'text-gray-400 hover:text-gray-200'
      )}
      href={href}
      {...rest}
    />
  );
}

