import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-confirm-alert/src/react-confirm-alert.css';
import {IconButton} from '@mui/material';
import Swal from 'sweetalert2'
import { GlobalButton } from '../../Components/stylecomponent/GlobalButton'
import Loading from '../../Components/LoadingComponent/Loading'
import { SerchingComponetsstyle } from '../../Components/stylecomponent/SerchingComponetsStyle'
import { LeavesBetaServices } from '../../Services/LeavesBeta/LeavesBetaServices'
import { CreateLeaveType } from './CreateLeaveType'
import { hasAuthority } from '../../Services/AccessLevel/AccessLevelService'
import { NoAuth } from '../../Components/HelperComponent/NoAuth'
import { muiDatagrid_headerclassName } from '../../Components/stylecomponent/forFirstDiv'
import CustomModal from '../../Components/CustomComponents/CustomModals/CustomModal'
import { CustomToolBar } from '../../Components/DataGridDataDownload/CustomToolBar'
import CustomDatagrid from '../../Components/CustomComponents/DataGrid/CustomDatagrid'
import { Delete } from '@mui/icons-material'
import moment from 'moment/moment'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';


export const ADD_LEAVES_TYPE_ADMIN ="ADD_LEAVES_TYPE_ADMIN"


function getrowId(row){

  return row.leaveTypeId
  }

export const LeaveTypeTable = () => {
const[addLeaveTypeModal,setAddLeaveTypeModal]=useState(false)
const columns = [
  {
    field:'leaveCode',
    headerName:'Leave Code',
    minWidth:100,
    flex:1,
    headerClassName:muiDatagrid_headerclassName,
    
  },
  {
    field:'leaveName',
    headerName:'Leave Name',
    minWidth:100,
    flex:1.5,
    headerClassName:muiDatagrid_headerclassName,
    
  },
  {
    field:'createdBy',
    headerName:'Created By',
    minWidth:100,
    flex:1.5,
    headerClassName:muiDatagrid_headerclassName,
    // valueGetter:getEmpid
    
  },
  {
    field: 'createdDate',
    headerName: 'Created Date',
    minWidth: 100,
    flex: 1.5,
    headerClassName: muiDatagrid_headerclassName,
    valueFormatter: (params) => moment(params.value).format('DD/MM/YYYY'),
  },
  
  {
    field: 'delete',
    headerName: 'Delete',
    minWidth: 100,
    flex: 1,
    headerClassName: muiDatagrid_headerclassName,
     
      renderCell: (params) => {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <IconButton variant="contained" color='error'
                 onClick={(e) => handleDeleteLeaveType( params.row.leaveTypeId, 'delete')}
                ><Delete /></IconButton >

            </Box>
        )
    }

  },
]
const[isLoading,setIsLoading]=useState(false)
const[LeaveTypeDelete,setLeaveTypeDelete]=useState(false)
const handleDeleteLeaveType = (leaveTypeId,action) => {
  setIsLoading(true)
  if(action === 'delete'){
    Swal.fire({
      icon: "warning",
      iconColor:"#d50000",
      title: 'Do you want to delete this Leave Type ' + leaveTypeId,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#d50000'    
  })
  .then((result)=>{
    setIsLoading(false)
    if(result.isConfirmed){
      LeavesBetaServices.deleteLeaveType(leaveTypeId)
    .then((res) => {
      setIsLoading(false)
      if (res.statusMessage === 'success') {
        Swal.fire(' Selected LeaveType Row Deleted successfully', '', 'success')
        setIsLoading(false)
       setLeaveTypeDelete(!LeaveTypeDelete)
    }
    else{
        Swal.fire("LeaveType with following id"+leaveTypeId+"doesn't exist",'',"error")
        setIsLoading(false)
    }
    })

    }
  })
  
  
  };
}




  const[leaveTypeState,setLeaveTypeState]=useState([])

useEffect(()=>{
fetchLeaveTypes()
},[!LeaveTypeDelete,!addLeaveTypeModal])

  function fetchLeaveTypes(){
    LeavesBetaServices.getAllLeavesType().then((res)=>{
      if (res.statusMessage==="success") {
        if(res.result.length==0){
          toast.info("No Records Found  ",{
              position: toast.POSITION.TOP_RIGHT
          })}
          setLeaveTypeState(res.result)
      }
      else{
        toast.error(res.message, {
          position: toast.POSITION.TOP_RIGHT
      })
      }
  
    }).catch((err)=>{
  
    // setIsLoading(false)
    toast.error(err.message, {
      position: toast.POSITION.TOP_RIGHT
  })
    })
  }

  
  return hasAuthority(ADD_LEAVES_TYPE_ADMIN) ?  (
    isLoading?<Loading></Loading>:
    <Box sx={SerchingComponetsstyle.firstBox}>
      <Box sx={SerchingComponetsstyle.SecondBox}>
        <Typography variant='h6' style={SerchingComponetsstyle.typographystyle}>LIST OF LEAVES</Typography>
        <Grid style={{justifyContent:"center"}}>

{
   <Button variant='outlined' 
  startIcon={<AddOutlinedIcon/>}
  onClick={()=>{setAddLeaveTypeModal(!addLeaveTypeModal)}}>Add Leaves Type</Button>
}
        </Grid>
      
      </Box>

      <CustomModal modalopen={addLeaveTypeModal}  modalclose={()=>{setAddLeaveTypeModal(!addLeaveTypeModal)}} children={<CreateLeaveType onclose={()=>{setAddLeaveTypeModal(false)}}/>} />
    
<GlobalButton.GlobalDivider1/>
   <Box sx={SerchingComponetsstyle.DatagridBoxStyle}>

   <CustomDatagrid  
rows={leaveTypeState} columns={columns} sortingfield={"modifiedDate"}   rowId={getrowId} 
CustomToolBar={CustomToolBar}
/>


</Box>
   </Box>
  ):<NoAuth></NoAuth>
}
