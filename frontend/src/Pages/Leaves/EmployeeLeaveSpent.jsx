import * as React from 'react';
// import './em.css'
import { 
  Box,
  Grid, 
   Paper,
   Typography,
        } from "@mui/material";
import {FcBusinessman} from "react-icons/fc";
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Navigate, useLocation, useNavigate } from 'react-router';
import {Divider} from '@mui/material';
import {Container} from '@mui/material';
import Person4Icon from '@mui/icons-material/Person4';
import {IconButton} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { getReportingManagerTable } from '../../Services/employee-service/EmployeeService';
import { toast } from 'react-toastify'
import Loading from "../../Components/LoadingComponent/Loading";
import { useState } from 'react';
import moment from 'moment';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import PreviewIcon from '@mui/icons-material/Preview';
import { NoAuth } from '../../Components/HelperComponent/NoAuth';
import { hasAuthority } from '../../Services/AccessLevel/AccessLevelService';
import { LeaveServices } from '../../Services/Leave-Service/LeaveServices';
import { GlobalButton } from '../../Components/stylecomponent/GlobalButton';
import { DataGridRowAndcolumnHeight, muiDatagrid_headerclassName } from '../../Components/stylecomponent/forFirstDiv';
import { SerchingComponetsstyle } from '../../Components/stylecomponent/SerchingComponetsStyle';
import CustomDatagrid from '../../Components/CustomComponents/DataGrid/CustomDatagrid';



function getIdWithName(params) {
  return params.row?.modifiedBy+ " - "+params.row?.modifiedByName
}


function getrowId(row){

  return row.leaveStatusId
  }

export const EMPLOYEE_LEAVES_SPENT_PAGE_TITLE=" EMPLOYEE_LEAVES_SPENT" 

