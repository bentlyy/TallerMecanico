import { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { RANGE_PRESETS, type RangePreset } from '../../utils/pdfExport';

interface Props {
  onExport: (preset: RangePreset) => void;
  label?: string;
}

export default function PdfExportMenu({ onExport, label = 'Exportar PDF' }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        startIcon={<PictureAsPdfIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {label}
      </Button>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        {RANGE_PRESETS.map((preset) => (
          <MenuItem
            key={preset.value}
            onClick={() => {
              setAnchorEl(null);
              onExport(preset.value);
            }}
          >
            <ListItemIcon>
              <CalendarMonthIcon fontSize="small" />
            </ListItemIcon>
            {preset.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
