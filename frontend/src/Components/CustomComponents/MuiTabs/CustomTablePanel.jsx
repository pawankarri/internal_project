import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { SerchingComponetsstyle } from '../../stylecomponent/SerchingComponetsStyle';

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
export function a11yProps(index) {
  
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



export function CustomTabPanel({value,index,children}) {
  
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {value === index && (
          <Box sx={{height:"67vh"}}>
            {children}
          </Box>
        )}
      </div>
    );
  }