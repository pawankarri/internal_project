
import { Box,TextField,Typography,Paper,Grid,Container, Autocomplete, FormControl, MenuItem, Select, InputLabel, FormControlLabel, Checkbox, Tooltip} from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Loading from '../../Components/LoadingComponent/Loading';
import { LeaveTypeReportStyle } from '../../Pages/Leaves(Beta)/LeaveTypeReportStyle';
import { baseUrl } from '../../Server/baseUrl';
import axios from 'axios';
import moment from 'moment/moment';




export const APPLY_LEAVE_BY_HR="APPLY_LEAVE_BY_HR"



export default function PendingLeaveUpdate({pendingdata,onclose,dataerase}){
   
    const [errors, setErrors] = useState({});
 const [isloading ,setIsLoading]=useState(false)
  const[applyLeave,setApplyLeave]=useState({
    "empId":pendingdata?.empId,
    "leaveType":pendingdata?.leaveType,
    "fromDate":pendingdata?.leaveDate,
    "toDate": moment(pendingdata?.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD'), 
    "reason":pendingdata?.reason,
    "comments":''
    
  })
const token = localStorage.getItem("token")
let form =new FormData()
form.append("empId",applyLeave.empId)
form.append("leaveType",applyLeave.leaveType)
form.append("fromDate",applyLeave.fromDate)
form.append("toDate",applyLeave.toDate)
form.append("reason",applyLeave.reason)
form.append('comments',applyLeave.comments)

  
const applyLeaveHandle=(e,value)=>{
    e.preventDefault()
    const newErrors = validateForm(value);

    if (value === 'Declined' && !applyLeave.comments) {
      newErrors.comments = 'Comments are required while rejecting.';
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true)
    axios({
        method: "put",
        url: `${baseUrl}/leaves-beta/approve-employee-leave/${pendingdata?.leavesBetaId}/${value}`,
        data:form,
        headers: { "Content-Type": 'multipart/form-data' ,"Authorization" : 'Bearer ' + token},
      }).then((res)=>{
        console.log(res.data);
        if(res.data.status===200 && res.data.statusMessage==='success'){

            dataerase(true)
            onclose()
            setIsLoading(false)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: "Processed Successfully",
                showConfirmButton: false,
                timer: 1500
            })
            setApplyLeave({
                "empId":"",
                "leaveType":"",
                "fromDate":"",
                "toDate":"" ,
                "reason":"",
                "comments":"",
                   
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
const validateForm = (value) => {
    const newErrors = {};
  
    if (!applyLeave.comments && applyLeave.comments.trim() === '' && value === 'Declined') {
      newErrors.comments = 'Comments are required when rejecting.';
    }
  
    return newErrors;
  };
    return    (
        isloading ? <Loading/> :
        <Box sx={{padding:"10px"}}>
            <center>
            <Typography   style={LeaveTypeReportStyle.TypographyStyle}>APPORVE OR REJECT</Typography>
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
                   <TextField  helperText={errors.comments && <Typography variant="caption" color="error">{errors.comments}</Typography>} label="comments" multiline rows={2}  onChange={(e)=>{ setApplyLeave({...applyLeave,comments:e.target.value})}}   id="outlined-basic1" style={LeaveTypeReportStyle.textFieldStyle}  type='text' autoFocus/>  

                    </Grid >
                
                      <Grid xs={12} sm={12}  style={{display:'flex',justifyContent:'center', alignItems:'center',marginTop:"15px",width:'300px',marginBottom:'20px'}}>
                        <Button type='submit' onClick={(e)=>{applyLeaveHandle(e,"Approved")}} disableElevation variant="contained" style={{width:"40px", marginRight: '8px',backgroundColor:"green",color:"white",borderRadius:"20px",marginBottom:"20px",minWidth:'120px',}}>APPROVE</Button>
                        <Button  onClick={(e)=>{applyLeaveHandle(e,"Declined")}} disableElevation variant="contained" style={{width:"40px",backgroundColor:"rgb(213, 0, 0)",color:"white",borderRadius:"20px",marginBottom:"20px",minWidth:'120px',}}>REJECT</Button>
                    </Grid>
                </Grid>
            </Box>
    </Box>


               


    )


}