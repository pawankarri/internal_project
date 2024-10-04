import * as React from 'react';

import { 
  Box,
  Grid, 
   Paper,
        } from "@mui/material";

import LocationOnIcon from '@mui/icons-material/LocationOn';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import {Button} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {Divider} from '@mui/material';
import {Typography} from '@mui/material';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import {IconButton} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { toast } from 'react-toastify'
import Loading from "../../../Components/LoadingComponent/Loading";
import { useState } from 'react';
import moment from 'moment';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useLocation } from 'react-router';
import { EmployeeAccessLevelService } from '../../../Services/Employee-Access-Level-service/EmployeeAccessService';
import { WorkLocationModal } from '../UpdateModals/WorkLocationModal';
import {Modal} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { GlobalButton } from '../../../Components/stylecomponent/GlobalButton';
import { NoAuth } from '../../../Components/HelperComponent/NoAuth';
import { hasAuthority } from '../../../Services/AccessLevel/AccessLevelService';
import { AccessLevelTableStyle } from './AccessLevelTableStyle';
import { DataGridRowAndcolumnHeight, muiDatagrid_headerclassName } from '../../../Components/stylecomponent/forFirstDiv';
import { SerchingComponetsstyle } from '../../../Components/stylecomponent/SerchingComponetsStyle';
import CustomDatagrid from '../../../Components/CustomComponents/DataGrid/CustomDatagrid';
import CustomModal from '../../../Components/CustomComponents/CustomModals/CustomModal';


export const  ACCESS_LEVEL_WORKING_LOCATION_TABLE_TITLE= "WORKING_LOCATION_TABLE"

function getrowId(row){

  return row.empWorkLocationId
}



export default function EmpWorkLocationFromProfile(props) {

  const [reportm,setReportm]=useState(false)

  const handleRmOpen=()=>{
    setReportm(true)
  }


  const[working,setWorking]=useState([])
  const ManagerRowHandler=(params)=>{
    setWorking(params.row)
  }







  const columns = [
    {field: 'empId',
    headerName: 'Employee Id', 
    minWidth: 90,
    flex:1.5,
    headerClassName:muiDatagrid_headerclassName,
    renderCell: (params) => {
      return empId
    }
 
   },
   
    { 
      field: 'startDate',
     headerName: 'Start Date',
     minWidth: 120,
     flex:2,
     headerClassName:muiDatagrid_headerclassName,
     valueFormatter: params => 
     moment(params?.value).format("DD/MM/YYYY"),
     
    },
    { 
      field: 'endDate',
     headerName: 'End Date', 
     minWidth: 120,
     flex:2,
     headerClassName:muiDatagrid_headerclassName,
     valueFormatter: params => 
     {
      let enddate=""
      if(params?.value!==null){
       enddate=moment(params?.value).format("DD/MM/YYYY")
       return enddate
      }
   else{
     return null
   }
     }
  
    },
    { 
      field: 'workingFrom',
     headerName: 'Working From', 
     minWidth: 140,
     flex:2,
     headerClassName:muiDatagrid_headerclassName
     
    },
    { 
      field: 'location',
     headerName: 'Location', 
     minWidth: 150,
     flex:2,
     headerClassName:muiDatagrid_headerclassName
     
    },
    {
      field: 'modifiedByWithName',
     headerName: 'Modified By', 
     minWidth: 220,
     flex:3,
     headerClassName:muiDatagrid_headerclassName
  
    },

    {
      field: 'edit',
      headerName: 'Update',
      minWidth: 100,
      flex:1.5,
      headerClassName: muiDatagrid_headerclassName,
      renderCell: (params) => {
          return (
              <Box sx={{
                  display: 'flex',
                  justifyContent: 'center'
              }}>
                  <IconButton variant="contained" color='error'>
                 <EditIcon onClick={handleRmOpen} color='secondary' sx={{marginRight:"39px"}}/>
                 
                 </IconButton >
  
              </Box>
          );
      }
  }


  
  ];
  



  const [workLocationTable,setworkLocationTable]=React.useState([])
   const navigate=useNavigate()
  const[isLoading,setIsLoading]=useState(true)
  const {state}=useLocation(props.state)
  const[empId,setEmpId]=useState(state.empId)

function fetchDataOfWork(empId){
  EmployeeAccessLevelService.WorkingLocationFromProfile(empId).then((res)=>{
      
    if(res.status===200 && res.statusMessage==="success"){
    
    setIsLoading(false)
    setworkLocationTable(res.result)
    
    
    }
    else{
      setIsLoading(false)
   
    }

  }).catch((err)=>{
    setIsLoading(false)
  
  })

} 


  React.useEffect(()=>{ 
    fetchDataOfWork(empId)
  },[reportm])



//backbutton
const backbutton=useNavigate()


  return hasAuthority(ACCESS_LEVEL_WORKING_LOCATION_TABLE_TITLE)? (
    isLoading ? <Loading/>:
    <Box style={SerchingComponetsstyle.firstBox}>

      <Box style={SerchingComponetsstyle.SecondBox}>
       
                  <Typography  style={SerchingComponetsstyle.typographystyle}> WORK LOCATION</Typography>
                <Box style={SerchingComponetsstyle.Thirdbox}>
                  <Button variant='outlined' 
                  startIcon={<LocalAirportIcon/>} onClick={()=>{navigate(`../access-level-working-location-creation`,{state:{"empId":empId}})}} >
                            CREATE WORK
                </Button>
                <Button variant='outlined' 
                 onClick={()=>{backbutton(`/user/${empId}`)}}
                 startIcon={<ArrowBackIosNewIcon/>}>
            back
                </Button>
                 </Box>
                 </Box>
                 <GlobalButton.GlobalDivider1></GlobalButton.GlobalDivider1>

          

                <Box style={SerchingComponetsstyle.DatagridBoxStyle}>


                <CustomDatagrid  
rows={workLocationTable} columns={columns}  rowclickhandle={ManagerRowHandler}  rowId={getrowId} 
/>

                 </Box>
 <CustomModal modalopen={reportm}  modalclose={()=>{setReportm(!reportm)}} children={ <WorkLocationModal working={working} empId={empId} onClose1={()=>{setReportm(false)}} />} />


    </Box>
  ):<NoAuth></NoAuth>
}