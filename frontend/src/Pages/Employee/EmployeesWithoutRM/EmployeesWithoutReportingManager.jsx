import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import Loading from '../../../Components/LoadingComponent/Loading'
import { hasAuthority } from '../../../Services/AccessLevel/AccessLevelService'
import { NoAuth } from '../../../Components/HelperComponent/NoAuth'
import moment from 'moment'
import { GlobalButton } from '../../../Components/stylecomponent/GlobalButton'
import { toast } from 'react-toastify'
import { SerchingComponetsstyle } from '../../../Components/stylecomponent/SerchingComponetsStyle'
import { muiDatagrid_headerclassName } from '../../../Components/stylecomponent/forFirstDiv'
import CustomDatagrid from '../../../Components/CustomComponents/DataGrid/CustomDatagrid'
import { ResignedEmployee } from '../../../Services/employee-service/EmployeeService'

function getempnameid(params) {
  return params.row?.empId+" -"+params.row?.empName
}

const columns = [
    { 
      field: 'empId',
     headerName: 'Employee Name',
     minWidth: 100,
      flex:1.5,
     headerClassName:muiDatagrid_headerclassName,
     valueGetter:getempnameid
     
    },
  
    { 
    field: 'emailId',
     headerName: 'Email ID', 
     minWidth: 120,
      flex:2.0,
     headerClassName:muiDatagrid_headerclassName, 
    },
    { 
     field: 'contactNo',
     headerName: 'Contact No', 
     minWidth: 120,
     flex:1.0,
     headerClassName:muiDatagrid_headerclassName,
  
    },
    { 
        field: 'dateOfJoining',
        headerName: 'Date of Joining',
        minWidth: 100,
        flex: 1.5,
        headerClassName: muiDatagrid_headerclassName,
        valueFormatter: params => moment(params?.value).format("DD/MM/YYYY"),
    },
    
    
]

function getrowId(row){

  return row.empId
}

export const EMPLOYEES_WITHOUT_RM='EMPLOYEES_WITHOUT_RM'

export default function EmployeesWithoutRM() {
  const[termination,setTermination]=useState([])
  const[isLoading,setIsLoading]=useState(false)
  const[backButoon1,setbackButton1]=useState(false)
  const[reload,setreload]=useState(false)
  const handlefilter=()=>{
    setbackButton1(true)
  }
  

function fetchTerminatedEmployee(){
  setIsLoading(true) 

 ResignedEmployee.getEmpsWithoutRM().then((res)=>{
            if(res.status ===200 && res.statusMessage==="success"){
                 setIsLoading(false)
                if(res.result.length==0){
                  toast.info("No Records Found ",{
                      position: toast.POSITION.TOP_RIGHT
                  })}
                  setTermination(res.result)
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

const[terminationmodal,setTerminationmodal]=useState(false)
useEffect(()=>{
fetchTerminatedEmployee()
setbackButton1(false)
},[terminationmodal,reload])



   


  return hasAuthority(EMPLOYEES_WITHOUT_RM)? (
    isLoading ? <Loading/>:
    <Box  sx={SerchingComponetsstyle.firstBox}>
      <Box style={SerchingComponetsstyle.SecondBox}>
        
                  <Typography variant='h6' style={SerchingComponetsstyle.typographystyle}>EMPLOYEES WITHOUT REPORTINGMANAGER</Typography>
                  <Grid style={{justifyContent:"center"}}>

                </Grid>
                 </Box>
                 
                 
             <GlobalButton.GlobalDivider></GlobalButton.GlobalDivider>

             
                 
                <Box  sx={SerchingComponetsstyle.DatagridBoxStyle}>


                <CustomDatagrid rows={termination} columns={columns} sortingfield={"modifiedDate"} rowId={getrowId} filterchangehandle={handlefilter}/>
                
                 </Box>


        
                 
    </Box>

  ):<NoAuth></NoAuth>
}
