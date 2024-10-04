import {  Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material'
import React, {  useEffect, useState } from 'react'
import Loading from '../../Components/LoadingComponent/Loading'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useLocation, useNavigate } from 'react-router';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-toastify';
import BiometricTable from './BiometricTable';
import { BiometricServiceModule } from '../../Services/BiometricService/BiometricServiceModule';
import PreviewIcon from '@mui/icons-material/Preview';
import { DataGrid } from '@mui/x-data-grid';
import { NoAuth } from '../../Components/HelperComponent/NoAuth';
import { hasAuthority } from '../../Services/AccessLevel/AccessLevelService';
import moment from 'moment';
import { GlobalButton } from '../../Components/stylecomponent/GlobalButton';
import { SerchingComponetsstyle } from '../../Components/stylecomponent/SerchingComponetsStyle';
import { CustomToolBar } from '../../Components/DataGridDataDownload/CustomToolBar';
import { DataGridRowAndcolumnHeight, muiDatagrid_headerclassName } from '../../Components/stylecomponent/forFirstDiv';
import CustomDatagrid from '../../Components/CustomComponents/DataGrid/CustomDatagrid';

export const  ACCESS_LEVEL_FIRST_BIOMETRIC_TABLE_TITLE= "ACCESS_LEVEL_FIRST_BIOMETRIC_TABLE"


const columns = [
  { 
    field: 'empId',
   headerName: 'Employee Id', 
   minWidth: 90,
    flex:1.5,
   headerClassName:muiDatagrid_headerclassName
 
  },
  { 
    field: 'empName',
   headerName: 'Employee Name', 
   minWidth: 200,
    flex:3,
   headerClassName:muiDatagrid_headerclassName

  },
  { 
    field: 'lateCount',
   headerName: 'Late Count',
   minWidth: 80,
    flex:1.5,
   headerClassName:muiDatagrid_headerclassName
   
  },
  { 
    field: 'nonLateCount',
   headerName: 'Non Late',
   minWidth: 80,
    flex:1.5,
   headerClassName:muiDatagrid_headerclassName
   
  },
  { 
    field: 'greaterThanWrkHrsCount',
   headerName: 'Greater Working Hour',
   minWidth: 90,
    flex:1.5,
   headerClassName:muiDatagrid_headerclassName
   
  },
  {
  field: 'lessThanWrkHrsCount',
  headerName: 'Less Working Hour',
  minWidth: 90,
   flex:1.5,
  headerClassName:muiDatagrid_headerclassName
  
 },
 {
  field: 'veryLateCount',
  headerName: 'Very Late',
  minWidth: 90,
   flex:1.5,
  headerClassName:muiDatagrid_headerclassName
  
 },
 {
  field: 'avgworkingMinutes',
  headerName: 'Average Working Minute',
  minWidth: 90,
   flex:1.5,
  headerClassName:muiDatagrid_headerclassName
  
 },

  {
    field: 'View',
    headerName: 'View',
    minWidth: 90,
    flex:1.5,
    headerClassName: muiDatagrid_headerclassName,
    renderCell: (params) => {
      
      
      return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            <IconButton variant="contained" color='error'>
           <PreviewIcon  color='secondary' sx={{marginRight:"39px"}}/>
           </IconButton >

        </Box>
    );

    }
}
 
];


function getrowId(row){

  return row.empId
  }


