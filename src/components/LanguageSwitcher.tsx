"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { locales } from '../../i18n';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('language');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitch = (targetLocale: string) => {
    if (targetLocale !== locale) {
      const segments = pathname.split('/');
      if (locales.includes(segments[1] as typeof locales[number])) {
        segments[1] = targetLocale;
      } else {
        segments.splice(1, 0, targetLocale);
      }
      let newPath = segments.join('/');
      if (!newPath.startsWith('/')) newPath = '/' + newPath;
      newPath = newPath.replace(/\/+/g, '/');
      router.replace(newPath);
    }
  };

  return (
    <Box sx={{ display: 'inline-block', ml: 1, verticalAlign: 'top' }}>
      <Button onClick={handleClick}>{t(locale)}</Button>
        <Menu open={open} onClose={handleClose} anchorEl={anchorEl} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          {locales.map((loc) => (
            <MenuItem key={loc} onClick={() => handleSwitch(loc)}>
              {t(loc)}
            </MenuItem>
          ))}
        </Menu>
    </Box>
  );
} 