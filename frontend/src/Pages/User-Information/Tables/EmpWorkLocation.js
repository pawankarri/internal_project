import * as React from 'react';

import { 
  Box,
  Grid, 
   Modal, 
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
import { getEmployeeWorkLocationTable } from '../../../Services/employee-service/EmployeeService';
import { toast } from 'react-toastify'
import Loading from "../../../Components/LoadingComponent/Loading";
import { useState } from 'react';
import moment from 'moment';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { WorkLocationNew } from '../WorkInfoModals/WorkLocationNew';
import { NoAuth } from '../../../Components/HelperComponent/NoAuth';
import { hasAuthority } from '../../../Services/AccessLevel/AccessLevelService';
import { GlobalButton } from '../../../Components/stylecomponent/GlobalButton';
import { UserInformationTableStyle } from './UserInformationTableStyle';
import { DataGridRowAndcolumnHeight, muiDatagrid_headerclassName } from '../../../Components/stylecomponent/forFirstDiv';
import { SerchingComponetsstyle } from '../../../Components/stylecomponent/SerchingComponetsStyle';
import CustomDatagrid from '../../../Components/CustomComponents/DataGrid/CustomDatagrid';
import CustomModal from '../../../Components/CustomComponents/CustomModals/CustomModal';





function getrowId(row){

  return row.empWorkLocationId
}


export const  EMPLOYEE_WORKING_LOCATION_TABLE_TITLE= "WORKING_LOCATION_TABLE_1"


export default function EmpWorkLocation() {
  const [reportm,setReportm]= React.useState(false);
//--------------------------------------
//empid getting
let empId3=localStorage.getItem("id")
const[empId2,setEmpId2]=useState(empId3)
//------------------------------------------
const[tableData,setTableData]=useState([])
const[manager2,setmanager2]=useState([])
const handleRow=(params)=>{
  setTableData(params.row)
  setmanager2(params.row)
}

  const [workLocationTable,setworkLocationTable]=React.useState([])
   const navigate=useNavigate()
  const[isLoading,setIsLoading]=useState(true)


  React.useEffect(()=>{

    getEmployeeWorkLocationTable().then((res)=>{
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
    
  },[reportm])

   //modal for reporting manager updation
   const [profileData, setProfileData] = useState({});
   
const [reportingManagers, setReportingManagers] = useState({})
   const [updateEmployee, setUpdateEmployee] = useState({
    "empId": "",
    "empName": "",
    "emailId": "",
    "contactNo": "",
    "dateOfJoining": ""
})
const [openModal, setOpenModal] = React.useState(false);
const handleModalOpen = () => setOpenModal(true);
const handleModalClose = () => setOpenModal(false);

const [openModal2, setOpenModal2] = React.useState(false);
const handleModal2Open = () => {
    setUpdateEmployee({
        "empId": profileData?.empId,
        "empName": profileData?.empName,
        "emailId": profileData?.emailId,
        "contactNo": profileData?.contactNo,
        "dateOfJoining": profileData?.dateOfJoining
    })
    setOpenModal2(true);
};
const handleModal2Close = () => {
    setOpenModal2(false);
};

 
   const handleRmOpen =() => setReportm(true);
   const handleRmClose = () => setReportm(false);
   const button1={backgroundColor:"#2196F3",color:"#FFFFFF",borderRadius:"20px",marginBottom:"20px",width:"22%"}
     const textfield1={width: 400}



//backbutton
const backbutton=useNavigate()
//-----------------------
const columns = [

 
  { 
    field: 'startDate',
   headerName: 'Start Date',
   minWidth:120,
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
    field:'modifiedByWithName',
   headerName: 'Modified By', 
   minWidth: 220,
   flex:2,
   headerClassName:muiDatagrid_headerclassName

  },
  {
    field: 'eidt',
    headerName: 'Edit',
    minWidth: 100,
    flex:2,

    headerClassName: muiDatagrid_headerclassName,
    renderCell: (params) => {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-start'
            }}>
                <IconButton variant="contained" color='error'
                    // onClick={(e) => onButtonClick(e, params.row, 'delete')}
                >
             
                    <EditOutlinedIcon onClick={handleRmOpen} color='secondary' sx={{marginRight:"39px"}}/>
                  
            

                </IconButton >

            </Box>
        );
    }
}
];

  return hasAuthority(EMPLOYEE_WORKING_LOCATION_TABLE_TITLE)? (
    isLoading ? <Loading/>:
    <Box  style={SerchingComponetsstyle.firstBox}>
      <Box  style={SerchingComponetsstyle.SecondBox}>
        
                  <Typography variant='h6' style={SerchingComponetsstyle.typographystyle}>WORK LOCATION</Typography>
                  <Grid style={{justifyContent:"center"}}>
                  <Button variant='outlined' 
                  startIcon={<LocalAirportIcon/>} onClick={()=>{navigate("/user/workinfo")}} >
                            CREATE WORK
                </Button>
                </Grid>
                 </Box>
                 
                 
 <GlobalButton.GlobalDivider1></GlobalButton.GlobalDivider1>

             
                 
                <Box  style={SerchingComponetsstyle.DatagridBoxStyle}>

                <CustomDatagrid  rows={workLocationTable} columns={columns}  rowclickhandle={handleRow}  rowId={getrowId}/>
                 </Box>



 <CustomModal modalopen={reportm}  modalclose={()=>{setReportm(!reportm)}} children={<WorkLocationNew empId={empId2} manager={manager2} onClose1={()=>{setReportm(false)}} />} />

    </Box>
  ):<NoAuth></NoAuth>
}