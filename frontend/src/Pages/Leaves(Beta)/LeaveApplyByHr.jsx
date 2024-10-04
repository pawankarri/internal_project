
import { Box,TextField,Typography,Grid, Autocomplete, FormControl, MenuItem, Select, InputLabel, FormControlLabel, Checkbox, Tooltip, Card} from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Loading from '../../Components/LoadingComponent/Loading';
import AutoEmpSearch from '../../Services/AutoEmpSearch/AutoEmpSearch';
import { hasAuthority } from '../../Services/AccessLevel/AccessLevelService';
import { NoAuth } from "../../Components/HelperComponent/NoAuth";
import { Dropzone } from '@mantine/dropzone';
import { LeaveTypeReportStyle } from '../../Pages/Leaves(Beta)/LeaveTypeReportStyle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { baseUrl } from '../../Server/baseUrl';
import axios from 'axios';
import { useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { LeavesBetaServices } from '../../Services/LeavesBeta/LeavesBetaServices';

export const APPLY_LEAVE_BY_HR="APPLY_LEAVE_BY_HR"



export default function LeaveApplyByHr(){

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
    const [errors, setErrors] = useState({});
   //AutoComplete
   const [data, setData]=useState([]);
   const[records,setRecords]=useState();
  
   useEffect(()=>{
    AutoEmpSearch(records).then((res)=>{
      setData(res.data.result)
    })
   
      },[records])   
     
    const navigate=useNavigate()
    const handleBack=()=>{
        navigate("../apply-for-leave");
    }
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
    const[applyLeave,setApplyLeave]=useState({
        "empId":"",
        "leaveType":"",
        "fromDate":"",
        "toDate":"",
        "reason":"",
        "isHalfDay":"0"
        
      })
    
    const[todatesetting,settodatesettting]=useState(false)
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
           setApplyLeave({ ...applyLeave, toDate: "" });
        }
       },[todatesetting,applyLeave.fromDate])
   
   
    const[attachments,setAttachments]=useState([])

    const fileHandler=(file)=>{
      setAttachments([...attachments, ...file]);
    }


 const [isloading ,setIsLoading]=useState(false)
 
const token = localStorage.getItem("token")
let form =new FormData()
attachments.forEach((value)=>{
    form.append("attachments",value)
})
form.append("empId",applyLeave.empId)
form.append("leaveType",applyLeave.leaveType)
form.append("fromDate",applyLeave.fromDate)
form.append("toDate",applyLeave.toDate)
form.append("reason",applyLeave.reason)
form.append("isHalfDay",applyLeave.isHalfDay)
const validateForm = () => {
    const newErrors = {};

    
    if (!applyLeave.fromDate) {
      newErrors.fromDate = 'From date is required';
    }
    if (!isHalfDay && !applyLeave.toDate) {
      newErrors.toDate = 'To date is required';
    }
   

    return newErrors;
  };

