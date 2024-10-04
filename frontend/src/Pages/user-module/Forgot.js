import { Grid, Paper, Link, TextField, Avatar, Box, Typography, Card } from "@mui/material"
import { GlobalStyle1 } from "../../Components/stylecomponent/forFirstDiv"
import { Button } from "@mui/material";
import eidiko1 from "../../images/eidiko1.jpg"
import axios from "axios";
import { Navigate, useNavigate } from "react-router";
import { useState } from "react";
import validation from "../../Error/LoginErrorHandler"
import userServiceModule from "../../Services/user-service/UserService"
import Loading from "../../Components/LoadingComponent/Loading";
import { toast } from "react-toastify";
import { hasAuthority } from "../../Services/AccessLevel/AccessLevelService";
import "./Form1.css"
import { GlobalButton } from "../../Components/stylecomponent/GlobalButton";


export default function Forgot() {

const navigate=useNavigate();
  const [employeeId3, setEmployeeId3] = useState('')
  const [message, setmessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handlePasswordChange = (e) => {
    setEmployeeId3(e.target.value)

  }
  const [validationError, setValidationError] = useState({})

  const forgotPassword = (e) => {
    setIsLoading(true)
    e.preventDefault()
    setValidationError(validation(employeeId3))

    userServiceModule.forgotPasswordService(employeeId3).then((res) => {
      setIsLoading(false)

      if (res.status === 200) {
        toast.success(res.data.message + res.data.emailId, {
          position: toast.POSITION.TOP_RIGHT
        });
        setmessage(res.data.message)
      }

    }).catch(error => {
      setIsLoading(false)
      setmessage(" please enter a valid employee id")

    }
    )


  }
  
  return (
    isLoading ? <Loading />:

    <Card sx={{height:"93vh",width:"100vw",borderRadius:"0px",display:"flex",justifyContent:"center",alignItems:"center"}} elevation={0} className="container1">
    <Card className="screen" elevation={3}>
      <Box className="screen__content">
          <form onSubmit={forgotPassword} >
                              < Grid container >
                                  <Grid item xs={12} sx={{display:"flex",justifyContent:"center",alignContent:"center"}}>
                                      <Avatar style={{ width:"90px", height: "90px", backgroundColor: "#2196F3",borderRadius:"50%"}}>
                                          <img src={eidiko1} style={{height: "90px", width: "90px",objectFit:"scale-down"}} alt="not found"></img>
                                      </Avatar>
                                  </Grid>
                           <Grid item xs={12} sx={{display:"flex",justifyContent:"center",alignContent:"center",marginBottom: "20px"}} >
 <h3>Forgot Password </h3>
 </Grid>

 <Grid item xs={12} sx={{display:"flex",justifyContent:"center",alignContent:"center",marginBottom: "20px"}}>
 <center><Typography>Enter your employee id we'll send you a link to reset your password</Typography></center>
 </Grid>

 <Grid item xs={12}>
 <Grid container sx={{display:"flex"}}>
   <Grid item xs={12} sx={{display:"flex",justifyContent:"center",alignContent:"center"}} >
   <TextField  value={employeeId3} onChange={handlePasswordChange} name="employeeId3" id="employeeId2" placeholder="EmployeeId" label="EmployeeId" type="number" sx={{display:"flex",minWidth:"320px"}} required></TextField>
   </Grid>
 <Grid  item xs={12} sx={{display:"flex",justifyContent:"center",alignContent:"center"}} >
 <div style={{display:"flex",justifyContent:"flex-end",width:"320px"}}>
                                        <Typography onClick={()=>{navigate("/login")}} style={{ fontWeight:"bold",color:"#000", marginTop: "5px" ,cursor:"pointer"}}>Back to Login?</Typography>
                                        </div>
 
 

   </Grid>
   </Grid>
 </Grid>
 <Grid item xs={12} sx={{display:"flex",justifyContent:"center",alignContent:"center",marginBottom: "20px"}} >
 <Button  type="submit" variant="contained" style={GlobalButton.OperationButton} >Submit</Button>
 </Grid>
 <Grid item xs={12} sx={{display:"flex",justifyContent:"center",alignContent:"center",marginBottom: "20px"}}>
 {message==="password sent to your mail" ? <p style={{ color: "green", fontSize: "19px" }}>{message}</p> :<p style={{ color: "red", fontSize: "19px" }}>{message}</p>}
 </Grid>
                                 
                              </Grid>
  
                              </form>
  
  
      </Box>
      <Grid container sx={{display:"flex"}} className="screen__background">
        <Grid item xs={12}className="screen__background__shape screen__background__shape4"></Grid>
        <Grid item xs={12} className="screen__background__shape screen__background__shape3"></Grid>		
        <Grid item xs={12} className="screen__background__shape screen__background__shape2"></Grid>
        <Grid item xs={12}  className="screen__background__shape screen__background__shape1"></Grid>
      </Grid>		
    </Card>
  
              </Card>


  )



}