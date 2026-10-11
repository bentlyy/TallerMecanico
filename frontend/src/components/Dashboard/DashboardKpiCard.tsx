import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardActionArea, Stack, Typography } from '@mui/material';

interface Props {
  label: string;
  value: number;
  icon: ReactNode;
  bgcolor: string;
  color: string;
  to: string;
}

export default function DashboardKpiCard({ label, value, icon, bgcolor, color, to }: Props) {
  const navigate = useNavigate();
  return (
    <Card variant="outlined" sx={{ boxShadow: 'none', borderRadius: 2, height: '100%' }}>
      <CardActionArea onClick={() => navigate(to)} sx={{ height: '100%', p: 1.75 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor,
              color,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {label}
            </Typography>
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
