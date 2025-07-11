import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('common');
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        {t('contact')}
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        {t('contactDescription')}
      </Typography>
    </Box>
  );
}