const applyLeaveHandle=(e)=>{
    e.preventDefault()
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true)
    axios({
        method: "post",
        url: `${baseUrl}/leaves-beta/apply-leave-by-hrteam`,
        data:form,
        headers: { "Content-Type": 'multipart/form-data' ,"Authorization" : 'Bearer ' + token},
      }).then((res)=>{
        console.log(res.data);
        if(res.data.status===201 && res.data.statusMessage==='created'){
           
            setIsLoading(false)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500
            })
            setApplyLeave({
                "empId":"",
                "leaveType":"",
                "fromDate":"",
                "toDate":"" ,
                "reason":"",
                "isHalfDay":"0"
                   
            })
           
        }
        else{
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

    setAttachments([])

}





    
    return  hasAuthority(APPLY_LEAVE_BY_HR) ?  (
        isloading ? <Loading/> :
        <Box sx={ LeaveTypeReportStyle.firstBox}>
    


    <Card sx={{width:"395px",height:"80vh",overflowY:"auto", scrollbarWidth: 'auto',
        '&::-webkit-scrollbar': {
          width: '0em',
        },
        '&::-webkit-scrollbar-track': {
          background: "#64b5f6",
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#64b5f6',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#64b5f6'
        }}}>
                
            <Box sx={{display:"flex",marginBottom:"15px"}}>
        <div style={LeaveTypeReportStyle.divStyle}>
            <Typography variant='h6' style={ LeaveTypeReportStyle.TypographyStyle} >APPLY LEAVE FOR AN EMPLOYEE</Typography>
          </div>
<Tooltip title="BACK">
<div  onClick={handleBack} style={{width:"40px",height:"20px",justifyContent:"center",alignContent:"center",alignItems:"center",cursor:"pointer"}}>
            <ArrowBackIcon color='primary'  fontSize='large'/>
          </div>
</Tooltip>
          </Box>
          <form onSubmit={applyLeaveHandle} method="post" enctype="multipart/form-data">
            <Grid container spacing={1.4} style={LeaveTypeReportStyle.gridContinerStyle}> 
            <Grid item xs={12} sm={12}  style={LeaveTypeReportStyle.gridItemStyle}>

           <Autocomplete 
           size='small'
             Value={applyLeave.empId}
             onChange={(e,value)=>{
               if(value==null){

                 return setApplyLeave({...applyLeave,empId:null})
               }
               let data=value.match("[0-9]*")
              return   setApplyLeave({...applyLeave,empId:data[0]})

             }}

              

             style={LeaveTypeReportStyle.textFieldStyle}
            options={data.map((employee)=>employee.empId+"  ("+employee.userName+")")}
                                renderInput={(params)=> 
                                <TextField
                                required
                              
                                 {...params} 
                                label='Employee Id'
                                className='outlined-basic-text-box'
                                id="outlined-basic" 
                                type='text'
                            onKeyUp={(e)=>{setRecords(e.target.value)}}
                            />} />
                    </Grid >   
            
            {!isHalfDay && <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={LeaveTypeReportStyle.gridItemStyle}>
                       
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
                    </Grid >}

        

                    {isHalfDay && <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={LeaveTypeReportStyle.gridItemStyle}>
        <Box sx={{width:350,display:"flex",justifyContent:"center",alignItems:"center"}}>
                    <FormControl   sx={LeaveTypeReportStyle.textFieldStyle} >
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
                    
                    <MenuItem value="SL">SL-SICK LEAVE</MenuItem>
                    <MenuItem value="CL">CL-CASUAL LEAVE</MenuItem>
                    <MenuItem value="LOP">LOP-LOP</MenuItem>
                    <MenuItem value="A">A-ABSENT</MenuItem>
                    </Select>
                    
        </FormControl>


            <FormControlLabel  sx={{marginLeft:"10px"}}
                control={<Checkbox checked={isHalfDay} onChange={handleHalfDayChange} />}
                label="Half Day"
            />

</Box>
                </Grid >}


                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={LeaveTypeReportStyle.gridItemStyle}>
                       
            <TextField helperText= {errors.fromDate && <Typography variant="caption" color="error">{errors.fromDate}</Typography>} InputLabelProps={{ shrink: true }} style={LeaveTypeReportStyle.textFieldStyle}  type='date' value={applyLeave.fromDate}
   onChange={(e)=>{setApplyLeave({ ...applyLeave,fromDate:e.target.value})}} label="fromDate" error={!!errors.fromDate}>FROM DATE</TextField>

                    </Grid >

                    
                   
            {!isHalfDay && <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={LeaveTypeReportStyle.gridItemStyle}>
                
                <TextField helperText= {errors.toDate && <Typography variant="caption" color="error">{errors.toDate}</Typography>} InputLabelProps={{ shrink: true }} style={LeaveTypeReportStyle.textFieldStyle}  type='date' value={applyLeave.toDate}
        onChange={(e)=>{setApplyLeave({ ...applyLeave,toDate:e.target.value})}} label="toDate" error={!!errors.toDate}>TO DATE</TextField>
    
                        </Grid >}
                              


                        <Grid item xs={12} sm={12}  style={LeaveTypeReportStyle.gridItemStyle}>
                   <TextField placeholder='mention reason only' label="reason" multiline rows={2} required value={applyLeave.reason} onChange={(e)=>{ setApplyLeave({...applyLeave,reason:e.target.value})}}   id="outlined-basic1" style={LeaveTypeReportStyle.textFieldStyle} type='text'/>  

                    </Grid >
                    
     <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={LeaveTypeReportStyle.gridItemStyle}>
    <Dropzone onDrop={fileHandler} id="file-upload"  multiple={true} loading={false} style={LeaveTypeReportStyle.DropzoneStyle}>

<Box sx={{display:"flex"}}>
<Typography sx={{marginRight:'20px'}}> Add Attachments</Typography>
<CloudUploadIcon sx={{color:'#2196F3'}}/>
{
    attachments.map((value)=>{
        return(
            <Box sx={{display:"block"}}>
        {/* <span key={value.path}>{value.path}</span> */}
        </Box>)
    })
   }
</Box>
</Dropzone>

  </Grid >
                  
  {attachments?.length === 0 ? null : (
  <Grid item xs={12} sx={{
    display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "flex-start", marginTop: "15px"
  }}>
    {attachments.map((value, index) => (
      <Box key={index} sx={{ display: "flex",justifyContent:"space-between", flexDirection: 'row', alignItems: 'center', marginBottom: '-6px',width:"390px", marginLeft: "25px"}}>
        <Card elevation={0} sx={{ backgroundColor: "#f5f5f5" }}>{value?.path}</Card>
        <Button
          onClick={() => {
            const newAttachments = [...attachments];
            newAttachments.splice(index, 1);
            setAttachments(newAttachments);
          }}
          type="reset"
          sx={{ marginRight: '25px' }}
        >
          <ClearOutlinedIcon style={{ color: "red" }} />
        </Button>
      </Box>
    ))}
  </Grid>
)}           
                
                    <Grid xs={12} sm={12}  style={{display:'flex',justifyContent:'center', alignItems:'center',marginTop:"15px",width:'300px',marginBottom:'20px'}}>
                        <Button type='submit'  variant="contained" style={{width:"40px", marginRight: '8px',backgroundColor:"#2196F3",color:"white",borderRadius:"20px",marginBottom:"20px",minWidth:'120px',}}>APPLY</Button>
                        <Button onClick={handleReset} variant="contained" style={{width:"40px",backgroundColor:"#2196F3",color:"white",borderRadius:"20px",marginBottom:"20px",minWidth:'120px',}}>RESET</Button>
                    </Grid>
                </Grid>
                </form>
               
            </Card>
         
    </Box>


            
    ):<NoAuth></NoAuth>


}