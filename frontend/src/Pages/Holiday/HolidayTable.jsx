import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { HolidayService } from './HolidayService'
import { toast } from 'react-toastify'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { AddHoliday } from './AddHoliday'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { UpdateHolidays } from './UpdateHolidays'
import 'react-confirm-alert/src/react-confirm-alert.css';
import {IconButton} from '@mui/material';
import Swal from 'sweetalert2'
import { GlobalButton } from '../../Components/stylecomponent/GlobalButton'
import { hasAuthority } from '../../Services/AccessLevel/AccessLevelService'
import { NoAuth } from '../../Components/HelperComponent/NoAuth'
import Loading from '../../Components/LoadingComponent/Loading'
import { SerchingComponetsstyle } from '../../Components/stylecomponent/SerchingComponetsStyle'
import dayjs from 'dayjs'
import SearchIcon from '@mui/icons-material/Search';
import { muiDatagrid_headerclassName } from '../../Components/stylecomponent/forFirstDiv'
import { CustomToolBar } from '../../Components/DataGridDataDownload/CustomToolBar'
import CustomDatagrid from '../../Components/CustomComponents/DataGrid/CustomDatagrid'
import CustomModal from '../../Components/CustomComponents/CustomModals/CustomModal'



export const HOLIDAYLIST_FOR_ALLEMPLOYEES="HOLIDAYLIST_FOR_ALLEMPLOYEES"; 
export const HOLIDAYLIST_FOR_ALLEMPLOYEES_WITH_EDIT_BUTTON="HOLIDAYLIST_FOR_ALLEMPLOYEES_WITH_EDIT_BUTTON"; 

function getrowId(row){

  return row.holidayListId
}


