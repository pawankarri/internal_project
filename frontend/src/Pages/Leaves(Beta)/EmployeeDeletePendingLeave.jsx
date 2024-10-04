
import { Box,TextField,Typography,Paper,Grid,Container, Autocomplete, FormControl, MenuItem, Select, InputLabel, FormControlLabel, Checkbox, Tooltip, Table, TableRow, TableCell} from '@mui/material';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';
import Loading from '../../Components/LoadingComponent/Loading';
import { LeaveTypeReportStyle } from '../../Pages/Leaves(Beta)/LeaveTypeReportStyle';
import { baseUrl } from '../../Server/baseUrl';
import axios from 'axios';
import moment from 'moment/moment';
import { useState } from 'react';


export default function EmployeeDeletePendingLeave({pendingdata,onclose}){
 const [isloading ,setIsLoading]=useState(false)
  const[applyLeave,setApplyLeave]=useState({
    "empId":pendingdata?.empId,
    "leaveType":pendingdata?.leaveType,
    "fromDate":pendingdata?.leaveDate,
    "toDate": moment(pendingdata?.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD'), 
    "reason":pendingdata?.reason,
    "comments":""
    
  })
const token = localStorage.getItem("token")

 

const applyLeaveHandle=(e)=>{
    e.preventDefault()
    if (!applyLeave.comments || applyLeave.comments.trim() === '') {
        
        Swal.fire({
          icon: 'error',
          title: 'Comments are mandatory',
          text: 'Please provide comments before deleting.',
        });
      } else {
      setIsLoading(true)
    axios({
        method: "delete",
        url: `${baseUrl}/leaves-beta/delete-applied-leave?leaveBetaId=${pendingdata?.leavesBetaId}&comments=${applyLeave.comments}`,
        headers: { "Content-Type": 'multipart/form-data' ,"Authorization" : 'Bearer ' + token},
      }).then((res)=>{
        console.log(res.data);
        if(res.data.status===200 && res.data.statusMessage==='DELETE'){

           
            onclose()
            setIsLoading(false)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: "Deleted Successfully",
                showConfirmButton: false,
                timer: 1500
            })
        }
        else{
           onclose()
            setIsLoading(false)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500
            }
            )
        }

    }).catch((error)=>{
        onclose()
        setIsLoading(false)
        Swal.fire(
            {
                position: 'center',
                icon: 'error',
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            }

        )

    })


}
}
    return    (
        isloading ? <Loading/> :
        <Box sx={{padding:"10px"}}>


{/* <Table size='small' >
    <TableRow >
        <TableCell variant="head">Header 1</TableCell>
        <TableCell>Cell 1</TableCell>
    </TableRow>
    <TableRow >
        <TableCell variant="head">Header 1</TableCell>
        <TableCell>Cell 2</TableCell>
    </TableRow>
</Table> */}

            <center>
            <Typography   style={LeaveTypeReportStyle.TypographyStyle}>DELETE LEAVE</Typography>
            </center>
       <Box>
        
   
    </Box>        

            <Box style={LeaveTypeReportStyle.thirdBoxStyle}>
                
            <Grid container spacing={1.5}  style={LeaveTypeReportStyle.gridContinerStyle}> 
            <Grid item xs={12} sm={12}  style={LeaveTypeReportStyle.gridItemStyle}>
                   <TextField disabled label="empId"  required value={applyLeave.empId} onChange={(e)=>{ setApplyLeave({...applyLeave,empId:e.target.value})}}   id="outlined-basic1" style={LeaveTypeReportStyle.textFieldStyle} type='number'/>  

                    </Grid >
                    <Grid item xs={12} sm={12}  style={LeaveTypeReportStyle.gridItemStyle}>
                   <TextField disabled label="LeaveType"  required value={applyLeave.leaveType} onChange={(e)=>{ setApplyLeave({...applyLeave,leaveType:e.target.value})}}   id="outlined-basic1" style={LeaveTypeReportStyle.textFieldStyle}  type='text'/>  

                    </Grid >



                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={LeaveTypeReportStyle.gridItemStyle}>
                       
            <TextField disabled InputLabelProps={{ shrink: true }} style={LeaveTypeReportStyle.textFieldStyle}  type='date' value={applyLeave.fromDate}
   onChange={(e)=>{setApplyLeave({ ...applyLeave,fromDate:e.target.value})}} label="fromDate">FROM DATE</TextField>

                    </Grid >

                    
                   
             <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={LeaveTypeReportStyle.gridItemStyle}>
                
                <TextField disabled InputLabelProps={{ shrink: true }} style={LeaveTypeReportStyle.textFieldStyle}  type='date' value={applyLeave.toDate}
        onChange={(e)=>{setApplyLeave({ ...applyLeave,toDate:e.target.value})}} label="toDate">TO DATE</TextField>
    
                        </Grid >
                              
                  
                    <Grid item xs={12} sm={12}  style={LeaveTypeReportStyle.gridItemStyle}>
                   <TextField disabled label="reason" multiline rows={2} required value={applyLeave.reason} onChange={(e)=>{ setApplyLeave({...applyLeave,reason:e.target.value})}}   id="outlined-basic1" style={LeaveTypeReportStyle.textFieldStyle}  type='text'/>  

                    </Grid >
                    <Grid item xs={12} sm={12}  style={LeaveTypeReportStyle.gridItemStyle}>
                   <TextField autoFocus required label="comments" multiline rows={2}  onChange={(e)=>{ setApplyLeave({...applyLeave,comments:e.target.value})}}   id="outlined-basic1" style={LeaveTypeReportStyle.textFieldStyle}  type='text'/>  

                    </Grid >
                
                      <Grid item xs={12} sm={12}  style={{display:'flex',justifyContent:'center', alignItems:'center',marginTop:"15px",width:'300px',marginBottom:'20px'}}>
                        <Button type='submit' onClick={(e)=>{applyLeaveHandle(e)}} disableElevation variant="contained" style={{width:"40px", marginRight: '8px',backgroundColor:"rgb(213, 0, 0)",color:"white",borderRadius:"20px",marginBottom:"20px",minWidth:'120px',}}>DELETE</Button>
                        <Button onClick={()=>{onclose()}}   disableElevation variant="contained" style={{width:"40px",backgroundColor:"green",color:"white",borderRadius:"20px",marginBottom:"20px",minWidth:'120px',}}>CANCEL</Button>
                    </Grid>
                </Grid>
            </Box>
    </Box>
    )


}