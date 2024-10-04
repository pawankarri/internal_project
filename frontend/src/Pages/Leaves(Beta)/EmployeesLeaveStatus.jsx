import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { GlobalButton } from '../../Components/stylecomponent/GlobalButton'
import dayjs from 'dayjs'
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { hasAuthority } from '../../Services/AccessLevel/AccessLevelService';
import { NoAuth } from '../../Components/HelperComponent/NoAuth';
import Loading from '../../Components/LoadingComponent/Loading';
import { SerchingComponetsstyle } from '../../Components/stylecomponent/SerchingComponetsStyle';
import { CustomToolBar } from '../../Components/DataGridDataDownload/CustomToolBar';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import moment from 'moment/moment';
import { LeavesBetaServices } from '../../Services/LeavesBeta/LeavesBetaServices';
import AutoEmpSearch from '../../Services/AutoEmpSearch/AutoEmpSearch';
import { muiDatagrid_headerclassName } from '../../Components/stylecomponent/forFirstDiv';
import CustomDatagrid from '../../Components/CustomComponents/DataGrid/CustomDatagrid';
import CustomModal from '../../Components/CustomComponents/CustomModals/CustomModal';
import LeavesAttachment from './LeavesAttachment';



export const REPORTED_MANAGER_EMPLOYEES_LEAVE_STATUS='REPORTED_MANAGER_EMPLOYEES_LEAVE_STATUS'
export const HR_VIEW_EMPLOYEES_LEAVE_STATUS='HR_VIEW_EMPLOYEES_LEAVE_STATUS'