export default function EmployeeLeaveSpent(props) {

  const {state}=useLocation(props.state)

const[empId,setEmpId]=useState(state)
const[load,setload]=useState(false)
const [empname,setempname]=useState()
const [totalLeavesAsPerBand,settotalLeavesAsPerBand]=useState()
const [leavecount,setleavecount]=useState(0)
const [absentcount,setabsentcount]=useState(0)



  const [biometricTable1,setBiometricTable1]=React.useState([])
  const navigate=useNavigate()
  const[isLoading,setIsLoading]=useState(false)

  function fetchleavesData1(){
    setIsLoading(true)
    LeaveServices.EmployeeLeavesSpent(empId).then((res)=>{
        if(res.status===200){
          setIsLoading(false)
          if(res.result.length==0){
            toast.info("No leaves data associated with this employee Id " +empId+"-"+res.empName, {
              position: toast.POSITION.TOP_CENTER
          })

          }
        setBiometricTable1(res.result)
        setempname(res.empName)
        settotalLeavesAsPerBand(res.totalLeavesAsPerBand)

        for(let i=0;i<res.result.length;i++){
          let abcount=0
          let lecount=0
        res.result.filter((leave)=>{
         
          if(leave.estatus==="A"){
          abcount++
          }
          else if(leave.estatus==="L"){
            lecount++
          }
        })
        setabsentcount(abcount)
        setleavecount(lecount)
      }

        }
        else{
          setIsLoading(false)
          console.log(res)
          toast.error(res.message, {
            position: toast.POSITION.TOP_RIGHT
        })
        }
    
      }).catch((err)=>{
    console.log(err);
      setIsLoading(false)
      toast.error(err.message, {
        position: toast.POSITION.TOP_RIGHT
    })
      })

  }




  function fetchleavesData(){
    setIsLoading(true)
    LeaveServices.EmployeeLeavesSpent(localStorage.getItem("id")).then((res)=>{
        if(res.status===200){
          setIsLoading(false)
          if(res.result.length==0){
            toast.info("No leaves data associated with this employee Id " +localStorage.getItem("id")+"-"+res.empName, {
              position: toast.POSITION.TOP_CENTER
          })

          }
        setBiometricTable1(res.result)
        setempname(res.empName)
        settotalLeavesAsPerBand(res.totalLeavesAsPerBand)

        for(let i=0;i<res.result.length;i++){
          let abcount=0
          let lecount=0
        res.result.filter((leave)=>{
         
          if(leave.estatus==="A"){
          abcount++
          }
          else if(leave.estatus==="L"){
            lecount++
          }
        })
        setabsentcount(abcount)
        setleavecount(lecount)
      }

        }
        else{
          setIsLoading(false)
          console.log(res)
          toast.error(res.message, {
            position: toast.POSITION.TOP_RIGHT
        })
        }
    
      }).catch((err)=>{
        console.log(err);
    
      setIsLoading(false)
      toast.error(err.message, {
        position: toast.POSITION.TOP_RIGHT
    })
      })

  }


  React.useEffect(()=>{
   
if(empId !==null){
  fetchleavesData1()
}
else{
  fetchleavesData()
}
 
    
  },[])

  const columns = [
    { 
      field: 'empId',
     headerName: 'Employee Name', 
     minWidth: 210,
      flex:3,
     headerClassName:muiDatagrid_headerclassName,
     renderCell: (params)=>{
      
      return params?.value+" -"+empname 
       
     }
   
    },
    { 
      field: 'leaveDate',
     headerName: 'Leave Date', 
     minWidth: 125,
      flex:2.5,
     headerClassName:muiDatagrid_headerclassName,
     valueFormatter: params => 
     {
      let biometricDate=""
      if(params?.value!==null){
       biometricDate=moment(params?.value).format("DD/MM/YYYY")
      return biometricDate
      }
   else{
     return null
   }
     }
   
    },
   
    { 
      field: 'estatus',
     headerName: 'Leave Status', 
     minWidth: 100,
      flex:2,
      align:"center",
     headerClassName:muiDatagrid_headerclassName
   
    },
    { 
      field: 'modifiedbywithname',
     headerName: 'Modified By', 
     minWidth: 210,
      flex:3,
      headerClassName:muiDatagrid_headerclassName,
      valueGetter: getIdWithName,
    },  
   
  
  ];
  

  const history=useNavigate()
  const handleGoBack = () =>{
   history(-1);
 };



  return hasAuthority(EMPLOYEE_LEAVES_SPENT_PAGE_TITLE)? 
  ( isLoading?<Loading></Loading>:
 
    <Box sx={SerchingComponetsstyle.firstBox}>

<Box sx={SerchingComponetsstyle.SecondBox}>
         <Typography style={SerchingComponetsstyle.typographystyle} > Spent Leaves of <span style={{color:"black"}}>{empname}</span></Typography>
       
       {
        empId !==null? <Button variant='outlined'  
        onClick={handleGoBack}
        startIcon={<ArrowBackIosNewIcon/>}>
   back
       </Button> :null
       }
        
             </Box>

             
    
        
        <GlobalButton.GlobalDivider1></GlobalButton.GlobalDivider1>
    
        <Box sx={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'space-between',
            marginRight:"30px"
        }}>

        <Typography color={"secondary"} style={{marginLeft:"10px",fontSize:"16px"}}>Total Eligible Leaves: <span style={{color:"green",fontSize:"20px"}}>{totalLeavesAsPerBand}</span></Typography>

        <Typography color={"secondary"} style={{fontSize:"16px"}}>Leaves Spent: <span style={{color:"black",fontSize:"20px"}}>{leavecount}</span></Typography>
        <Typography color={"secondary"} style={{fontSize:"16px"}}>Absent Count: <span style={{color:"red",fontSize:"20px"}}>{absentcount}</span></Typography>
             </Box>

    <Box style={SerchingComponetsstyle.DatagridBoxStyle}>

    <CustomDatagrid  
rows={biometricTable1} columns={columns}    rowId={getrowId} 
/>

   </Box>
   </Box>
  ):<NoAuth></NoAuth>
}

