import * as React from 'react';
import { 
  Box,
   Modal, 
   Paper,
   Tab,
   Tabs,
   Typography,
        } from "@mui/material";
import { toast } from 'react-toastify'
import Loading from "../../Components/LoadingComponent/Loading";
import { useState } from 'react';
import { LeaveServices } from '../../Services/Leave-Service/LeaveServices';
import { GlobalButton } from '../../Components/stylecomponent/GlobalButton';
import { LeavesBetaServices } from '../../Services/LeavesBeta/LeavesBetaServices';
import dayjs from 'dayjs';
import { muiDatagrid_headerclassName } from '../../Components/stylecomponent/forFirstDiv';
import { SerchingComponetsstyle } from '../../Components/stylecomponent/SerchingComponetsStyle';
import CustomDatagrid from '../../Components/CustomComponents/DataGrid/CustomDatagrid';
import { CustomTabPanel, a11yProps } from '../../Components/CustomComponents/MuiTabs/CustomTablePanel';
import { useLocation } from 'react-router';

function getIdWithName(params) {
  return params.row?.modifiedBy+ " - "+params.row?.modifiedByName
}

function getrowId(row){

  return row.leavesBetaId
  }


const columns = [
  {
    field: 'empId',
    headerName: 'Employee Id',
    minWidth: 130,
    flex: 3,
    headerClassName: muiDatagrid_headerclassName,
  },
  {
    field: 'leaveType',
    headerName: 'Leave Type',
    minWidth: 150,
    flex: 3,
    headerClassName: muiDatagrid_headerclassName,
  },
  {
    field: 'leaveDate',
    headerName: 'Leave Date',
    minWidth: 150,
    flex: 3,
    headerClassName: muiDatagrid_headerclassName,
  },
  {
    field: 'modifiedBy',
    headerName: 'Approved By',
    minWidth: 150,
    flex: 3,
    headerClassName: muiDatagrid_headerclassName,
    valueGetter: (params) => {
      const modifiedBy = params.row.modifiedBy;
      if (modifiedBy === null) {
        return 'Pending';
      }
      return modifiedBy;
    },
  },

  ];




