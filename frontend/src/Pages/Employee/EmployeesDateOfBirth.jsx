import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Button, Input, Card } from "@mui/material";
import { toast } from "react-toastify";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Loading from "../../Components/LoadingComponent/Loading";
import upload from "../../images/upl.png";
import { baseUrl } from "../../Server/baseUrl";
import { hasAuthority } from "../../Services/AccessLevel/AccessLevelService";
import { NoAuth } from "../../Components/HelperComponent/NoAuth";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { GlobalButton } from '../../Components/stylecomponent/GlobalButton';
import axios from 'axios';
import { Dropzone } from '@mantine/dropzone';
import { SerchingComponetsstyle } from '../../Components/stylecomponent/SerchingComponetsStyle';

export const  EMPLOYEES_DATE_OF_BIRTH_UPLOAD= " DATE_OF_BIRTH_UPLOAD"

export default function EmployeesDateOfBirth() {
  const [dob, setDob] = useState([]);
  const [isloading, setisLoading] = useState(false);

  const fileHandler = (file) => {
    setDob(file[0]);
  }

  const fileDataSubmit = (e) => {
    e.preventDefault();
    setisLoading(true);

    if (dob.length === 0) {
      toast.info("Please select a file to upload", { position: toast.POSITION.TOP_RIGHT });
      setisLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("file", dob);

    axios({
      method: "put",
      url: `${baseUrl}/employee/update-dob`,
      data: form,
      headers: { "Content-Type": 'multipart/form-data', "Authorization": 'Bearer ' + token },
    }).then((res) => {
      if (res.status === 200 && res.data.statusMessage === "success") {
        setisLoading(false);
        toast.success(res.data.message, { position: toast.POSITION.TOP_RIGHT });
        setDob("");
      } else if (res.status === 200 && res.data.status === 400) {
        setisLoading(false);
        toast.info(res.data.message, { position: toast.POSITION.TOP_RIGHT });
      } else {
        setisLoading(false);
        toast.error(res.data.message, { position: toast.POSITION.TOP_RIGHT });
      }
    }).catch((error) => {
      setisLoading(false);
      toast.error(error.response.data.message, { position: toast.POSITION.TOP_RIGHT });
    });
  }

  return hasAuthority(EMPLOYEES_DATE_OF_BIRTH_UPLOAD)?(
    isloading ? <Loading></Loading> :
      <Box sx={{height:"90vh",padding:"10px",overflow:"auto",display:"flex",justifyContent:"center",alignContent:"center",alignItems:"center"}}>
       
        
    
  
              <Card  sx={{width:"450px",padding:"20px"}}>
              <form onSubmit={fileDataSubmit}  encType="multipart/form-data">
                <Grid sx={{ display: "flex" }} container spacing={1.2} style={{display:"flex",justifyContent:"center",alignContent:"center",alignItems:"center"}}>
                 
                <Grid item xs={12} style={{display:"flex",justifyContent:"center",alignContent:"center",alignItems:"center"}}>
           <Typography style={SerchingComponetsstyle.typographystyle}>EMPLOYEES DOB UPLOAD</Typography>
           </Grid>
                 
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Dropzone id="file-upload" maxFiles={3} multiple={true} loading={false} value={dob} onDrop={fileHandler}>
                      <Grid container style={{ height: "25vh", minWidth: "300px" }}>
                        <Grid item xs={12} sx={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                          <Typography align="center">Drag or click here to select files</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                          <img style={{ width: "150px", height: "auto" }} src={upload} alt="Upload" />
                        </Grid>
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                          <Button variant="outlined">Select File</Button>
                        </Grid>
                      </Grid>
                    </Dropzone>
                  </Grid>
                  <Grid item xs={12} sx={{
                    display: 'flex', justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Button endIcon={<FileUploadOutlinedIcon />} type="submit" sx={{ marginBottom: "10px" }} style={GlobalButton.OperationButton} variant='contained'>Upload</Button>
                  </Grid>
                </Grid>


                {dob.length === 0 ? null : <Grid item xs={12} sx={{
            display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center", marginLeft: "55px", marginTop: "15px"
          }}>
            <Input disabled id="uploadFile" value={dob?.path}></Input>
            <Button onClick={(e) => { setDob([]) }} type="reset"><ClearOutlinedIcon style={{ color: "red" }} /></Button>
          </Grid>}
          </form>
              </Card>

         

       
      </Box>
  ):<NoAuth></NoAuth>
}
