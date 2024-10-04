import { Autocomplete, Box, Button, Card, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { GlobalButton } from '../../Components/stylecomponent/GlobalButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Employee from '../../Pages/Employee/Employee';
import dayjs from 'dayjs';
import AutoEmpSearch from '../../Services/AutoEmpSearch/AutoEmpSearch';
import Swal from 'sweetalert2';
import { createSkillsReport } from '../../Services/SkillsReport/SkillsReportService';
import Loading from '../../Components/LoadingComponent/Loading';
import { hasAuthority } from '../../Services/AccessLevel/AccessLevelService';
import { NoAuth } from '../../Components/HelperComponent/NoAuth';
import { useNavigate } from 'react-router';
import { DropDownServices } from '../../Services/DropDownServices/DropDownServices';
import { EmployeeSkillReportStyle } from './EmployeeSkillReportStyle';
import Notification from '../../Components/HelperComponent/Notification';
import { TeamName } from '../../Components/HelperComponent/HelperText';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const REPORTING_MANAGER_CREATE_SKILL_REPORT_PAGE_TITLE="CREATE_SKILL_REPORT_REPORTING_MANAGER_767"

export const ReportingManagerCreateSkill = () => {

const[isLoading,setIsLoading]=useState(false)
    //AutoComplete
const [data, setData]=useState([]);
const[records,setRecords]=useState();
const [status,setStatus]=useState(false)
useEffect(()=>{
 AutoEmpSearch(records).then((res)=>{
   setData(res.data.result)
 })

   },[records])

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


    
    const [other,setOther]=useState("")
    const [other1,setother1]=useState("")
    const[company,setCompany]=useState("Eidiko Systems Integrators")
    const[company1,setCompany1]=useState("")
   
    const handleOther=(e)=>{
        setOther(e.target.value)
    }
    useEffect(()=>{
        setEmployee({...employee,skills:other})
    },[other])

    useEffect(()=>{
        setEmployee({...employee,team:company})
        if(employee.working==="Project" || employee.working==="T&M" || employee.working==="Shadow"){
            setEmployee({...employee,team:""}) 
        }
    },[company,company1])

    const [employee, setEmployee] = useState({
        "empId": "",
        "startDate": dayjs().format("YYYY-MM-DD"),
        "endDate": dayjs().format("YYYY-MM-DD"),
        "working": "Training",
        "skills": "",
        "team": "",
        "modifiedBy":localStorage.getItem("id"),
         
    });

    const handleSubmit=(event)=>{
        event.preventDefault();
         setIsLoading(true)
         if(new Date(employee.startDate)>new Date(employee.endDate)){
            Swal.fire({
                position: 'center',
                icon: 'info',
                title: "End Date Should Be Greater than Start Date",
                showConfirmButton: false,
                timer: 1500
               
            })
            setIsLoading(false)
            return
         }
        createSkillsReport(employee).then(
            res => {
                 if (res.status === 201 && res.statusMessage === "Success") {
                      setIsLoading(false)
                     Swal.fire({
                         position: 'center',
                         icon: 'success',
                         title: res.message,
                         showConfirmButton: false,
                         timer: 1500
                     })
                     setEmployee({
                        "empId": "",
                        "startDate": dayjs().format("YYYY-MM-DD"),
                        "endDate": dayjs().format("YYYY-MM-DD"),
                        "working": "Training",
                        "skills": "",
                        "team": "",
                        "modifiedBy":localStorage.getItem("id"),

                         
                     })
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
             }
         )
         .catch(err => {
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
         setCompany("Eidiko Systems Integrators")
         setCompany1("")
         setother1("")
         setOther("")
    }
const history=useNavigate()
    const handleGoBack = () =>{
        history(-1);

    };

    const[toggle,settoggle]=useState(false);
    const[text,settext]=useState(TeamName)


  return hasAuthority(REPORTING_MANAGER_CREATE_SKILL_REPORT_PAGE_TITLE)? (
    isLoading?<Loading></Loading>:

    <Box style={EmployeeSkillReportStyle.firstBox}>
    
           

                  

                        <Card style={EmployeeSkillReportStyle.thirdBoxStyle}>
                        <form onSubmit={handleSubmit}>
                        
        <Box sx={{display:"flex"}}>
        <div style={EmployeeSkillReportStyle.divStyle}>
            <Typography  style={ EmployeeSkillReportStyle.TypographyStyle} >MAKE A SKILL REPORT</Typography>
          </div>
<Tooltip title="BACK">
<div  onClick={handleGoBack} style={{width:"40px",height:"20px",justifyContent:"center",alignContent:"center",alignItems:"center",cursor:"pointer"}}>
            <ArrowBackIcon color='primary'  fontSize='large'/>
          </div>
</Tooltip>
          </Box>
            
    
                            <Grid container  gap={1.1} style={EmployeeSkillReportStyle.gridContinerStyle}>


                            <Grid item xs={12} style={EmployeeSkillReportStyle.gridItemStyle}>
                     <Autocomplete 
                     size='small'
             Value={employee.empId}
             onChange={(e,value)=>{
               if(value==null){

                 return setEmployee({...employee,empId:null})
               }
               let data=value.match("[0-9]*")
              return   setEmployee({...employee,empId:data[0]})

             }}

              

             style={EmployeeSkillReportStyle.textFieldStyle}
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
                        
                    </Grid>



<Grid item xs={12} style={EmployeeSkillReportStyle.gridItemStyle}>
 <FormControl style={EmployeeSkillReportStyle.formcontrolStyle}  required name="Skills" >
            <InputLabel  id="demo-multiple-name-label" >Working </InputLabel>
            <Select 
              value={employee.working}
              onChange={(e)=>{setCompany1(e.target.value);setEmployee({
                ...employee,working:e.target.value})}}
              labelId="demo-multiple-name-label"
              id="demo-multiple-start"
              label="Woking"
            >
               <MenuItem value="Training">Training</MenuItem>
                <MenuItem  value="Project">Project</MenuItem>
                <MenuItem value="T&M">T & M</MenuItem>
                <MenuItem value="Shadow">Shadow</MenuItem>
            </Select>
           
         </FormControl>

   </Grid>
   {
                            employee.working==="Training"  || company1==="Training"?

                            <Grid item xs={12} style={EmployeeSkillReportStyle.gridItemStyle}>
                            <TextField value={company} 
                            onChange={(e)=>{setCompany(e.target.value)}}
                            label="Company Name" required   variant='outlined' sx={{marginTop:"13px"}}
                            fullWidth style={EmployeeSkillReportStyle.textFieldStyle}/>
                            </Grid> : <Grid item xs={12} style={EmployeeSkillReportStyle.gridItemStyle}>
                                           
                                            <TextField 
                                          
                                          style={EmployeeSkillReportStyle.textFieldStyle}
                                            required
                                            value={employee.team}
                                            label="Company"
                                            placeholder='Company Name'
                                            className='outlined-basic-text-box'
                                            id="outlined-basic"
                                            onClick={(e)=>{settoggle(!toggle)}}

                                            type='text'
                                            onChange={(event)=>setEmployee({

                                                ...employee,team:event.target.value

                                            })}></TextField>

                                         </Grid>

                        }

<Notification toggle={toggle} text={text}></Notification>


                                         <Grid item xs={12} style={EmployeeSkillReportStyle.gridItemStyle}>
 <FormControl style={EmployeeSkillReportStyle.formcontrolStyle}  required name="Skills" >
            <InputLabel  id="demo-multiple-name-label" >Skills </InputLabel>
            <Select 
              value={employee.skills}
              onChange={(e)=>{setother1(e.target.value);setEmployee({
                ...employee,skills:e.target.value

            })}}
              labelId="demo-multiple-name-label"
              id="demo-multiple-start"
              label="Skills"
            >
                      {
                             locationdrop.map(({skillId,skillName})=>{
                                return(
                                <MenuItem  key={skillId}  value={skillName}>{skillName}</MenuItem>)
                               
                            })
                            
                        }
                         <MenuItem  key="Others"  value="Others">Others</MenuItem>

            </Select>
         </FormControl>
                                         </Grid>
                                         {
                            employee.skills==="Others"  || other1==="Others"?

                            <Grid item xs={12} style={EmployeeSkillReportStyle.gridItemStyle}>
                            <TextField value={other} 
                            onChange={handleOther}
                            label="Other Skills" required  placeholder="Enter Skils" variant='outlined' sx={{marginTop:"13px"}}
                            fullWidth style={EmployeeSkillReportStyle.textFieldStyle}/>
                            </Grid>:null

                        }

                                       
                                    <Grid item xs={12} style={EmployeeSkillReportStyle.gridItemStyle}>
                                    

                                    <TextField InputLabelProps={{ shrink: true }}  
                                    required className='outlined-basic-text-box' id="outlined-basic" label=" Start Date" variant="outlined" style={EmployeeSkillReportStyle.textFieldStyle} type='date'
                                        value={employee.startDate}
                                        onChange={(event) => setEmployee({
                                            ...employee, startDate: event.target.value
                                        })}
                                    />

                                </Grid >

                                <Grid item xs={12} style={EmployeeSkillReportStyle.gridItemStyle}>
                                    

                                    <TextField InputLabelProps={{ shrink: true }}  
                                    className='outlined-basic-text-box' id="outlined-basic" 
                                    label=" End Date" variant="outlined" style={EmployeeSkillReportStyle.textFieldStyle} type='date'
                                        value={employee.endDate}
                                        onChange={(event) => setEmployee({
                                            ...employee, endDate: event.target.value
                                        })}
                                    />

                                </Grid >

                                <Grid item xs={12} style={EmployeeSkillReportStyle.gridItemStyle}>
                                    <Button variant="contained" type='submit' style={GlobalButton.OperationButton}>Submit</Button>
                                </Grid>





                            </Grid>



                            </form>
            
                        </Card>


    </Box>
  ):<NoAuth></NoAuth>
}

