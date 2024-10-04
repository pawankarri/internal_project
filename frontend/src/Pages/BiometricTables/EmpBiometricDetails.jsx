import { Autocomplete, Box, Button, Container, Divider, Grid, IconButton, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import Loading from '../../Components/LoadingComponent/Loading'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { getAllEmployees } from '../../Services/employee-service/EmployeeService'
import { useNavigate } from 'react-router';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import AutoEmpSearch from '../../Services/AutoEmpSearch/AutoEmpSearch';
import { taskService } from '../../Services/Employee-Task-Service/taskService';
import { toast } from 'react-toastify';
import BiometricTable from './BiometricTable';
import { BiometricServiceModule } from '../../Services/BiometricService/BiometricServiceModule';
import PreviewIcon from '@mui/icons-material/Preview';
import { DataGrid } from '@mui/x-data-grid';
import EmpBiometricTable from './EmpBiometricTable';
import { NoAuth } from '../../Components/HelperComponent/NoAuth';
import { hasAuthority } from '../../Services/AccessLevel/AccessLevelService';
import { SerchingComponetsstyle } from '../../Components/stylecomponent/SerchingComponetsStyle';
import { GlobalButton } from '../../Components/stylecomponent/GlobalButton';

export const  EMPLOYEE_LEVEL_FIRST_BIOMETRIC_TABLE_TITLE= "EMPLOYEE_LEVEL_FIRST_BIOMETRIC_TABLE"



export const EmpBiometricDetails = () => {

//----------
    let emp_id=localStorage.getItem("id")


const[bioDetails,setBioDetails]=useState([])


  //------------------------------fetching data with start date end date and emp id -------------------
  async  function fetchViaParticularEmpIdData(){
setIsLoading(true)
    await BiometricServiceModule.getAllBiometricDataViaEmpIdStartDateEndDate(employee.empId,employee.fromDate,employee.toDate).then((res)=>{
     
       if(res.status===200){
        setIsLoading(false)
         setBioDetails(res.result)
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




//--------------
  
  const textfield1 = { width: 400 }
  const backbutton=useNavigate()
const[isLoading,setIsLoading]=useState(true)
const [employee, setEmployee] = useState({
  "fromDate":"2023-01-01",
  "toDate":dayjs().format("YYYY-MM-DD"),
  "empId": emp_id
});
  
const [hidden,sethidden]=useState(false)

const navigate=useNavigate()
//--------------------fetching all employee biometric -------------------------------------------


useEffect(()=>{ 
  fetchViaParticularEmpIdData()
sethidden(false)
},[hidden])


const handleSerchData=(e)=>{
    e.preventDefault()
 

  if(employee.fromDate.length>0 && employee.toDate.length>0  && employee.empId!==null){
    fetchViaParticularEmpIdData()
  }

  else{
    toast.error("Please enter start date, end Date ", {
      position: toast.POSITION.TOP_RIGHT
  })
  }
   }
    
   const handleRowClick=(params)=>{
    setEmployee({...employee,empId:params.row.emp_id})

   }




    return hasAuthority(EMPLOYEE_LEVEL_FIRST_BIOMETRIC_TABLE_TITLE)? (
      isLoading?<Loading></Loading>:
        <Box sx={SerchingComponetsstyle.firstBox}>
             
                 <Box sx={SerchingComponetsstyle.SecondBox}>
             <Typography style={SerchingComponetsstyle.typographystyle}>EMPLOYEE BIO-METRIC DETAILS </Typography>

             <Grid style={{justifyContent:"center"}}>
                <Button variant='outlined' 
                  onClick={()=>{sethidden(true);setEmployee({...employee, "fromDate":"2023-01-01",
                  "toDate":dayjs().format("YYYY-MM-DD"),
                  "empId": emp_id})  
                  backbutton(`../empbiometric`)}}
                 startIcon={<ArrowBackIosNewIcon/>}>
            back
                </Button>
                </Grid>
                 </Box>

                 
      <GlobalButton.GlobalDivider></GlobalButton.GlobalDivider>
                
 {/*--------------InputFields:-----------FromDate---ToDate---EmpId-------------------------- */}



<form onSubmit={handleSerchData}> 
  <Box
   
   sx={SerchingComponetsstyle.Thirdbox}
    >
      <Grid container  sx={SerchingComponetsstyle.gridContainerStyle}>
      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}  >

<TextField size='small' InputLabelProps={{ shrink: true }} 
 style={SerchingComponetsstyle.textFieldStyle} type='date' 
 value={employee.fromDate}
  onChange={(e)=>{setEmployee({ ...employee,fromDate:e.target.value})}} 
  label="From Date"></TextField>
           
        </Grid >
        <Grid item xs={3} sm={3} md={3} lg={3} xl={3} >

<TextField size='small' InputLabelProps={{ shrink: true }}  style={SerchingComponetsstyle.textFieldStyle} type='date' value={employee.toDate} 
onChange={(e)=>{setEmployee({ ...employee,toDate:e.target.value})}} label="To Date"></TextField>
            
        </Grid >


       
         <Grid item xs={3} sm={3} md={3}  lg={3} xl={3} style={SerchingComponetsstyle.griditemserchstyle}>
            <Button value="click" variant='outlined' type='submit'
             sx={SerchingComponetsstyle.searchbuttonstyle} endIcon={<SearchIcon/>}>
            search
                </Button>
                </Grid> 
                 
      </Grid>
      
      
      </Box>
      

      </form>

    <GlobalButton.GlobalDivider1></GlobalButton.GlobalDivider1>
{/*-----------------------Tabel:---------------------------- */} 
    <Box sx={SerchingComponetsstyle.DatagridBoxStyle}>
    <EmpBiometricTable allDetails={bioDetails}/>
    </Box>

  

        </Box>
    ):<NoAuth></NoAuth>
}

 