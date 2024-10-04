import { Box, Button, Card, FormControl, Grid, InputLabel, Modal, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { holidayStyle } from '../Holiday/HolidayStyle'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';


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
import { LeavesBetaServices } from '../../Services/LeavesBeta/LeavesBetaServices'
import moment from 'moment/moment'
import { useNavigate } from 'react-router'
import PendingLeaveUpdate from './PendingLeaveUpdate'
import { muiDatagrid_headerclassName } from '../../Components/stylecomponent/forFirstDiv'
import CustomDatagrid from '../../Components/CustomComponents/DataGrid/CustomDatagrid'
import CustomModal from '../../Components/CustomComponents/CustomModals/CustomModal'
export const REPORTED_MANAGER_PENDING_LEAVES='REPORTED_MANAGER_PENDING_LEAVES'
export const HR_VIEW_PENDING_LEAVES='HR_VIEW_PENDING_LEAVES'




function getrowId(row){

  return row.leaveId
  }



export const PendingLeaves = () => {
  const[updatePendingLeaveModal,setUpdatePendingLeaveModal]=useState(false)
  const [pendingState, setPendingState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate=useNavigate()
  const[modalopen,setmodalopen]=useState(false)

  const handleUpdateClick = (params) => {
    setmodalopen(!modalopen)
    
    };

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

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
      field: 'count',
     headerName: 'No Of Leave Days', 
     minWidth: 120,
      flex:1.5,
      headerClassName:'table-header',
    },
    {
      field: 'update',
      headerName: 'View',
      minWidth: 100,
      flex: 1,
      headerClassName: 'table-header',
      renderCell: (params) =>{
      
     return  (
        <Button onClick={handleUpdateClick}>
         <DriveFileRenameOutlineIcon  style={{color:"#0079FF"}} />
        </Button>
        
     )
    }
  }
  ];

  function fetchPendingLeaves() {
    setIsLoading(true);
   const api=hasAuthority(HR_VIEW_PENDING_LEAVES)?LeavesBetaServices.getAllEmployeesPendingLeaves: LeavesBetaServices.getPendingLeaves()
     api() .then((res) => {
      console.log(res);
        if (res.statusMessage === "success" && res.status === 200) {
          let data = res.result;
            
          // Check if data is an array and flatten if necessary
          if (Array.isArray(data)) {
            data = data.flat();
          } else if (typeof data === "object") {
            // Handle the case where data is an object
            data = Object.values(data);
            data = data.flat();
          }
  
          // Group records by leaveId
          const groupedData = data.reduce((grouped, record) => {
            const leaveId = record.leaveId;
            if (!grouped[leaveId]) {
              grouped[leaveId] = [];
            }
            grouped[leaveId].push(record);
            return grouped;
          }, {});

          
  
          // Convert grouped data into a flat array with calculated from/to dates
          const flattenedData = Object.values(groupedData).map((group) => {
            const fromDate = moment.min(group.map((record) => moment(record.leaveDate)));
            console.log(fromDate);
            const toDate = moment.max(group.map((record) => moment(record.leaveDate)));
            console.log(toDate);
            const firstRecord = group[0]; // Pick any record from the group
            return {
              empId: firstRecord.empId,
              leaveType: firstRecord.leaveType,
              leaveDate: fromDate.format('YYYY-MM-DD'), // Use the format you prefer
              toDate: toDate.format('DD/MM/YYYY'),
              reason: firstRecord.reason,
              createdDate: moment(firstRecord.createdDate).format('DD/MM/YYYY'),
              leaveId:firstRecord.leaveId,
              count: firstRecord.count,
              leavesBetaId:firstRecord.leavesBetaId
            };
          });
  
          setPendingState(flattenedData);
  
          if (flattenedData.length === 0) {
            toast.info("No Records Found for the given year", {
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
setrowdata(params?.row)
  }
  
  

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

  return hasAuthority(REPORTED_MANAGER_PENDING_LEAVES)? isLoading ? (
    <Loading></Loading>
  ) : (
    <Box style={SerchingComponetsstyle.firstBox}>
     
        <Typography style={SerchingComponetsstyle.typographystyle}>PENDING LEAVES</Typography>

      <GlobalButton.GlobalDivider1 />
      <Box sx={SerchingComponetsstyle.DatagridBoxStyle}>


      <CustomDatagrid  
rows={pendingState} columns={columns} sortingfield={"leaveDate"} rowclickhandle={handlerowclick}  rowId={getrowId} 
/>
      </Box>


 <CustomModal modalopen={modalopen}  modalclose={()=>{setmodalopen(!modalopen)}} children={<Card sx={{width:"400px"}}><PendingLeaveUpdate pendingdata={rowdata}></PendingLeaveUpdate></Card> } />




    </Box>
  ):<NoAuth></NoAuth>;
};
