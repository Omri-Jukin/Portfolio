import React from 'react';
import { Box, Typography } from '@mui/material';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';
import { getMessages } from 'next-intl/server';
import { getDictionary } from '@/hooks/getDictionary';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const locale = await getLocale();
  const messages = await getMessages();
  const dictionary = await getDictionary(locale, messages);
  return {
    title: t('about.title'),
    description: t('about.description'),
  };
}


export default function AboutPage() {
  const t = useTranslations();
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        {t('about.title')}
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        {t('about.description')}
      </Typography>
    </Box>
  );
}