export const BiometricSearch = (props) => {


  
  const backbutton=useNavigate()
const[isLoading,setIsLoading]=useState(false)
const [employee, setEmployee] = useState({
  "fromDate":"2023-01-01",
  "toDate":dayjs().format("YYYY-MM-DD"),
  "empId": ""
});
  
const[backButoon1,setbackButton1]=useState(false)
const[reload,setreload]=useState(false)
const handlefilter=()=>{
  setbackButton1(true)
}



const navigate=useNavigate()
//--------------------fetching all employee biometric -------------------------------------------
const[biometricTableNonLate,setBiometricTableNonLate]=useState([])
function fetchNonLateData(){
  setIsLoading(true)
  BiometricServiceModule.getAllBiometricReportNonLate(employee.fromDate,employee.toDate).then((res)=>{
      if(res.status===200){
        setIsLoading(false)
      setBiometricTableNonLate(res.result)

      if(res.result.length==0){
        toast.info("No Records Found  Between the given dates "+moment(employee.fromDate).format("DD/MM/YYYY")+"   "+moment(employee.toDate).format("DD/MM/YYYY") ,{
            position: toast.POSITION.TOP_RIGHT
        })}



      }
      else{
        setIsLoading(false)
        toast.error(res.message, {
          position: toast.POSITION.TOP_RIGHT
      })
      }
  
    }).catch((err)=>{
  
    setIsLoading(false)
    })
}


/////////////////////////////////// serching data via start date and end date is late ///////////////////////////////////////////////
function SearchIsLateData(){
  setIsLoading(true)
  BiometricServiceModule.getAllBiometricReportIsLate(employee.fromDate,employee.toDate).then((res)=>{

      if(res.status===200){
        setIsLoading(false)
        setBiometricTableNonLate(res.result)
        if(res.result.length==0){
          toast.info("No Records Found  Between the given dates "+moment(employee.fromDate).format("DD/MM/YYYY")+"   "+moment(employee.toDate).format("DD/MM/YYYY") ,{
              position: toast.POSITION.TOP_RIGHT
          })}
      }
      else{
        setIsLoading(false)
        toast.error(res.message, {
          position: toast.POSITION.TOP_RIGHT
      })
      }
  
    }).catch((err)=>{
  
    setIsLoading(false)
    })
}


useEffect(()=>{ 
  
  fetchNonLateData(employee.fromDate,employee.toDate)
  setbackButton1(false)
},[reload])


const handleSerchData=(e)=>{
    e.preventDefault()
 

  if(employee.fromDate.length>0 && employee.toDate.length>0 ){
    fetchNonLateData(employee.fromDate,employee.toDate)
       // SearchIsLateData(employee.fromDate,employee.toDate)
       setbackButton1(true)
  }
  else{
    toast.error("Please enter start date, end Date ", {
      position: toast.POSITION.TOP_RIGHT
  })
   
  }
  

   }
    
   const handleRowClick=(params)=>{
 const employeeDetailsUrl=`../user/Biometric-Table-Data-Showing?empId=${params.row.empId}&empName=${params.row.empName}`;
 window.open(employeeDetailsUrl,'_blank');

   }




    return hasAuthority( ACCESS_LEVEL_FIRST_BIOMETRIC_TABLE_TITLE)? (

isLoading?<Loading></Loading>:

        <Box style={SerchingComponetsstyle.firstBox}>
             
                 <Box style={SerchingComponetsstyle.SecondBox}>
             <Typography variant='h6' style={SerchingComponetsstyle.typographystyle}>BIOMETRIC DATA</Typography>

            
            {
              backButoon1?<Grid style={{justifyContent:"center"}}>
              <Button variant='outlined'  
                onClick={()=>{setreload(!reload);setEmployee({
                  "fromDate":"2023-01-01",
                  "toDate":dayjs().format("YYYY-MM-DD"),
                  "empId": ""
                })}}
               startIcon={<ArrowBackIosNewIcon/>}>
          back
              </Button>
              </Grid>:null
            }
             

                 </Box>

                 
      <GlobalButton.GlobalDivider></GlobalButton.GlobalDivider>
                
 {/*--------------InputFields:-----------FromDate---ToDate---EmpId-------------------------- */}



<form onSubmit={handleSerchData}> 
  <Box
   
   style={SerchingComponetsstyle.Thirdbox}
    >
      <Grid container style={SerchingComponetsstyle.gridContainerStyle}>
      <Grid item xs={3} sm={3} md={3} lg={3} xl={3} >

<TextField InputLabelProps={{ shrink: true }} 
size='small'
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
            style={SerchingComponetsstyle.searchbuttonstyle} endIcon={<SearchIcon/>}>
            search
                </Button>
                </Grid> 
                 
      </Grid>
      
      
      </Box>
      

      </form>

      <GlobalButton.GlobalDivider1></GlobalButton.GlobalDivider1>
{/*-----------------------Tabel:---------------------------- */} 
    


    <Box style={SerchingComponetsstyle.DatagridBoxStyle}>

    <CustomDatagrid  rows={biometricTableNonLate} columns={columns}  rowclickhandle={handleRowClick}  rowId={getrowId} filterchangehandle={handlefilter}
CustomToolBar={CustomToolBar}/>
   </Box>


        </Box>
    ):<NoAuth></NoAuth>
}

 