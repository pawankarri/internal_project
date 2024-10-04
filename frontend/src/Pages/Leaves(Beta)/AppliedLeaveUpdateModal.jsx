import { Box, Button, Card, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import Loading from '../../Components/LoadingComponent/Loading';
import { DropDownServices } from '../../Services/DropDownServices/DropDownServices';
import { LeavesBetaServices } from '../../Services/LeavesBeta/LeavesBetaServices';
import axios from 'axios';
import { LeaveTypeReportStyle } from './LeaveTypeReportStyle';
import moment from 'moment/moment';
import { baseUrl } from '../../Server/baseUrl';



export default function AppliedLeaveUpdateModal(props) {
    const [leaveTypeDrop,setLeaveTypeDrop]=useState([])
    function fetchLeaveType(){
    LeavesBetaServices.getAllLeavesType().then((res)=>{
      setLeaveTypeDrop(res.result)
       
    }).catch((err)=>{
    
    })
    }
    useEffect(()=>{
      fetchLeaveType()
    },[])
    const [isHalfDay, setIsHalfDay] = useState(false);
    const handleReset = () => {
        setApplyLeave({
            "empId":"",
            "leaveType": "",
            "fromDate": "",
            "toDate": "",
            "reason": ""
        });
        setIsHalfDay(false);
    };
    const[todatesetting,settodatesettting]=useState(false)
    
    const [skilldata3,setskilldata3]=useState(props.rowdata)
    console.log(skilldata3);
    const[applyLeave,setApplyLeave]=useState({
        "empId": skilldata3?.empId,
        "leaveType": skilldata3?.leaveType,
        "fromDate": skilldata3?.leaveDate,
        "toDate": moment(skilldata3?.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        "reason": skilldata3?.reason,
        "isHalfDay":skilldata3?.halfDay?"1":"0"
        
      })
console.log(skilldata3.isHalfDay);
      let form =new FormData()
form.append("empId",applyLeave.empId)
form.append("leaveType",applyLeave.leaveType)
form.append("fromDate",applyLeave.fromDate)
form.append("toDate",applyLeave.toDate)
form.append("reason",applyLeave.reason)
form.append("isHalfDay",applyLeave.isHalfDay)

 console.log(applyLeave.isHalfDay);   
    console.log(skilldata3);
    const handleHalfDayChange = (event) => {
      

        setIsHalfDay(event.target.checked);
        if (event.target.checked) {
            settodatesettting(true)
            setApplyLeave({ ...applyLeave, toDate: applyLeave.fromDate });
            setApplyLeave({...applyLeave,isHalfDay:"1"})
        } else {
            setApplyLeave({ ...applyLeave, toDate: "" });
            setApplyLeave({...applyLeave,isHalfDay:"0"})
        }
    };


    useEffect(()=>{
        if(todatesetting){
           setApplyLeave({ ...applyLeave, toDate: applyLeave.fromDate });
        }
        else{
           setApplyLeave({ ...applyLeave, toDate: moment(skilldata3?.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD')});
        }
       },[todatesetting,applyLeave.fromDate])
       console.log(applyLeave);

let func1=props?.onClose1
const textfield1 = { width: 400 }
const[isLoading,setIsLoading]=useState(false)
 
   const [locationdrop,setlocationdrop]=useState([])
   function fetchLocation(){
   DropDownServices.getTeamDrop().then((res)=>{
       setlocationdrop(res.result)
      
   }).catch((err)=>{
   
   })
   }
   useEffect(()=>{
    fetchLocation()
   },[])

   const token = localStorage.getItem("token")

    const handleSubmit=(event)=>{

        event.preventDefault();
         setIsLoading(true)
        
         axios({
            method: "put",
            url: `${baseUrl}/leaves-beta/update-leave-of-employee/${skilldata3?.leavesBetaId}`,
            data:form,
            headers: { "Content-Type": 'multipart/form-data' ,"Authorization" : 'Bearer ' + token},
          }).then(
            res => {
                 if (res.status === 200) {
                      setIsLoading(false)

                      props.dataerase(true)

                     Swal.fire({
                         position: 'center',
                         icon: 'success',
                         title: 'processed successfully',
                         showConfirmButton: false,
                         timer: 1500
                     })
                     func1()
                 } 
                 else {
                      setIsLoading(false)
                     Swal.fire({
                         position: 'center',
                         icon: 'error',
                         title: res.message,
                         showConfirmButton: false,
                         timer: 1500
                     }
                     )
                 }
                 func1()
             }
         )
         .catch(err => {
            func1()
              setIsLoading(false)
             Swal.fire(
                 {
 
                     position: 'center',
                     icon: 'error',
                     title: err.response.data.message,
                     showConfirmButton: false,
                     timer: 1500
                 }
 
             )
         })

        
    }



  return (
    isLoading?<Loading></Loading>:
        <Card >
        <Box sx={{padding:"10px"}}>
            <center>
            <Typography   style={LeaveTypeReportStyle.TypographyStyle}>UPDATE LEAVE FOR AN EMPLOYEE</Typography>
            </center>
            </Box>   
              
            <Box style={LeaveTypeReportStyle.thirdBoxStyle}>
            <form onSubmit={handleSubmit} >
            <Grid container spacing={1.5} style={LeaveTypeReportStyle.gridContinerStyle}> 
            <Grid item xs={12} sm={12}  style={LeaveTypeReportStyle.gridItemStyle}>
                   <TextField disabled label='empId'  value={applyLeave.empId}
                                 onChange={(e)=>{setApplyLeave({...applyLeave,empId:e.target.value})}}
				   id="outlined-basic1" style={LeaveTypeReportStyle.textFieldStyle} type='number'/>  

                    </Grid >
            
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={LeaveTypeReportStyle.gridItemStyle}>
                       
            <Box sx={{width:350,display:"flex",justifyContent:"center",alignItems:"center"}}>
                     <FormControl  sx={LeaveTypeReportStyle.textFieldStyle}>
                    <InputLabel id="demo-multiple-name-label">LEAVE TYPE</InputLabel>
                      <Select 
                    
                       value={applyLeave.leaveType}
                       onChange={(e)=>{setApplyLeave({...applyLeave,leaveType:e.target.value})}}
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-start"
                      name=""
                      label="Select Warning "
                      required 
                      >
                      
                      {
                                                leaveTypeDrop.map((item)=>{
                                                    return(
                                                        
                                                    <MenuItem  key={item.leaveTypeId}  value={item.leaveCode}>{item.leaveCode+"-"+item.leaveName}</MenuItem>
                                                
                                                    )
                                                
                                                }
                                               
                                                )
                                            }
                     </Select>
            </FormControl>


                <FormControlLabel  sx={{marginLeft:"10px"}}
                  control={<Checkbox checked={isHalfDay} onChange={handleHalfDayChange} />}
                  label="Half Day"
              />

</Box>
                    </Grid >




                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={LeaveTypeReportStyle.gridItemStyle}>
                       
            <TextField  InputLabelProps={{ shrink: true }} style={LeaveTypeReportStyle.textFieldStyle}  type='date' value={applyLeave.fromDate}
   onChange={(e)=>{setApplyLeave({ ...applyLeave,fromDate:e.target.value})}} label="fromDate">FROM DATE</TextField>

                    </Grid >

                    
                   
            {!isHalfDay && <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={LeaveTypeReportStyle.gridItemStyle}>
                
                <TextField  InputLabelProps={{ shrink: true }} style={LeaveTypeReportStyle.textFieldStyle}  type='date' value={applyLeave.toDate}
        onChange={(e)=>{setApplyLeave({ ...applyLeave,toDate:e.target.value})}} label="toDate">TO DATE</TextField>
    
                        </Grid >}
                              

                  
                    <Grid item xs={12} sm={12}  style={LeaveTypeReportStyle.gridItemStyle}>
                   <TextField  label="reason" multiline rows={2} required value={applyLeave.reason} onChange={(e)=>{ setApplyLeave({...applyLeave,reason:e.target.value})}}   id="outlined-basic1" style={LeaveTypeReportStyle.textFieldStyle}  type='text'/>  

                    </Grid >
                
                    <Grid xs={12} sm={12}  style={{display:'flex',justifyContent:'center', alignItems:'center',marginTop:"15px",width:'300px',marginBottom:'20px'}}>
                        <Button type='submit'  disableElevation variant="contained" style={{width:"40px", marginRight: '8px',backgroundColor:"#2196F3",color:"white",borderRadius:"20px",marginBottom:"20px",minWidth:'120px',}}>UPDATE</Button>
                        <Button onClick={handleReset} disableElevation variant="contained" style={{width:"40px",backgroundColor:"#2196F3",color:"white",borderRadius:"20px",marginBottom:"20px",minWidth:'120px',}}>RESET</Button>
                    </Grid>
                </Grid>
                </form>
            </Box>
    </Card>
  )
}

