import { Box, Card, Grid } from '@mui/material'
import React from 'react'
import { Navigate, Outlet} from 'react-router-dom'
import userServiceModule from '../../Services/user-service/UserService'
import SideNavBar from '../../Components/Navbar/SideNavBar'


const UserRoute = () => {
   

    return userServiceModule.isLogedin()?(
        <Card elevation={0} sx={{ borderRadius:"0px",flexGrow: 1 }}>
            <Grid container >
                <Grid item xs={6} sm={12} md={2} lg={2} xl={2}  sx={{
                    // marginTop:"3px",
                    // borderRadius:"2px",
                    // backgroundColor: '#2196F3',
                    // color: '#fff',
                    display: { xs: 'none', sm: 'none', md: 'flex',lg:"flex",xl:"flex" }
                }}>
                    <Box sx={{backgroundColor: '#2196F3',color: '#fff',marginTop:"0.5vh",borderRadius:"2px"}}>
                    <SideNavBar />
                    </Box>
                   
                </Grid>

                <Grid item xs={12} sm={12} md={10} lg={10} xl={10} >
                    <Outlet />
                </Grid>
            </Grid>

        </Card>
    ) : <Navigate to='/login' />
}

export default UserRoute