export const HolidayTable = () => {
const[updateHolidayModal,setUpdateHolidayModal]=useState(false)
const [uHoliday,setUholiday]=useState([])
const handleRowClick=(params)=>{setUholiday(params.row)}
// New state to track the selected row for deletion
const [selectedRowForDeletion, setSelectedRowForDeletion] = useState(null);
const columns = [
  {
    field:'holidayDate',
    headerName:'Holiday Date',
    minWidth:100,
    flex:1.5,
    headerClassName:muiDatagrid_headerclassName,
    
  },
  {
    field:'holidayDesc',
    headerName:'Holiday Desc',
    minWidth:100,
    flex:1.5,
    headerClassName:muiDatagrid_headerclassName,
    
  },
  {
    field:'holidayYear',
    headerName:'Holiday Year',
    minWidth:100,
    flex:1.5,
    headerClassName:muiDatagrid_headerclassName,
    
  },
  {
    field:'createdBy',
    headerName:'Created By',
    minWidth:100,
    flex:1.5,
    headerClassName:muiDatagrid_headerclassName,
    // valueGetter:getEmpid
    
  },
  {
    field: 'update',
    headerName: 'Update',
    minWidth: 100,
    flex: 1,
    headerClassName: muiDatagrid_headerclassName,
    renderCell: (params) =>{
    
   return  hasAuthority(HOLIDAYLIST_FOR_ALLEMPLOYEES_WITH_EDIT_BUTTON)? (
      <Button onClick={() => {setUpdateHolidayModal(!updateHolidayModal)}}>
       <DriveFileRenameOutlineIcon  style={{color:"#0079FF"}} />
      </Button>
      
   ):null
  }}
  ,
  {
    field: 'delete',
    headerName: 'Delete',
    minWidth: 100,
    flex: 1,
    headerClassName: muiDatagrid_headerclassName,
     
      renderCell: (params) => {
        return  hasAuthority(HOLIDAYLIST_FOR_ALLEMPLOYEES_WITH_EDIT_BUTTON)? (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <IconButton variant="contained" color='error'
                 onClick={(e) => handleDeleteHoliday( params.row.holidayListId, 'delete')}
                ><DeleteOutlineIcon /></IconButton >

            </Box>
        ):null
    }

  },
]
const[isLoading,setIsLoading]=useState(false)
const[holidayDelete,setHolidadelete]=useState(false)

const handleDeleteHoliday = (holidayListId,action) => {
  setIsLoading(true)
  if(action === 'delete'){
    Swal.fire({
      icon: "warning",
      iconColor:"#d50000",
      title: 'Do you want to delete this Holiday ' + holidayListId,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#d50000'    
  })
  .then((result)=>{
    setIsLoading(false)
    if(result.isConfirmed){
      HolidayService.deleteHoliday(holidayListId)
    .then((res) => {
      setIsLoading(false)
      if (res.statusMessage === 'OK') {
        Swal.fire(' Selected Holiday Row Deleted successfully', '', 'success')
        setIsLoading(false)
       // window.location.reload()
       setHolidadelete(!holidayDelete)
    }
    else{
        Swal.fire("Holiday with following id"+holidayListId+"doesn't exist",'',"error")
        setIsLoading(false)
    }
    })

    }
  })
  
  
  };
}


const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
  update: hasAuthority(HOLIDAYLIST_FOR_ALLEMPLOYEES_WITH_EDIT_BUTTON),
  delete:hasAuthority(HOLIDAYLIST_FOR_ALLEMPLOYEES_WITH_EDIT_BUTTON) ,
  createdBy:hasAuthority(HOLIDAYLIST_FOR_ALLEMPLOYEES_WITH_EDIT_BUTTON)
});

  const[holidayState,setHolidayState]=useState([])
  const[reload,setreload]=useState(false)
  const[backButoon1,setbackButton1]=useState(false)

  const [year,setYear]=useState({"year":dayjs().format("YYYY")})
  const getYear=(e)=>{setYear({...year,[e.target.name]:e.target.value})}


  function fetchHolidays(year){
     setIsLoading(true)
    HolidayService.getHolidayListByYear(year).then((res)=>{
      if (res.statusMessage==="success") {
         setIsLoading(false)
        if(res.result.length==0){
          toast.info("No Holidays Found for given year  "+year.year,{
              position: toast.POSITION.TOP_RIGHT
          })}
          setHolidayState(res.result)
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

const[addHolidayModal,setAddHolidayModal]=useState(false)

  useEffect(()=>{
    fetchHolidays(year.year)
    setbackButton1(false)
  },[addHolidayModal,reload,updateHolidayModal,holidayDelete])
  
  const handleSearchData=(e)=>{
    e.preventDefault();
    if(year !==null)
    {
      fetchHolidays(year.year)
    }
  
  }
  return hasAuthority(HOLIDAYLIST_FOR_ALLEMPLOYEES)?  (
    isLoading?<Loading></Loading>:
    <Box sx={SerchingComponetsstyle.firstBox}>
      <Box style={SerchingComponetsstyle.SecondBox}>
        <Typography variant='h6' style={SerchingComponetsstyle.typographystyle}>HOLI DAY LIST</Typography>
        <Grid style={{justifyContent:"center"}}>

{
  hasAuthority(HOLIDAYLIST_FOR_ALLEMPLOYEES_WITH_EDIT_BUTTON)?  <Button variant='outlined' 
  startIcon={<IndeterminateCheckBoxIcon/>}
  onClick={()=>{setAddHolidayModal(!addHolidayModal)}}>ADD HOLIDAY</Button>:null
}
        </Grid>
      
      </Box>
      <GlobalButton.GlobalDivider/>

      <CustomModal modalopen={addHolidayModal}  modalclose={()=>{setAddHolidayModal(!addHolidayModal)}} children={<AddHoliday onclose={()=>{setAddHolidayModal(false)}}/>} />

      <CustomModal modalopen={updateHolidayModal}  modalclose={()=>{setUpdateHolidayModal(!updateHolidayModal)}} children={<UpdateHolidays  uHoliday={uHoliday} onclose={()=>{setUpdateHolidayModal(false)}}/>} />

        
<form onSubmit={handleSearchData}>
  <Box style={SerchingComponetsstyle.Thirdbox}>
    <Grid container style={SerchingComponetsstyle.gridContainerStyle}>
      <Grid  item xs={6} style={{display:"flex"}}>
      <TextField size='small' style={SerchingComponetsstyle.textFieldStyle} required name="year"  value={year.year} onChange={getYear} label="Year" type="number"  
        InputProps={{ inputProps: { max:9999,min:2000} }}/>
      </Grid>
      <Grid  item xs={6} style={{display:"flex",justifyContent:"flex-end"}}>
        <Button value="click" variant='outlined' type='submit'
        style={SerchingComponetsstyle.searchbuttonstyle}
        endIcon={<SearchIcon/>}
        > 
          Search</Button> 
      </Grid>
    </Grid>
  </Box>
</form>
<GlobalButton.GlobalDivider1/>
   <Box sx={SerchingComponetsstyle.DatagridBoxStyle}>
    
    
   <CustomDatagrid  
rows={holidayState} columns={columns} sortingfield={"modifiedDate"} rowclickhandle={handleRowClick}  rowId={getrowId}
CustomToolBar={CustomToolBar} columnVisibilityModel={columnVisibilityModel}
/>
    

</Box>
   </Box>
  ):<NoAuth></NoAuth>
}
