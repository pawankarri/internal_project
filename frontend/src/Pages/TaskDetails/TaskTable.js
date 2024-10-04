import { Box, FormControlLabel, FormGroup } from '@mui/material';
import React, { useEffect, useState } from 'react'
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { DataGrid } from '@mui/x-data-grid';
import {  useNavigate } from 'react-router';
import moment from 'moment';
import { SerchingComponetsstyle } from '../../Components/stylecomponent/SerchingComponetsStyle';
import { CustomToolBar } from '../../Components/DataGridDataDownload/CustomToolBar';
import { DataGridRowAndcolumnHeight, muiDatagrid_headerclassName } from '../../Components/stylecomponent/forFirstDiv';
import CustomDatagrid from '../../Components/CustomComponents/DataGrid/CustomDatagrid';

//icon button color changer

function getrowId(row){

  return row.taskDetailsId
  }


const verfiedIcon=(data)=>{
  return data==null? <TaskAltIcon  style={{backgroundColor:"red",color:"white",borderRadius:"50%"}}/> : 
  <TaskAltIcon  style={{backgroundColor:"green",color:"white",borderRadius:"50%"}}/>
    }

  const columns = [
 
    { 
      field: 'empId',
     headerName: 'Employee Id', 
     minWidth: 80,
      flex:2,
     headerClassName:muiDatagrid_headerclassName
   
    },
    { 
      field: 'taskDetail',
     headerName: 'Task Details',
     minWidth: 120,
      flex:2,
     headerClassName:muiDatagrid_headerclassName
     
    },
   
    { 
      field: 'status',
     headerName: 'Status', 
     minWidth: 90,
      flex:2,
     headerClassName:muiDatagrid_headerclassName,
     renderCell: (params) => {
      if (params.row.status==="Yes"){
        return "Completed"
      }
      return "Not Completed"
  
     }
  
    },
    { 
      field: 'reason',
     headerName: 'Reason', 
     minWidth: 100,
      flex:2,
     headerClassName:muiDatagrid_headerclassName
  
    },
    { 
        field: 'assignedDate',
       headerName: 'Assigned Date', 
       minWidth: 120,
        flex:2,
       headerClassName:muiDatagrid_headerclassName,
       valueFormatter: params => 
       moment(params?.value).format("DD/MM/YYYY"),   
      },
    { 
        field: 'statusReportDate',
       headerName: 'Status Reporting Date', 
       minWidth: 120,
        flex:2,
       headerClassName:muiDatagrid_headerclassName,
       valueFormatter: params => 
       moment(params?.value).format("DD/MM/YYYY"),   
      },
   
      { 
        field: 'team',
       headerName: 'Team', 
       minWidth: 95,
        flex:2,
       headerClassName:muiDatagrid_headerclassName
       
      },
      { 
        field: 'assignedByName',
       headerName: 'AssignedBy', 
       minWidth: 230,
        flex:3,
       headerClassName:muiDatagrid_headerclassName
       
      },
    
    {
      field: 'verifiedBy',
      headerName: 'Verified',
      minWidth: 80,
      flex:1.5,
      align:'center',
      headerClassName: muiDatagrid_headerclassName,
      renderCell: (params) => {
          return (
            <FormGroup>
            <FormControlLabel required control={verfiedIcon(params.value)}  />
           </FormGroup>
           );
         
      }
  }
  ];


 
  



export const TaskTable = (props) => {
  

  const navigate=useNavigate()
 let data=props.allTask
const [taskTable,setTaskTable]=useState([])


useEffect(()=>{setTaskTable(data)},[data])



const handleRowClick = (params) => {
  // const employeeDetailsUrl=`../user/task-details?row=${params.row}`;
  //  window.open(employeeDetailsUrl,'_blank');
navigate(`../task-details`,{state:params.row})

};


    return (
       
        <Box style={SerchingComponetsstyle.DatagridBoxStyle}>




<CustomDatagrid  
rows={taskTable} columns={columns}  rowclickhandle={handleRowClick}  rowId={getrowId} 
CustomToolBar={CustomToolBar}
/>


       </Box>
     
    )
}