export const EmployeesLeaveStatus = () => {
  const[statusofleave,setstatusofleave]=useState("All")
  const [rowdata1, setRowData1] = useState(null);
const[modalopen,setmodalopen]=useState(false)
const handleAttachmentsClick = (params) => {
  setRowData1(params?.row);
  setmodalopen(!modalopen)
  
  };
const columns=[
    {
        field: "empId",
        headerName: "Emp Id",
        minWidth: 100,
        flex: 1.5,
        headerClassName: muiDatagrid_headerclassName,
      }, 
      {
        field: "leaveType",
        headerName: "Leave Type",
        minWidth: 100,
        flex: 1.5,
        headerClassName: muiDatagrid_headerclassName,
      },
      {
        field: "leaveDate",
        headerName: "From Date",
        minWidth: 100,
        flex: 1.5,
        headerClassName: muiDatagrid_headerclassName,
        valueFormatter: (params) =>
          moment(params.value).format("DD/MM/YYYY"),
      },
      {
        field: 'toDate',
        headerName: 'To Date',
        minWidth: 100,
        flex: 1.5,
        headerClassName: 'table-header',
        valueFormatter: (params) => {
          const record = params.row;
          if (record && record.toDate) {
            return moment(record.toDate).format('DD/MM/YYYY');
          }
          // Handle the case where toDate is not available
        },
      },
      
      {
        field: "reason",
        headerName: "Reason",
        minWidth: 100,
        flex: 1.5,
        headerClassName: muiDatagrid_headerclassName,
      },
     
      {
        field: "createdDate",
        headerName: "Applied On",
        minWidth: 100,
        flex: 1.5,
        headerClassName: muiDatagrid_headerclassName,
      },
      
     
      { 
        field: 'status',
       headerName: ' Status', 
       minWidth: 90,
        flex:1,
        headerClassName:'table-header',
      },
      { 
        field: 'count',
       headerName: 'No Of Leave Days', 
       minWidth: 120,
        flex:1.5,
        headerClassName:'table-header',
      },
      { 
        field: 'halfDay',
       headerName: 'Half Day', 
       minWidth: 120,
        flex:1.5,
        headerClassName:'table-header',
        valueGetter: (params) => (params.row.halfDay ? 'Yes' : 'No'),
      },
      {
        field: "attachments",
        headerName: statusofleave === "approved" || statusofleave === "Declined" ? "Attachments" : "View",
        minWidth: 100,
        flex: 1.5,
        headerClassName: muiDatagrid_headerclassName,
        renderCell: (params) =>{
      
          return  (
             <Button variant='contained' size='small' style={GlobalButton.viewButton}
             onClick={() => handleAttachmentsClick(params)}>
             view</Button>
             
          )
         }
      },
]





function getrowId(row){

  return row.leavesBetaId
  }



function initial(){
  let mon1=dayjs().format("MM")
  let mon2=mon1-1;
  let mon3="0"+mon2
  return mon3
}

const[backButoon1,setbackButton1]=useState(false)
const[reload,setreload]=useState(false)
const handlefilter=()=>{
  setbackButton1(true)
}


    const[isloading, setIsLoading ]=useState(false)
    const[empId12,setEmpId12]=useState("")
   

    const [data, setData]=useState([]);
    const[records,setRecords]=useState();
     const[monthYear,setmonthYear]=useState({"month":dayjs().subtract(1, 'month').format('MM'),"year":dayjs().format("YYYY")})
    // const[monthYear,setmonthYear]=useState({"month":12,"year":dayjs().format("YYYY")})    
    const getime11=(e)=>{setmonthYear({...monthYear, [e.target.name]: e.target.value})}
    const [allReview,setAllReview]=React.useState([])
    const navigate=useNavigate()
 //AutoComplete

 const [status,setStatus]=useState(false)
 useEffect(()=>{
  AutoEmpSearch(records).then((res)=>{
    setData(res.data.result)
  })
 
    },[records])  
    function fetchLeaveStatusByEmpIdAndYear(month,year,status){
        // setSkills({...skills,skill:"",working:""})
         setIsLoading(true)
         LeavesBetaServices.getEmplyoeesLeaveStatus(month, year, status)
            .then((res) => {
              if (res.status === 200) {
                let data = res.result;
        
                // Check if data is an array and flatten if necessary
                if (!Array.isArray(data)) {
                  data = Object.values(data);
                  data = data.flat();
                }
        
                const flattenedData = data.reduce((flattened, leaveGroup) => {
                  const leaveId = leaveGroup.leaveId;
                  const leaveData = leaveGroup.leaveData;
        
                  const fromDate = moment.min(leaveData.map((record) => moment(record.leaveDate))).format('YYYY-MM-DD');
                  const toDate = moment.max(leaveData.map((record) => moment(record.leaveDate))).format('DD/MM/YYYY');
        
                  const firstRecord = leaveData[0]; // Take any record from the group
                  const leaveItem = {
                    empId: firstRecord.empId,
                    leaveType: firstRecord.leaveType,
                    leaveDate: fromDate,
                    toDate: toDate,
                    reason: firstRecord.reason,
                    createdDate: moment(firstRecord.createdDate).format('DD/MM/YYYY'),
                    leaveId: leaveId,
                    status: firstRecord.status,
                    count: firstRecord.count,
                    halfDay: firstRecord.halfDay,
                    attachments: firstRecord.attachments,
                    leavesBetaId: firstRecord.leavesBetaId,
                  };
        
                  flattened.push(leaveItem); // Push the item into the 'flattened' array
        
                  return flattened;
                }, []);
        
                setAllReview(flattenedData);
        
                if (flattenedData.length === 0) {
                  toast.info('No Records Found for the given year', {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                }
              } else {
                toast.error(res.message, {
                  position: toast.POSITION.TOP_RIGHT,
                });
              }
              setIsLoading(false);
            })
            .catch((err) => {
              toast.error(err.message, {
                position: toast.POSITION.TOP_RIGHT,
              });
              setIsLoading(false);
            });
        }
       

        const[rowdata,setrowdata]=useState([])
        const handlerowclick=(params)=>{
          let arr=[]
          arr.push(params?.row)
        setrowdata(arr)

        if(params?.row?.status==="pending"){
          setmodalopen(false)
          navigate("../pending-leaves",{state:params.row})
        }

        }
        
    function fetchLeaveStatusByMonthAndYear(month,year,statusofleave1){
         setIsLoading(true)
         //setmonthYear({...monthYear,month:initial()})
        //const api=hasAuthority(HR_VIEW_EMPLOYEES_LEAVE_STATUS) ? LeavesBetaServices.getEmplyoeesLeaveStatus:LeavesBetaServices.getEmplyoeesLeaveStatusForRm(month,year,statusofleave1)
        
    
        
        LeavesBetaServices.getEmplyoeesLeaveStatusForRm(month, year, statusofleave1)
            .then((res) => {
              if (res.status === 200) {
                let data = res.result;
        
                // Check if data is an array and flatten if necessary
                if (!Array.isArray(data)) {
                  data = Object.values(data);
                  data = data.flat();
                }
        
                const flattenedData = data.reduce((flattened, leaveGroup) => {
                  const leaveId = leaveGroup.leaveId;
                  const leaveData = leaveGroup.leaveData;
        
                  const fromDate = moment.min(leaveData.map((record) => moment(record.leaveDate))).format('YYYY-MM-DD');
                  const toDate = moment.max(leaveData.map((record) => moment(record.leaveDate))).format('DD/MM/YYYY');
        
                  const firstRecord = leaveData[0]; // Take any record from the group
                  const leaveItem = {
                    empId: firstRecord.empId,
                    leaveType: firstRecord.leaveType,
                    leaveDate: fromDate,
                    toDate: toDate,
                    reason: firstRecord.reason,
                    createdDate: moment(firstRecord.createdDate).format('DD/MM/YYYY'),
                    leaveId: leaveId,
                    status: firstRecord.status,
                    count: firstRecord.count,
                    halfDay: firstRecord.halfDay,
                    attachments: firstRecord.attachments,
                    leavesBetaId: firstRecord.leavesBetaId,
                  };
        
                  flattened.push(leaveItem); // Push the item into the 'flattened' array
        
                  return flattened;
                }, []);
        
                setAllReview(flattenedData);
        
                if (flattenedData.length === 0) {
                  toast.info('No Records Found for the given year', {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                }
              } else {
                toast.error(res.message, {
                  position: toast.POSITION.TOP_RIGHT,
                });
              }
              setIsLoading(false);
            })
            .catch((err) => {
              toast.error(err.message, {
                position: toast.POSITION.TOP_RIGHT,
              });
              setIsLoading(false);
            });
        }

    const [load,setLoad]=useState(false)

    console.log(modalopen);

    React.useEffect(()=>{

      if(hasAuthority(HR_VIEW_EMPLOYEES_LEAVE_STATUS)){
        fetchLeaveStatusByEmpIdAndYear(monthYear.month,monthYear.year,statusofleave)
      }
else{

  fetchLeaveStatusByMonthAndYear(monthYear.month,monthYear.year,statusofleave)
}
      
// fetchMonthlyYearlyRating()
setbackButton1(false)
        setLoad(false)

        // return()=>{
        //     setAllReview([])
        // }

    },[load,reload])


    const [selectionMode, setSelectionMode] = useState('Month'); 


const handleSerchData = (e) => {

e.preventDefault()

if(hasAuthority(HR_VIEW_EMPLOYEES_LEAVE_STATUS)){
  fetchLeaveStatusByEmpIdAndYear(monthYear.month,monthYear.year,statusofleave)
}
else{

  fetchLeaveStatusByMonthAndYear(monthYear.month,monthYear.year,statusofleave)
}

};



 
    return hasAuthority(REPORTED_MANAGER_EMPLOYEES_LEAVE_STATUS)? (
      isloading?<Loading></Loading>:
        <Box style={SerchingComponetsstyle.firstBox}>
            <Box style={SerchingComponetsstyle.SecondBox}>
         <Typography variant='h6' style={SerchingComponetsstyle.typographystyle}>
            ALL EMPLOYEES LEAVE STATUS</Typography>
            {
  backButoon1 ?<Button variant='outlined' 
  onClick={()=>{setreload(!reload);setmonthYear({"month":initial(),"year":dayjs().format("YYYY")})}}
  startIcon={<ArrowBackIosNewIcon/>}>
back
 </Button>:null
}
             </Box>
<GlobalButton.GlobalDivider/>


<form onSubmit={handleSerchData}>
    <Box   style={SerchingComponetsstyle.Thirdbox}>
   
<Grid container style={SerchingComponetsstyle.gridContainerStyle}>
      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}  >
<FormControl style={SerchingComponetsstyle.FormControlstyle}>
<InputLabel id="demo-multiple-name-label">Month</InputLabel>
        <Select 
        size='small'
       value={monthYear.month}
         onChange={getime11}
          labelId="demo-multiple-name-label"
          id="demo-multiple-start"
          name="month"
          label="Month"
        >
          <MenuItem value="12">All</MenuItem>
          <MenuItem value="00" >Jan</MenuItem>
          <MenuItem value="01" >Feb</MenuItem>
          <MenuItem value="02" >Mar</MenuItem>
          <MenuItem value="03" >April</MenuItem>
          <MenuItem value="04" >May</MenuItem>
          <MenuItem value="05" >June</MenuItem>
          <MenuItem value="06" >July</MenuItem>
          <MenuItem value="07" >Aug</MenuItem>
          <MenuItem value="08" >Sept</MenuItem>
          <MenuItem value="09" >Oct</MenuItem>
          <MenuItem value="10" >Nov</MenuItem>
          <MenuItem value="11" >Dec</MenuItem>
                                      
        </Select>
      </FormControl>
      
           
        </Grid >
       
       
        <Grid item xs={3} sm={3} md={3} lg={3} xl={3} style={SerchingComponetsstyle.griditemstyle}>
 <TextField size='small'  style={SerchingComponetsstyle.textFieldStyle} required name="year"  value={monthYear.year} onChange={getime11} label="Year" type="number"  
        InputProps={{ inputProps: { max:9999,min:2000} }}></TextField>
        </Grid >
        <Grid item xs={3} sm={3} md={3} lg={3} xl={3} style={SerchingComponetsstyle.griditemstyle}>
 <FormControl style={SerchingComponetsstyle.FormControlstyle}>
<InputLabel id="demo-multiple-name-label">status</InputLabel>
        <Select 
        size='small'
       value={statusofleave}
         onChange={(e)=>{setstatusofleave(e.target.value)}}
          labelId="demo-multiple-name-label"
          id="demo-multiple-start"
          name="month"
          label="Month"
        >
           <MenuItem value="All" >All</MenuItem>
          <MenuItem value="pending" >pending</MenuItem>
          <MenuItem value="approved" >approved</MenuItem>
          <MenuItem value="Declined" >rejected</MenuItem>
          
                                      
        </Select>
      </FormControl>
        </Grid >



       
         <Grid item xs={3} sm={3} md={3}  lg={3} xl={3} style={SerchingComponetsstyle.griditemserchstyle}>
            <Button value="click" variant='outlined' type='submit'
            style={SerchingComponetsstyle.searchbuttonstyle} endIcon={<SearchIcon/>}>
            search
                </Button>
                </Grid> 
                 
      </Grid>
 
    </Box>

    </form>
<GlobalButton.GlobalDivider1></GlobalButton.GlobalDivider1>


<Box style={SerchingComponetsstyle.DatagridBoxStyle}>

<CustomDatagrid rows={allReview} CustomToolBar={CustomToolBar} rowId={getrowId} 
columns={columns} sortingfield={"leaveDate"} 
rowclickhandle={handlerowclick} filterchangehandle={handlefilter}></CustomDatagrid>

   
   </Box>

<CustomModal  modalopen={modalopen} modalclose={()=>{setmodalopen(!modalopen)}} children={<LeavesAttachment attachmentData={rowdata1}/>}>
</CustomModal>


        
        </Box>
    ):<NoAuth></NoAuth>
}
