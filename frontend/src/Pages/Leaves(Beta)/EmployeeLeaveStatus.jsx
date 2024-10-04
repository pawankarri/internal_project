import { Box, Button, Card, FormControl, Grid, InputLabel, Modal, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-confirm-alert/src/react-confirm-alert.css';
import { GlobalButton } from '../../Components/stylecomponent/GlobalButton'
import Loading from '../../Components/LoadingComponent/Loading'
import { SerchingComponetsstyle } from '../../Components/stylecomponent/SerchingComponetsStyle'
import { LeavesBetaServices } from '../../Services/LeavesBeta/LeavesBetaServices'
import moment from 'moment/moment'
import { muiDatagrid_headerclassName } from '../../Components/stylecomponent/forFirstDiv'
import CustomDatagrid from '../../Components/CustomComponents/DataGrid/CustomDatagrid'
import { LeaveServices } from '../../Services/Leave-Service/LeaveServices'
import CustomModal from '../../Components/CustomComponents/CustomModals/CustomModal';
import EmployeeDeletePendingLeave from './EmployeeDeletePendingLeave';
import {IconButton} from '@mui/material';
import { Delete } from '@mui/icons-material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Swal from 'sweetalert2';
import { baseUrl } from '../../Server/baseUrl';
import axios from 'axios';

function getrowId(row){

  return row.leaveId
  }
 
 

function getCountsOfLeave(leaves){

let SL={SL:0}
let CL={CL:0}
let ML={ML:0}
let LOP={LOP:0}
let A={A:0}
let L={L:0}


  leaves.map((item)=>{
    if(item?.status==="Approved" || item?.status==="pending" ){
      if(item?.leaveType==="SL" && item?.halfDay===false){
        SL.SL=SL.SL+item.count
       
      }
     else if(item?.leaveType==="CL" && item?.halfDay===false){
      
      CL.CL=CL.CL+item.count
      }

      else if(item?.leaveType==="L" && item?.halfDay===false){
      
        L.L=L.L+item.count
        }

     else if(item?.leaveType==="ML" && item?.halfDay===false){
      
      ML.ML=ML.ML+item.count
      }
     else if(item?.leaveType==="LOP" && item?.halfDay===false){
      
       LOP.LOP=LOP.LOP+item.count
      }
      else if(item?.leaveType==="A" && item?.halfDay===false){
      
      A.A=A.A+item.count
      }
      
    }
  })

  return {SL,CL,ML,LOP,A,L}

}

function getleavecountsforAllLeave(totalleaves,countofleaves){

let leave={countofleaves:0,leavecount:0}


leave.eligipleleave=countofleaves?.SL?.SL+countofleaves?.CL?.CL+countofleaves?.ML?.ML+countofleaves?.L?.L

 if((countofleaves?.SL?.SL+countofleaves?.CL?.CL+countofleaves?.ML?.ML+countofleaves?.L?.L)>totalleaves){

  leave.leavecount=(countofleaves?.SL?.SL+countofleaves?.CL?.CL+countofleaves?.ML?.ML+countofleaves?.L?.L)-totalleaves
  leave.eligipleleave=totalleaves
  }

  return leave
}


export const EmployeeLeaveStatus = () => {
  const[applyLeave,setApplyLeave]=useState({
    "comments":""
  })

 const[countofleaves,setcountofleaves]=useState({})

  const [totalLeavesAsPerBand,settotalLeavesAsPerBand]=useState()
  const [pendingState, setPendingState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

    const empId = localStorage.getItem('id');
  const columns = [
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
      headerClassName:muiDatagrid_headerclassName,
      valueGetter: (params) => (params.row.halfDay ? 'Yes' : 'No'),
    },
    { 
      field: 'status',
     headerName: 'Leave Status', 
     minWidth: 120,
      flex:1.5,
      headerClassName:'table-header',
    },
    { 
      field: 'comments',
     headerName: 'Comments', 
     minWidth: 120,
      flex:1.5,
      headerClassName:'table-header',
    },
    {
      field: 'delete',
      headerName: 'Delete',
      sortable: false,
      minWidth: 120,
      flex:1.5,
      headerClassName:'table-header',
      renderCell: (params) => {
        const isPending = params.row.status === 'pending';
  
        return (
          <IconButton  variant="contained" 
            color={isPending ? 'error' : 'disabled'}
            disabled={!isPending}
          >
            <Delete />
          </IconButton>
        );
      },
    },
    
  ];

  function fetchleavesDatawithparticularEmpId(empId){
    setIsLoading(true)
    LeaveServices.EmployeeLeavesSpent(empId).then((res)=>{
        if(res.status===200 ){
          setIsLoading(false)
          if(res.result.length===0){
  
          }
        settotalLeavesAsPerBand(res.totalLeavesAsPerBand)
  
  
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

  const [open, setOpen] = useState(false);
  const[modalopen,setmodalopen]=useState(false)
  React.useEffect(()=>{
    fetchleavesDatawithparticularEmpId(empId)
  },[])
  useEffect(() => {
        
       
    const year = new Date().getFullYear();
    fetchLeaveStatus(empId, year);
  }, [!modalopen,!open]);

  

  function fetchLeaveStatus(empId,year) {
    
    setIsLoading(true);
   
   LeavesBetaServices.getEmplyoeesLeaveStatusByEmpId(empId,year) .then((res) => {
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

        const firstRecord = leaveData[0]; 
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
          comments: firstRecord.comments,
          attachments: firstRecord.attachments,
          leavesBetaId: firstRecord.leavesBetaId,
        };
        flattened.push(leaveItem); 

        return flattened;
      }, []);

      setPendingState(flattenedData);
      let data11=getCountsOfLeave(flattenedData)
      setcountofleaves(data11)
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
const onRowclick=(params)=>{
if(params?.row?.status==="pending"){  
  setOpen(true)
// setmodalopen(true)
setrowdata(params?.row)
  }
}
const handleClose = () => {
  setOpen(false);
};
const token = localStorage.getItem("token")
const applyLeaveHandle=(e,params)=>{
  e.preventDefault()
  if (!applyLeave.comments || applyLeave.comments.trim() === '') {
      
      Swal.fire({
        icon: 'error',
        title: 'Comments are mandatory',
        text: 'Please provide comments before deleting.',
      });
    } else {
    setIsLoading(true)
  axios({
      method: "delete",
      url: `${baseUrl}/leaves-beta/delete-applied-leave?leaveBetaId=${rowdata?.leavesBetaId}&comments=${applyLeave.comments}`,
      headers: { "Content-Type": 'multipart/form-data' ,"Authorization" : 'Bearer ' + token},
    }).then((res)=>{
      console.log(res.data);
      if(res.data.status===200 && res.data.statusMessage==='DELETE'){

         
        handleClose()
          setIsLoading(false)
          Swal.fire({
              position: 'center',
              icon: 'success',
              title: "Deleted Successfully",
              showConfirmButton: false,
              timer: 1500
          })
      }
      else{
        handleClose()
          setIsLoading(false)
          Swal.fire({
              position: 'center',
              icon: 'error',
              title: res.data.message,
              showConfirmButton: false,
              timer: 1500
          }
          )
      }

  }).catch((error)=>{
    handleClose()
      setIsLoading(false)
      Swal.fire(
          {
              position: 'center',
              icon: 'error',
              title: error.response.data.message,
              showConfirmButton: false,
              timer: 1500
          }

      )

  })


}
}

console.log(getleavecountsforAllLeave(totalLeavesAsPerBand,countofleaves));

  // Helper function to group records by leaveId
  function groupByLeaveId(data) {
    const groupedData = {};
    data.forEach((record) => {
      const leaveId = record.leaveId;
      if (!groupedData[leaveId]) {
        groupedData[leaveId] = [];
      }
      groupedData[leaveId].push(record);
    });

    // Format leaveDate as "From Date" and "To Date"
    for (const leaveId in groupedData) {
      const records = groupedData[leaveId];
      const fromDate = moment(records[0].leaveDate).format("DD/MM/YYYY");
      console.log(fromDate);
      const toDate = moment(records[records.length - 1].leaveDate).format(
        "DD/MM/YYYY"
      );
      console.log(toDate);

      records[0].leaveDate = `${fromDate} - ${toDate}`;
    }

    return Object.values(groupedData).flat();
  }

  return  isLoading ? (
    <Loading></Loading>
  ) : (
    <Box style={SerchingComponetsstyle.firstBox}>

     
        <Typography variant='h6' style={SerchingComponetsstyle.typographystyle}>APPLIED LEAVES</Typography>


      <GlobalButton.GlobalDivider1/>

             
  {/* <CustomModal modalopen={modalopen} modalclose={()=>{setmodalopen(!modalopen)}}
   children={ <Card sx={{width:"400px"}}><EmployeeDeletePendingLeave pendingdata={rowdata} onclose={()=>{setmodalopen(!modalopen)}}></EmployeeDeletePendingLeave></Card>}></CustomModal> */}
    <Dialog sx={{width:"100%"}} open={open} onClose={handleClose}>
<DialogTitle>Delete</DialogTitle>
<DialogContent>
<DialogContentText>
            To delete your pending leave,Comments are mandatory
          </DialogContentText>
  <TextField
    autoFocus
    margin="dense"
    id="name"
    multiline rows={2}
    label="Comments"
    type="text"
    required
    fullWidth
    variant="standard"
    onChange={(e)=>{ setApplyLeave({...applyLeave,comments:e.target.value})}}
  />
</DialogContent>
<DialogActions>
  <Button type='submit' style={{width:"40px", marginRight: '8px',backgroundColor:"rgb(213, 0, 0)",color:"white",borderRadius:"20px",marginBottom:"20px",minWidth:'120px',}} onClick={(e)=>{applyLeaveHandle(e)}}>Delete</Button>
  <Button style={{width:"40px",backgroundColor:"green",color:"white",borderRadius:"20px",marginBottom:"20px",minWidth:'120px',}} onClick={handleClose}>Cancel</Button>
</DialogActions>
</Dialog>

        <Box sx={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'space-between',
            marginRight:"30px",
        }}>


        <Typography color={"secondary"} style={{marginLeft:"10px",fontSize:"16px"}}>Total Eligible Leaves: <span style={{color:"green",fontSize:"20px"}}>{totalLeavesAsPerBand}</span></Typography>

        <Typography color={"secondary"} style={{fontSize:"16px"}}>Leaves Spent: <span style={{color:"black",fontSize:"20px"}}>{getleavecountsforAllLeave(totalLeavesAsPerBand,countofleaves)?.eligipleleave}</span></Typography>
        <Typography color={"secondary"} style={{fontSize:"16px"}}>Absent Count: <span style={{color:"red",fontSize:"20px"}}>{ (countofleaves?.LOP?.LOP+countofleaves?.A?.A)+getleavecountsforAllLeave(totalLeavesAsPerBand,countofleaves)?.leavecount}</span></Typography>
        
             </Box>
             <GlobalButton.GlobalDivider1/>
      <Box sx={SerchingComponetsstyle.DatagridBoxStyle}>

      <CustomDatagrid  
rows={pendingState} columns={columns} sortingfield={"leaveDate"} rowclickhandle={onRowclick}   rowId={getrowId} 
/>
      </Box>



    </Box>
  )
};
