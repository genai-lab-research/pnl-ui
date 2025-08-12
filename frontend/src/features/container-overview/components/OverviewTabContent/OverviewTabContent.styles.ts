import { SxProps, Theme } from '@mui/material/styles';

export const overviewTabContentStyles = {
  root: {
    padding: 0,
    '& .MuiGrid-item': {
      display: 'flex',
      flexDirection: 'column',
    },
  } as SxProps<Theme>,
};
