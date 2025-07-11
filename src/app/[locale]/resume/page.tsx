import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function ResumePage() {
  const t = useTranslations('common');
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        {t('resume')}
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        {t('resumeDescription')}
      </Typography>
    </Box>
  );
}
