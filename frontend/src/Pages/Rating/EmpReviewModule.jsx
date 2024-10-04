import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { GlobalButton } from '../../Components/stylecomponent/GlobalButton'
import SearchIcon from '@mui/icons-material/Search';
import { RatingServiceModule } from '../../Services/Rating-Services/RatingServiceModule';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { helpFunction } from '../../Components/HelperComponent/helpFunction';
import Loading from "../../Components/LoadingComponent/Loading"
import { hasAuthority } from '../../Services/AccessLevel/AccessLevelService';
import { NoAuth } from '../../Components/HelperComponent/NoAuth';
import { SerchingComponetsstyle } from '../../Components/stylecomponent/SerchingComponetsStyle';
import {Delete } from '@mui/icons-material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { EmpRatingUpdateModal } from './EmpRatingUpdateModal';
import Swal from 'sweetalert2';
import { muiDatagrid_headerclassName } from '../../Components/stylecomponent/forFirstDiv';
import CustomDatagrid from '../../Components/CustomComponents/DataGrid/CustomDatagrid';
import CustomModal from "../../Components/CustomComponents/CustomModals/CustomModal"



function getempnameid(params) {
  return params.row?.empId+" -"+params.row?.empName
}
function getreviewedid(params) {
  return params.row?.reviewedBy+" -"+params.row?.reviewedByName
}

function getrowId(row){

  return row.empRatingId
}






export const PARTUCULAR_EMPLOYEE_REVIEW_RATING_TABLE_TITLE="PARTUCULAR_EMPLOYEE_REVIEW_RATING_1"
export const EMPLOYEE_RATING_EDIT_DELETE_OPTION_PAGE_TITLE="EMPLOYEE_RATING_EDIT_DELETE_44"


