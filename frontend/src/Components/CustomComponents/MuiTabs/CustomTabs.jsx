import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


export default function CustomTabs({ value,handleonchange,children,customTablePanel}) {


  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleonchange} aria-label="basic tabs example">
          {children}
        </Tabs>
      </Box>
     {customTablePanel}
    </Box>
  );
}