export default function LeavesBetaAfterRowClick(props) {

  const [empname,setempname]=useState()
const [totalLeavesAsPerBand,settotalLeavesAsPerBand]=useState(0)
const location=useLocation();
const queryParams= new URLSearchParams(location.search);
const param1Value=queryParams.get('empId');
const param2Value=queryParams.get('leavecount')
const[empId,setEmpId]=useState(param1Value)
const[leaveSpentLength,setLeaveSpentLength]=useState(0);
const[leaveAbsentLength,setLeaveAbsentLength]=useState(0);

  const [leaveData,setLeaveData]=React.useState([])
  const [halfLeaveData,setHalfLeaveData]=React.useState([])
  const[isLoading,setIsLoading]=useState(false)

  React.useEffect(()=>{
    fetchleavesDatawithparticularEmpId(empId)
  },[])


let year=dayjs().format("YYYY")
function fetchleavesDatawithId() {

  setIsLoading(true);
  LeavesBetaServices.getEmployeeLeaveReportAfterRowClick(empId, year).then((res) => {
    if (res.status === 200) {
      setIsLoading(false);

      const leaveTypeData = Object.values(res.result);
     console.log(leaveTypeData);

// Filter the data for the selected leave type
const selectedLeaveData = leaveTypeData.filter((leaveData) => leaveData.halfDay === false);
const selectedHalfLeaveData = leaveTypeData.filter((leaveData) => leaveData.halfDay === true);

const result1 = selectedLeaveData.map((leaveData) => {

  return {
    leavesBetaId: leaveData.leavesBetaId,
    leaveType: leaveData.leaveType,
    empId: leaveData.empId,
    leaveDate: leaveData.leaveDate,
    modifiedBy: leaveData.modifiedBy,
    
  };
  
});

let leaveCount = 0;
let absentCount = 0;
console.log(totalLeavesAsPerBand);
result1.forEach((leave) => {
   if (['LOP', 'A'].includes(leave.leaveType)) {
    absentCount++;
  }
});
setLeaveSpentLength(leaveCount);
setLeaveAbsentLength(absentCount);




const result2 = selectedHalfLeaveData.map((leaveData) => {
  return {
    leavesBetaId: leaveData.leavesBetaId,
    leaveType: leaveData.leaveType,
    empId: leaveData.empId,
    leaveDate: leaveData.leaveDate,
    modifiedBy: leaveData.modifiedBy,
  };
});

setLeaveData(result1);
setHalfLeaveData(result2);

    } else {
      setIsLoading(false);
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }).catch((err) => {
    setIsLoading(false);
    toast.error(err.message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  });
}
console.log(totalLeavesAsPerBand);
const[tabvalue,setTabvalue]=useState(0)
const tabChange=(e,newValue)=>{
setTabvalue(newValue)
}
  React.useEffect(() => {
    const leaveTypes = ['Leaves','Half-Day'];
    const selectedLeaveType =leaveTypes[tabvalue];
    fetchleavesDatawithId(selectedLeaveType);
  }, []);




  const [updateLeave,setUpdateLeave]=useState()

const handleRow = (params)=>{
  setUpdateLeave(params.row)

}

function fetchleavesDatawithparticularEmpId(empId){
  setIsLoading(true)
  LeaveServices.EmployeeLeavesSpent(empId).then((res)=>{
      if(res.status===200){
        setIsLoading(false)
        if(res.result.length===0){
        }
      setempname(res.empName)
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



  return  ( 
    isLoading?<Loading></Loading>:
 
    <Box sx={SerchingComponetsstyle.firstBox}>
      <Box style={SerchingComponetsstyle.SecondBox} >
  <Typography style={SerchingComponetsstyle.typographystyle}> Spent Leaves of <span style={{color:"black"}}>{empname}</span></Typography>
  
             </Box>

             
   
        <GlobalButton.GlobalDivider1></GlobalButton.GlobalDivider1>
    

        <Box sx={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'space-between',
            marginRight:"30px",
        }}>

        <Typography color={"secondary"} style={{marginLeft:"10px",fontSize:"16px"}}>Total Eligible Leaves: <span style={{color:"green",fontSize:"20px"}}>{totalLeavesAsPerBand}</span></Typography>

        <Typography color={"secondary"} style={{fontSize:"16px"}}>Leaves Spent: <span style={{color:"black",fontSize:"20px"}}>{param2Value}</span></Typography>
        <Typography color={"secondary"} style={{fontSize:"16px"}}>Absent Count: <span style={{color:"red",fontSize:"20px"}}>{leaveAbsentLength}</span></Typography>
       
             </Box>
             <GlobalButton.GlobalDivider1></GlobalButton.GlobalDivider1>
 <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabvalue} onChange={tabChange} aria-label="basic tabs example">

<Tab label={<div style={{ display: 'flex', alignItems: 'center' }}>
  <span>Leaves</span>
</div>} {...a11yProps(0)} />
<Tab label={<div style={{ display: 'flex', alignItems: 'center' }}>
  <span>Half-Day</span>
  <span style={{ color: 'black', marginLeft: '5px' }}></span>
</div>} {...a11yProps(0)} />
        </Tabs>
      </Box>

<Box sx={{marginTop:"10px",marginBottom:"10px"}}>
 

</Box>

{tabvalue === 0 ? (
          <CustomTabPanel value={tabvalue} index={0}>
            <CustomDatagrid rows={leaveData} columns={columns} rowId={getrowId} rowclickhandle={handleRow} />
          </CustomTabPanel>
        ) : (
          <CustomTabPanel value={tabvalue} index={1}>
            <CustomDatagrid rows={halfLeaveData} columns={columns} rowId={getrowId} rowclickhandle={handleRow} />
          </CustomTabPanel>
        )}

   </Box>
  )
}