export const EmpReviewModule = (props) => {
 


  const columns=[
    { 
        field: 'empidwithname',
       headerName: 'Employee Name', 
       minWidth: 200,
        flex:2.5,
       headerClassName:muiDatagrid_headerclassName,
       valueGetter:getempnameid
     
      },  
      { 
        field: 'month',
       headerName: 'Month', 
       minWidth: 90,
        flex:1,
        headerClassName:muiDatagrid_headerclassName,
        renderCell: (params) => {
      return helpFunction.MonthShowing2(params.formattedValue)
     
     }
      },
      { 
        field: 'year',
       headerName: 'Year', 
       width: 200,
        flex:1,
        headerClassName:muiDatagrid_headerclassName,
      },
      { 
        field: 'technology',
       headerName: 'Technology', 
       minWidth: 150,
        flex:1.5,
        headerClassName:muiDatagrid_headerclassName,
      },
      { 
        field: 'technicalRating',
       headerName: 'Technical Rating', 
       minWidth: 90,
        flex:1,
        headerClassName:muiDatagrid_headerclassName,
      },
      { 
        field: 'communicationRating',
       headerName: 'Communication Rating', 
       minWidth: 90,
        flex:1,
        headerClassName:muiDatagrid_headerclassName,
      },
      { 
        field: 'remarks',
       headerName: 'Remarks', 
       minWidth: 120,
        flex:1.5,
        headerClassName:muiDatagrid_headerclassName,
      },
      { 
        field: 'reviewedBywithname',
       headerName: 'Review By', 
       minWidth: 200,
        flex:2.5,
        headerClassName:muiDatagrid_headerclassName,
        valueGetter:getreviewedid
      },
      {
        field: 'edit',
        headerName: 'Edit',
        minWidth: 90,
        flex:1.5,
        headerClassName: muiDatagrid_headerclassName,
        renderCell: (params) => {


            return hasAuthority(EMPLOYEE_RATING_EDIT_DELETE_OPTION_PAGE_TITLE) ?(
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <IconButton variant="contained" color='error'
                    >
                   <EditOutlinedIcon 
                   onClick={handleRmOpen}
                    color='secondary' sx={{marginRight:"39px"}}/>
                   </IconButton >
    
                </Box>
                
            ):null
        }
    },
      {
        field: 'actions',
        headerName: 'Actions',
        minWidth: 80,
        flex:1.5,
        headerClassName: muiDatagrid_headerclassName,
        renderCell: (params) => {

            return hasAuthority(EMPLOYEE_RATING_EDIT_DELETE_OPTION_PAGE_TITLE)?
             (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <IconButton variant="contained" color='error'
                         onClick={(e) =>{ onButtonClick(e, params.row, 'delete')}}
                    ><Delete /></IconButton >

                </Box>
            ):null
              }   
    },
    



]
const[empRatingData,setEmpRatingData]=useState()
const rowHandle =(params)=>{
  setEmpRatingData(params.row)
}
const [empskilldata1,setempskilldata1]=useState()

  const [reviewM,setReviewM]=useState(false)
const handleRmOpen=()=>{
  setReviewM(true)

}
const [reportm,setreportm]=useState(false)
  const location=useLocation();
const queryParams= new URLSearchParams(location.search);
const param1Value=queryParams.get('empId');
const param2Value=queryParams.get('empName');
const param3Value=queryParams.get('year')
console.log(param3Value);
const {state}=useLocation(props.state)
const [empId1,setEmpId1]=useState(param1Value)

    const[monthYear,setmonthYear]=useState(param3Value?param3Value:new Date().getFullYear())
    const getime11=(e)=>{setmonthYear(e.target.name)}
    const [empReview,setEmpReview]=React.useState([])


// const[empId1,setEmpId1]=useState(state)
const[empId2,setempid2]=useState(localStorage.getItem("id"))

const[isloading,setIsLoading]=useState(false)


  function fetchEmpReviewData(empId1,monthYear){
setIsLoading(true)
      RatingServiceModule.getEmpReviewRating(empId1,monthYear).then((res)=>{
        if(res.status===200){
           setIsLoading(false)
          if(res.result.length==0){
            toast.info("No Records Found  for "+empId1+ "  for given year  "+monthYear,{
                position: toast.POSITION.TOP_RIGHT
            })}
            setEmpReview(res.result)
        }
        else{
           setIsLoading(false)
          toast.error(res.message, {
            position: toast.POSITION.TOP_RIGHT
        })
        }
    
      }).catch((err)=>{
    
       setIsLoading(false)
      toast.error(err.message, {
        position: toast.POSITION.TOP_RIGHT
    })
    
      })

        
    }

  function fetchEmpReviewData1(empId2,monthYear){
    setIsLoading(true)
    RatingServiceModule.getEmpReviewRating(empId2,monthYear).then((res)=>{
      if(res.status===200){
         setIsLoading(false)
        if(res.result.length==0){
          toast.info("No Records Found  for "+empId2+ "  for given year  "+monthYear,{
              position: toast.POSITION.TOP_RIGHT
          })}
          setEmpReview(res.result)
      }
      else{
         setIsLoading(false)
        toast.error(res.message, {
          position: toast.POSITION.TOP_RIGHT
      })
      }
  
    }).catch((err)=>{
  
    setIsLoading(false)
    toast.error(err.message, {
      position: toast.POSITION.TOP_RIGHT
    })
  })
  }





const[load,setLoad]=useState(false)

const history=useNavigate()
const handleGoBack = () =>{
history(-1);
setLoad(true)
}
  
    React.useEffect(()=>{
      if(empId1!==null){
        fetchEmpReviewData(empId1,param3Value)
      }
      else{
        fetchEmpReviewData1(empId2,monthYear)
      }
      setLoad(false)
    },[load,reviewM])
    
     const handleSerchData=()=>{
      if(monthYear!==null && empId1!==null){
        fetchEmpReviewData(empId1,monthYear)
      }
      else if(monthYear!==null && empId2 !==null){
        fetchEmpReviewData1(empId2,monthYear)
      }
      else{
        toast.error("Please Enter Month and Year",{
          position:toast.POSITION.TOP_RIGHT
        })
      }
     }

 ////////////////////////////////////////////for deletion///////////////////////////////////////////
 
 const onButtonClick = (e, row, action) => {
  e.stopPropagation();
  e.preventDefault();
  if (action === 'delete') {
        
      Swal.fire({
          icon: "warning",
          iconColor:"#d50000",
          title: 'Do you want to delete this ' + row.empRatingId,
          showCancelButton: true,
          confirmButtonText: 'Delete',
          confirmButtonColor: '#2196F3',
          cancelButtonColor: '#d50000'

          
      })

      .then((result) => {
          if (result.isConfirmed) {
              RatingServiceModule.deleterating(row.empRatingId).then((res)=>{
              
                  if(res.status===200){
                      Swal.fire('Deleted!', '', 'success')
                      window.location.reload()
                  }
                  else{
                      Swal.fire("Review  doesn't exist",'',"error")
                  }
              })
              
          }
      })
  }
};
  

const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
  edit: hasAuthority(EMPLOYEE_RATING_EDIT_DELETE_OPTION_PAGE_TITLE),
  actions:hasAuthority(EMPLOYEE_RATING_EDIT_DELETE_OPTION_PAGE_TITLE) ,
});






    return hasAuthority(PARTUCULAR_EMPLOYEE_REVIEW_RATING_TABLE_TITLE)? ( isloading?<Loading></Loading>:
        
        <Box style={SerchingComponetsstyle.firstBox}>
             <Box style={SerchingComponetsstyle.SecondBox}>

{
   param2Value!==null? <Typography variant='h6' style={SerchingComponetsstyle.typographystyle}>REVIEW'S OF <span style={{color:"black"}}>{ param2Value}</span></Typography>
: <Typography variant='h6' style={SerchingComponetsstyle.typographystyle}> EMPLOYEE REVIEW</Typography>
  }
               
                
            </Box>
            <GlobalButton.GlobalDivider/>

{/* -------------------------------------------------- */}
            <form onSubmit={handleSerchData}>
                <Box style={SerchingComponetsstyle.Thirdbox}>
                <Grid container style={SerchingComponetsstyle.gridContainerStyle}>
        <Grid item xs={6} >
 <TextField size='small' style={SerchingComponetsstyle.textFieldStyle} required name="year"  value={monthYear} onChange={(e)=>setmonthYear(e.target.value)} label="Year" type="number"  
        InputProps={{ inputProps: { max:9999,min:2000} }}></TextField>
        </Grid >


       
         <Grid item xs={6} style={SerchingComponetsstyle.griditemserchstyle}  >
            <Button value="click" variant='outlined' type='submit'
                 style={SerchingComponetsstyle.searchbuttonstyle}  endIcon={<SearchIcon/>}>
            search
                </Button>
                </Grid> 
                 
      </Grid>

                </Box>
            </form>
        
<GlobalButton.GlobalDivider1/>
{/* -------------------------------------------------------------- */}
<Box style={SerchingComponetsstyle.DatagridBoxStyle}>
<CustomDatagrid columnVisibilityModel={columnVisibilityModel}  
rows={empReview} columns={columns} sortingfield={"month"} rowclickhandle={rowHandle} rowId={getrowId}
/>

</Box>

<CustomModal modalopen={reviewM}  modalclose={()=>{setReviewM(!reviewM)}} children={ <EmpRatingUpdateModal skilldata2={empRatingData} onClose1={()=>{setReviewM(false)}}/>} />

        </Box>
    ):<NoAuth></NoAuth>

}
