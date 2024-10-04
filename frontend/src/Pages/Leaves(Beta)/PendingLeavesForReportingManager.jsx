import { Box, Button, Card, FormControl, Grid, InputLabel, Modal, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { holidayStyle } from '../Holiday/HolidayStyle'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import PreviewIcon from '@mui/icons-material/Preview';
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
export const REPORTING_MANAGER_PENDING_LEAVES='REPORTING_MANAGER_PENDING_LEAVES'

export const PendingLeavesForReportingManager = () => {
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
    
  }, [modalopen]);

  const columns = [
    {
      field: "empId",
      headerName: "Emp Id",
      minWidth: 100,
      flex: 1.5,
      headerClassName: "table-header",
    },
    {
      field: "leaveType",
      headerName: "Leave Type",
      minWidth: 100,
      flex: 1.5,
      headerClassName: "table-header",
    },
    {
      field: "leaveDate",
      headerName: "From Date",
      minWidth: 100,
      flex: 1.5,
      headerClassName: "table-header",
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
      headerClassName: "table-header",
    },
    
    {
      field: "createdDate",
      headerName: "Applied On",
      minWidth: 100,
      flex: 1.5,
      headerClassName: "table-header",
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
         <PreviewIcon color='secondary' sx={{ marginRight: "39px" }} />
        </Button>
        
     )
    }
  }
  ];

  function fetchPendingLeaves() {
    setIsLoading(true);
   LeavesBetaServices.getPendingLeaves().then((res) => {
      console.log(res);
        if (res.statusMessage === "success" && res.status === 200) {
          let data = res.result;
            
          
          if (Array.isArray(data)) {
            data = data.flat();
          } else if (typeof data === "object") {
            
            data = Object.values(data);
            data = data.flat();
          }
  
          
          const groupedData = data.reduce((grouped, record) => {
            const leaveId = record.leaveId;
            if (!grouped[leaveId]) {
              grouped[leaveId] = [];
            }
            grouped[leaveId].push(record);
            return grouped;
          }, {});

          
  
          
          const flattenedData = Object.values(groupedData).map((group) => {
            const fromDate = moment.min(group.map((record) => moment(record.leaveDate)));
            const toDate = moment.max(group.map((record) => moment(record.leaveDate)));
            const firstRecord = group[0]; 
            return {
              empId: firstRecord.empId,
              leaveType: firstRecord.leaveType,
              leaveDate: fromDate.format('YYYY-MM-DD'), 
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
  
  

  
  function groupByLeaveId(data) {
    const groupedData = {};
    data.forEach((record) => {
      const leaveId = record.leaveId;
      if (!groupedData[leaveId]) {
        groupedData[leaveId] = [];
      }
      groupedData[leaveId].push(record);
    });

  
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

  return hasAuthority(REPORTING_MANAGER_PENDING_LEAVES)? isLoading ? (
    <div>Loading...</div>
  ) : (
    <Box style={holidayStyle.firstBox}>
      <Box style={holidayStyle.SecondBox}>
        <Typography style={holidayStyle.typographystyle}>PENDING LEAVES</Typography>
      </Box>

      <GlobalButton.GlobalDivider />
      <Box sx={SerchingComponetsstyle.DatagridBoxStyle}>
        <DataGrid
          rows={pendingState}
          columns={columns}
          initialState={{ sorting: {
            sortModel: [{ field: 'leaveDate', sort: 'desc' }],
          },
             ...pendingState.initialState,
           pagination: { paginationModel: { pageSize: 8} },
         }}
          getRowId={(row) => row.leaveId}
          onRowClick={handlerowclick}
          pageSizeOptions={[8, 15, 25, 50, 75]}
        />
      </Box>

<Modal open={modalopen} onClose={()=>{setmodalopen(!modalopen)} }

sx={{overflow:"scroll",display:"flex",justifyContent:"center",alignContent:"center",alignItems:"center"}}
>
 <Card sx={{width:"400px"}}><PendingLeaveUpdate pendingdata={rowdata}></PendingLeaveUpdate></Card> 
</Modal>


    </Box>
  ):<NoAuth></NoAuth>;
};
