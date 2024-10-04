import { Grid, TextField, Button, Avatar, Typography, Card, Box } from "@mui/material";
import eidiko1 from '../../images/eidiko1.jpg';
import { useState } from "react";
import { useNavigate } from "react-router";
import validation from "../../Error/LoginErrorHandler";
import passwordErrorHandler from "../../Error/passwordErrorHandler";
import userServiceModule from "../../Services/user-service/UserService";
import Loading from "../../Components/LoadingComponent/Loading";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./Form1.css"



export default function Login() {



    const grid2 = { height: "500px", width: "500px", backgroundColor: "#2196F3" }
    const grid3 = { height: "500px", width: "500px", backgroundColor: "FFFFFF", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", verticalAlign: "middle" }
    const button1 = { backgroundColor: "#2196F3", color: "white", minWidth:"40%",width: "auto", borderRadius: "20px", marginTop: "20px", display: "flex",
    boxShadow: "rgba(12, 197, 21, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"
}


    const [employeeId, setEmployeeId] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")
    const [isloading, setIsLoading] = useState(false)


    const navigate = useNavigate()
    const [validationError, setValidationError] = useState({})
    const [validationError1, setValidationError1] = useState({})


    const HandleEmployeeId = (e) => {

        setEmployeeId(e.target.value)
    }
    const HandlePassword = (e) => {
        setPassword(e.target.value)
    }
    const loginHandle = (e) => {
        e.preventDefault();
        setIsLoading(true)
        setValidationError(validation(employeeId))

        setValidationError1(passwordErrorHandler(password))

        userServiceModule.logService(employeeId, password).then((res) => {
            
           
            if (res.status === 200) {
                setIsLoading(false)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'login succesfull | redirecting to dashboard',
                    showConfirmButton: false,
                    timer: 1500
                })
                navigate("/user/profile")
            }
            else {
                setIsLoading(false)
                setError("Please enter valid userId or password")
                toast.error(res.message,{position:toast.POSITION.TOP_RIGHT})
                //navigate("/login")
            }


        }).catch(error => {
            setIsLoading(false)
            toast.error(error.response.data.message,
            {
                position: toast.POSITION.TOP_RIGHT
              }
            )

        })

    }







    return (


        isloading ? <Loading /> :
    <Card sx={{height:"93vh",width:"100vw",borderRadius:"0px",display:"flex",justifyContent:"center",alignItems:"center"}} elevation={0} className="container1">
	<Card className="screen" elevation={3}>
		<Box className="screen__content">
        <form onSubmit={loginHandle} >
                            < Grid container >
                                <Grid item xs={12} sx={{display:"flex",justifyContent:"center",alignContent:"center"}}>
                                    <Avatar style={{ width:"90px", height: "90px", backgroundColor: "#2196F3",borderRadius:"50%"}}>
                                        <img src={eidiko1} style={{height: "90px", width: "90px",objectFit:"scale-down"}} alt="not found"></img>
                                    </Avatar>
                                </Grid>

                                <Grid item xs={12} sx={{display:"flex",justifyContent:"center",alignContent:"center",mt:"10px"}}>
                                    <h3>Login</h3>
                                </Grid>

                               

                                    <Grid item xs={12} sx={{display:"flex",justifyContent:"center",alignContent:"center",mt:"20px"}}>

                                        <TextField  value={employeeId} onChange={HandleEmployeeId} id="employeeId1" label="Employee Id" name="Employeeid" type="number" max="4" placeholder="EmployeeId" sx={{width:"300px",borderRadius: "20px" }} required></TextField>
                                    </Grid>
                                    {validationError.name && <p style={{ color: "red", fontSize: "15px" }}>{validationError.name}</p>}



                                    <Grid item xs={12} sx={{display:"flex",justifyContent:"center",alignContent:"center",mt:"20px"}}>

                                        <TextField value={password} onChange={HandlePassword} sx={{ width:"300px",borderRadius: "20px" }} id="password1" label="Password" name="password" type="password" placeholder="Password"  required

                                        ></TextField>

                                    </Grid>
                                    {validationError1.name && <Typography variant="h5" style={{ color: "red", fontSize: "15px" }}>{validationError1.name}</Typography>}


                                    <Grid item xs={12} style={{display:"flex",justifyContent:"center"}}
                                    >
                                        <div style={{display:"flex",justifyContent:"flex-end",width:"300px"}}>
                                        <Typography onClick={()=>{navigate("/forgot-password")}} style={{ fontWeight:"bold",color:"#000", marginTop: "5px" ,cursor:"pointer"}}>Forgot Password?</Typography>
                                        </div>
                                        

                                    </Grid>

                                    <Grid item xs={12} sx={{display:"flex",justifyContent:"center",alignContent:"center"}}>
                                        <Button  disableElevation id="loginbutton" variant="contained" style={button1} type="submit">login</Button>
                                    </Grid>

                                    <p style={{ color: "red", fontSize: "19px" }}>{error}</p>
                               
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

    );

}