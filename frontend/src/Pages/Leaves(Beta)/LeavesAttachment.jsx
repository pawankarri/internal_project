import React, { useEffect, useState } from 'react';
import { LeavesBetaServices } from '../../Services/LeavesBeta/LeavesBetaServices';
import { Box, Card } from '@mui/material';
import { toast } from 'react-toastify';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import "./docviewer.css"



export default function LeavesAttachment({ attachmentData }) {

  const [fileType, setFileType] = useState(null);
  const [fileData, setFileData] = useState('');
  const [Datauri,setDataUri]=useState([])

console.log(Datauri);
 function getUrl(){

  for(let i=0;i<attachmentData.attachments.split(',').length;i++){

    LeavesBetaServices.getUploadedAttachments(attachmentData.attachments.split(',')[i])
    
      .then((res) => {


        if (res.status === 'OK' || res.status==200) {
          
            if (res?.fileExtension==='pdf') {
             
              setDataUri((t)=>{
              
                return [...t,{uri:`data:application/pdf;base64,${res.result}`,fileName:"Pdf"}]
              })
            } 
            
            else if (res?.fileExtension==='jpg' || res?.fileExtension==='jpeg') {
              
              setDataUri((t)=>{
              
                return [...t,{uri:`data:image/jpeg;base64,${res.result}`,fileName:"Image"}]
              })

            } 
            
            else if (res?.fileExtension==="png") {
             
              setDataUri((t)=>{
              
                return [...t,{uri:`data:image/png;base64,${res?.result}`,fileName:"Image"}]
              })
             
             
            }

            // Handle the loaded file data as needed (e.g., display, save, etc.)
            console.log(`Loaded ${fileType} file:`, fileData);
          } else {
            toast.error('Unsupported file type', {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
      )
      .catch((err) => {
        toast.error(err.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  }

 
  
}


useEffect(() => {
  if (attachmentData && attachmentData.attachments) {
    getUrl();
  }
}, [attachmentData]);


 function loaddata(filename) {

    let url="bmmm"

    LeavesBetaServices.getUploadedAttachments(filename)
      .then((res) => {
        if (res.status === 'OK') {
          const fileExtension = res.fileExtension || '';
          const supportedExtensions = ['pdf', 'jpeg', 'jpg', 'png'];

          if (supportedExtensions.some((ext) => fileExtension.endsWith(ext))) {
           

            if (fileExtension.endsWith('pdf')) {
              fileType = 'pdf';
              url = `data:application/pdf;base64,${res.result}`;
            } else if (fileExtension.endsWith('jpeg') || fileExtension.endsWith('jpg')) {
              fileType = 'image';
              url= `data:image/jpeg;base64,${res.result}`;
            } else if (fileExtension.endsWith('png') || fileExtension.endsWith('gif')) {
              fileType = 'image';
              url = `data:image/png;base64,${res.result}`;
            }

            // Handle the loaded file data as needed (e.g., display, save, etc.)
            console.log(`Loaded ${fileType} file:`, fileData);
          } else {
            toast.error('Unsupported file type', {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
      })
      .catch((err) => {
        toast.error(err.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
      return url
  };

if (!attachmentData || !attachmentData.attachments || attachmentData.attachments.trim() === '') {
    return (
      <Card
        sx={{
          minWidth: '630px',
          minHeight: '500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
         
        }}
      >
        <p>No attachments available.</p>
      </Card>
    );
  }

  return (



    <Card
  
   
      sx={{
        minWidth: '630px',
        minHeight: '500px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box className='docclass'></Box>
      <DocViewer    theme={{primary: "#5296d8"}} documents={Datauri}  pluginRenderers={DocViewerRenderers} style={{height:"600px",width:"600px",backgroundImage:'none'}}>

      </DocViewer>
     
    </Card>
  );
}
