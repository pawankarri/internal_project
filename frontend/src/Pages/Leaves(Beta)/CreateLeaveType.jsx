import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { GlobalButton } from '../../Components/stylecomponent/GlobalButton'
import { toast } from 'react-toastify'
import Loading from '../../Components/LoadingComponent/Loading'
import dayjs from 'dayjs'
import { LeavesBetaServices } from '../../Services/LeavesBeta/LeavesBetaServices'
import { LeavesBetaStyle } from './LeaveTypeReportStyle'


export const CreateLeaveType = (props) => {

    const [isLoading,setIsLoading]=useState(false)
    const [addLeaveType,setAddLeaveType]=useState({
        "createdOn":dayjs().format("YYYY-MM-DD"),
        "leaveCode":"",
        "leaveName":"",
        "createdBy":localStorage.getItem("id"),
    })
    const func1=props.onclose

    const LeaveTypeModalHandle =(e)=>{
        e.preventDefault()
        LeavesBetaServices.AddLeaveType(addLeaveType).then((res)=>{
            if (res.status===200 && res.message==='Process Successfully') 
            {
                setIsLoading(false)
                toast.success(res.statusMessage, 
                    {
                position: toast.POSITION.TOP_CENTER
                    });
                    func1()
                setAddLeaveType({
                    "createdOn":"",
                    "leaveCode":"",
                    "leaveName":"",
                    "createdBy":localStorage.getItem("id"),
                })
                
            } 
            else {
                setIsLoading(false)
                toast.info(res.result, {
                position: toast.POSITION.TOP_CENTER
        });
        func1()
            }
        }).catch((error)=>{
            setIsLoading(false)
            toast.error(error.message, {
                position: toast.POSITION.TOP_CENTER
            });
            func1()
        })
    }

  
  return (
    isLoading?<Loading/>:
   <Card sx={LeavesBetaStyle.CardStyle}>
    <CardContent>
        <center>
            <Grid >
                <Typography style={LeavesBetaStyle.TypographyStyle}>ADD LEAVE TYPE</Typography>
            </Grid>
            </center>
            <GlobalButton.GlobalDivider />
            <form onSubmit={LeaveTypeModalHandle}>
                <Box style={LeavesBetaStyle.thirdBoxStyle}>
                    <Grid container spacing={1.5} style={LeavesBetaStyle.gridContinerStyle}>
                        
                    <Grid item xs={12} style={LeavesBetaStyle.gridItemStyle}>
                            <TextField required
                             value={addLeaveType.leaveCode}
                            onChange={(e)=>{setAddLeaveType({...addLeaveType,leaveCode:e.target.value})}}
                            className='outlined-basic-text-box' id='outlined-basic1'
                            label="Leave code" variant='outlined'
                            style={LeavesBetaStyle.textFieldStyle} type='text'
                            />
                        </Grid>

                        
                       

                        <Grid item xs={12} style={LeavesBetaStyle.gridItemStyle}>
                            <TextField required
                             value={addLeaveType.leaveName}
                            onChange={(e)=>{setAddLeaveType({...addLeaveType,leaveName:e.target.value})}}
                            className='outlined-basic-text-box' id='outlined-basic1'
                            label="Leave Type" variant='outlined'
                            style={LeavesBetaStyle.textFieldStyle} type='text'
                            />
                        </Grid>

                    
                        <Grid item xs={12} style={ LeavesBetaStyle.gridItemStyle}>
                        <Button sx={{marginTop:"10px"}} type='submit'  variant="contained" style={GlobalButton.OperationButton}>Submit</Button>

                        <Button sx={{marginLeft:"20px",marginTop:"10px"}} onClick={props.onclose} variant='contained'  style={GlobalButton.HaltButton}>Cancel</Button>
                    </Grid>
                   



                    </Grid>
                    

                </Box>


            </form>
     <GlobalButton.GlobalDivider/>   
    </CardContent>
   </Card>
  )
}
