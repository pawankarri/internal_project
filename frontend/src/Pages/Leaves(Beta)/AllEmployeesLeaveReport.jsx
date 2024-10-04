import * as React from 'react';
import { 
  Box,
  Grid, 
   Typography,
        } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { Button ,TextField} from '@mui/material';
import {  useNavigate } from 'react-router';
import { toast } from 'react-toastify'
import Loading from "../../Components/LoadingComponent/Loading";
import { useState } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { NoAuth } from '../../Components/HelperComponent/NoAuth';
import { hasAuthority } from '../../Services/AccessLevel/AccessLevelService';
import { LeaveServices } from '../../Services/Leave-Service/LeaveServices';
import { GlobalButton } from '../../Components/stylecomponent/GlobalButton';
import SearchIcon from '@mui/icons-material/Search';
import {MenuItem} from '@mui/material';
import {InputLabel} from '@mui/material';
import {FormControl} from '@mui/material';
import {Select} from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import dayjs from 'dayjs';
import { SerchingComponetsstyle } from '../../Components/stylecomponent/SerchingComponetsStyle';
import { CustomToolBar } from '../../Components/DataGridDataDownload/CustomToolBar';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { LeavesBetaServices } from '../../Services/LeavesBeta/LeavesBetaServices';
import { muiDatagrid_headerclassName } from '../../Components/stylecomponent/forFirstDiv';
import CustomDatagrid from '../../Components/CustomComponents/DataGrid/CustomDatagrid';
export const LEAVES_BETA_ALL_EMPLOYEES_LEAVES_REPORT='LEAVES_BETA_ALL_EMPLOYEES_LEAVES_REPORT'
const handleViewClick=(params)=>{
    const employeeDetailsUrl=`../user/leave-status-report-after-row-click?empId=${params?.row?.empId}&leavecount=${params?.row?.leavesCount}`;
  window.open(employeeDetailsUrl,'_blank');
}
const columns = [
  { 
    field: 'empId',
   headerName: 'Employee Id', 
   minWidth: 80,
    flex:1.5,
   headerClassName:muiDatagrid_headerclassName
 
  },
  { 
    field: 'empName',
   headerName: 'Employee Name', 
   minWidth: 210,
    flex:3,
   headerClassName:muiDatagrid_headerclassName
 
  },
  
 
  { 
    field: 'totalLeavesAsPerband',
   headerName: ' Total Leaves', 
   minWidth: 90,
    flex:1.5,
   headerClassName:muiDatagrid_headerclassName,
 
  },

  { 
    field: 'leavesCount',
   headerName: 'Spent Leaves', 
   minWidth: 80,
    flex:1.5,
   headerClassName:muiDatagrid_headerclassName
 
  },
  // { 
  //   field: 'absentCount',
  //  headerName: 'Absent Count', 
  //  minWidth: 90,
  //   flex:1.5,
  //  headerClassName:muiDatagrid_headerclassName
 
  // },
  {
    field: 'view',
    headerName: 'View',
    minWidth: 100,
    flex: 1,
    headerClassName: muiDatagrid_headerclassName,
    renderCell: (params) =>{
    
   return  (
      <Button onClick={getrowId}>
       <PreviewIcon color='secondary' sx={{ marginRight: "39px" }} />
      </Button>
      
   )
  }
},
 

];

function getrowId(row){

  return row.empId
  }

export default function AllEmployeesLeaveReport() {

 const [leaveData,setLeaveData]=useState([])
 const[isLoading,setIsLoading]=useState(false)
 const[reload,setreload]=useState(false)
  
let year=dayjs().format("YYYY")
////////////////////////////--for back button--//////////////////////////////////////////






  function fetchleavesData(){
    setIsLoading(true)
    LeavesBetaServices.getAllEmployeesYearlyLeavesReport(year).then((res)=>{
      console.log(res);
        if(res.status===200){
          setIsLoading(false)
        setLeaveData(res.result)
        }
        else{
          setIsLoading(false)
          toast.error(res.message, {
            position: toast.POSITION.TOP_RIGHT
        })
        }
    
      }).catch((err)=>{
    
      setIsLoading(false)
      toast.error(err.message, {
        position: toast.POSITION.TOP_RIGHT
    })
      })

  }
  

const [load,setload]=useState(false)
  React.useEffect(()=>{
fetchleavesData()
    setload(false)
    
  },[load,reload])




  return hasAuthority(LEAVES_BETA_ALL_EMPLOYEES_LEAVES_REPORT)?( isLoading?<Loading></Loading>:
    
    <Box sx={SerchingComponetsstyle.firstBox}>

         <Typography variant='h6' style={SerchingComponetsstyle.typographystyle}>EMPLOYEES LEAVE REPORT</Typography>
     
   <GlobalButton.GlobalDivider></GlobalButton.GlobalDivider>



    <Box style={SerchingComponetsstyle.DatagridBoxStyle}>

<CustomDatagrid rows={leaveData} columns={columns} rowId={getrowId} rowclickhandle={handleViewClick} CustomToolBar={CustomToolBar}></CustomDatagrid>

   </Box>
   </Box>
  ):null
}

