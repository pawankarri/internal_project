import React, { useState } from 'react';
import logo from '../images/eidiko_logo_bg_less.png'
import cake from '../images/cake_bg.png'
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import { baseUrl } from '../Server/baseUrl';
import Reactconfeti from '../Components/Navbar/Reactconfeti';

const Birthday = ({ birthday, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1; 
  const isLastPage = currentPage === birthday.length - 1;
  const shouldShowNextButton = birthday.length > 1;
  const isFirstPage = currentPage === 0;
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage -1);
  };
  
  return (
    <>
 <Reactconfeti></Reactconfeti>

      {birthday?.map((item, index) => {
        if (index !== currentPage) {
          return null; // Skip rendering items that are not on the current page
        }

        return (

          
          <div
            style={{
              height: "100vh",
              width: "100vw",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center"
            }}
            key={item.empId}
          >
            <Box sx={{ display: "flex",backgroundColor:'#BED8FB', width: "600px" }}>
              {/* <Button
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#c1cee6',
                  color: 'red'
                }}
                onClick={() => {
                  onClose(); // Add code to close the card here
                }}
              >
                X
              </Button> */}

              <div style={{ height: "400px", width: "200px" }}>
                <div style={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                  <div style={{ width: '200px', height: '320px', marginTop: "50px" }}>
                    <img style={{ width: '200px', height: '320px' }} src={cake} alt="Cake" />
                  </div>
                </div>
              </div>

              <div style={{ height: "400px", width: "400px" }}>
                <Grid container style={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                  <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end", alignContent: "center", alignItems: "center" }}>
                    <div style={{ height: "100px" }}>
                      <img style={{ height: "100px" }} src={logo} alt="Logo" />
                    </div>
                  </Grid>
                  <Grid item xs={12} style={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                    <div>
                      <Avatar src={`${baseUrl}/employee/load-profile-pic/${item?.empId}`} sx={{ width: '100px', height: '100px' }} />
                    </div>
                  </Grid>
                  <Grid item xs={12} style={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center", marginTop:'10px' }}>
                    <div>
                    
                      <Typography style={{ fontWeight: 'bold',fontSize:'large' }}>{item?.empName}</Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} style={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center", marginTop:'10px'}}>
                    <h5 style={{ fontWeight: 'bold' }}>"We wish you an amazing year that ends<br/>with accomplishing all the great goals<br/>that you have set!"</h5>
                  </Grid>
                  
 
    <Grid item xs={12} style={{display:"flex",justifyContent:"center",alignContent:"center",alignItems:"center",marginTop:'30px'}}>
  
   { !isFirstPage ? (
                <Button variant="contained"
                  style={{
      //               position: 'realtive',
      // bottom: '-70px', 
      // right: '100px', 
      backgroundColor: '#c1cee6',
      color: 'red'
                  }}
                  onClick={handlePreviousPage}
                >
                  Previous
                </Button>
              ) : null}
  
  
  {shouldShowNextButton && !isLastPage ? (
                <Button variant="contained"
                  style={{
      //               position: 'realtive',
      // bottom: '-70px', 
      // right: '-90px', 
      backgroundColor: '#c1cee6',
      color: 'red',
      marginLeft:'20px'
                  }}
                  onClick={handleNextPage}
                >
                  Next
                </Button>
              ) : null}
              
              <Button variant="contained"
                  style={{
      
      backgroundColor: '#c1cee6',
      color: 'red',
      marginLeft:'20px'
                  }}
                  onClick={() => {
                    onClose(); 
                  }}
                >
                  close
                </Button>


       </Grid>      
  </Grid>
                
              </div>
            </Box>
          </div>
          
        );
      })}
     
    </>
  );
}

export default Birthday;
