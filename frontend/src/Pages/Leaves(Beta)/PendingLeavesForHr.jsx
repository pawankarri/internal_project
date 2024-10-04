import { Box, Button, Card, FormControl, Grid, InputLabel, Modal, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PreviewIcon from '@mui/icons-material/Preview';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {IconButton} from '@mui/material';
import Swal from 'sweetalert2'
import { GlobalButton } from '../../Components/stylecomponent/GlobalButton'
import { hasAuthority } from '../../Services/AccessLevel/AccessLevelService'
import { NoAuth } from '../../Components/HelperComponent/NoAuth'
import Loading from '../../Components/LoadingComponent/Loading'
import { SerchingComponetsstyle } from '../../Components/stylecomponent/SerchingComponetsStyle'
import { LeavesBetaServices } from '../../Services/LeavesBeta/LeavesBetaServices'
import moment from 'moment/moment'
import { useLocation, useNavigate } from 'react-router'
import PendingLeaveUpdate from './PendingLeaveUpdate'
import { Delete } from '@mui/icons-material'
import AppliedLeaveUpdateModal from './AppliedLeaveUpdateModal'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { muiDatagrid_headerclassName } from '../../Components/stylecomponent/forFirstDiv'
import CustomDatagrid from '../../Components/CustomComponents/DataGrid/CustomDatagrid'
import CustomModal from '../../Components/CustomComponents/CustomModals/CustomModal'
import LeavesAttachment from './LeavesAttachment';
export const PENDING_LEAVES_VIEW_FOR_RM='PENDING_LEAVES_VIEW_FOR_RM'
export const PENDING_LEAVES_UPDATE_FROM_BY_HR_LEVEL='LEAVES_STATUS_UPDATE_FROM_BY_HR_LEVEL'
export const PENDING_LEAVES_DELETE_FROM_BY_HR_LEVEL='LEAVES_STATUS_DELETE_FROM_BY_HR_LEVEL'
export const HR_ACCESS_PENDING_LEAVES_STATUS='HR_ACCESS_PENDING_LEAVES_STATUS'


function getrowId(row){

  return row.leaveId
  }


export const PendingLeavesHr = (props) => {

  const [rowdata1, setRowData1] = useState(null);
const [open ,setOpen]=useState(false)
  const handleAttachmentsClick = (params) => {
    setRowData1(params?.row);
    setOpen(!open)
    
    };

console.log(open);

  let { state } = useLocation(props.state);
const location=useLocation()

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
    update: hasAuthority(PENDING_LEAVES_UPDATE_FROM_BY_HR_LEVEL),
    // delete:hasAuthority(PENDING_LEAVES_DELETE_FROM_BY_HR_LEVEL) ,
  });
  const [pendingState, setPendingState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate=useNavigate()
  const[modalopen,setmodalopen]=useState(false)
  
  const [reportm,setreportm]=useState(false)
  const [empskilldata1,setempskilldata1]=useState()
const rowhandle1=(params)=>{
  setempskilldata1(params.row)
}
  const handleRmOpen=()=>{
    setreportm(true)
  }
  const handleUpdateClick = (params) => {
    setmodalopen(!modalopen)
    
    };
    // const onButtonClick = (e, row, action) => {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     if (action === 'delete') {
              
    //         Swal.fire({
    //             icon: "warning",
    //             iconColor:"#d50000",
    //             title: 'Do you want to delete this ' + row.leavesBetaId,
    //             showCancelButton: true,
    //             confirmButtonText: 'Delete',
    //             confirmButtonColor: '#2196F3',
    //             cancelButtonColor: '#d50000'
      
                
    //         })
      
    //         .then((result) => {
    //             if (result.isConfirmed) {
    //               LeavesBetaServices.deleteLeave(row.leavesBetaId).then((res)=>{
                    
    //                     if(res.status===200){
    //                         Swal.fire('Deleted!', '', 'success')
    //                         window.history.back();
    //                     }
    //                     else{
    //                         Swal.fire("Review  doesn't exist",'',"error")
    //                     }
    //                 })
                    
    //             }
    //         })
    //     }
    //   };
 const handleBack=(()=>{
  navigate(-1)
 })

const updatemodaldata=(value)=>{
 
if(value){
  setPendingState([])

}
}


  useEffect(() => {

    if(state !==null || state !==undefined){
setPendingState([state])
    }
    else{
      fetchPendingLeaves();
    }
   
  
    
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
      headerClassName: muiDatagrid_headerclassName,
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
      headerClassName:muiDatagrid_headerclassName,
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
      field: "attachments",
      headerName: "Attachments",
      minWidth: 100,
      flex: 1.5,
      headerClassName: muiDatagrid_headerclassName,
      renderCell: (params) =>{
    
        return  (
           <Button variant='contained' size='small' style={GlobalButton.viewButton} onClick={()=>{handleAttachmentsClick(params)}}>
           open</Button>
           
        )
       }
    },
    {
      field: 'view',
      headerName: 'View',
      minWidth: 100,
      flex: 1,
      headerClassName: muiDatagrid_headerclassName,
      renderCell: (params) =>{
      
     return  (
        <Button onClick={handleUpdateClick}>
         <PreviewIcon color='secondary' sx={{ marginRight: "39px" }} />
        </Button>
        
     )
    }
  },
  {
    field: 'update',
    headerName: 'Update',
    minWidth: 90,
    flex:1.5,
    headerClassName: muiDatagrid_headerclassName,
    renderCell: (params) => {
       { return hasAuthority(PENDING_LEAVES_UPDATE_FROM_BY_HR_LEVEL)? (
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
            
        ):null}
    }
},
//  {
//     field: 'delete',
//     headerName: 'Delete',
//     minWidth: 80,
//     flex:1.5,
//     headerClassName: muiDatagrid_headerclassName,
//     renderCell: (params) => {

//        { return hasAuthority(PENDING_LEAVES_DELETE_FROM_BY_HR_LEVEL)? (
//             <Box sx={{
//                  display: 'flex',
//                  justifyContent: 'center'
//             }}>
//                 <IconButton variant="contained" color='error'
//                      onClick={(e) =>{ onButtonClick(e, params.row, 'delete')}}
//                 ><Delete /></IconButton >

//             </Box>
//         ):null}
//           } 
// }
  ];

   

  function fetchPendingLeaves() {
    setIsLoading(true);
   const api=hasAuthority(HR_ACCESS_PENDING_LEAVES_STATUS)? LeavesBetaServices.getAllEmployeesPendingLeavesForHR(): LeavesBetaServices.getPendingLeavesForRM()
   api.then((res) => {
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
              halfDay:firstRecord.halfDay,
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

  return hasAuthority(PENDING_LEAVES_VIEW_FOR_RM)? isLoading ? (
    <div><Loading/></div>
  ) : (
    <Box style={SerchingComponetsstyle.firstBox}>
      <Box style={SerchingComponetsstyle.SecondBox}>
        <Typography style={SerchingComponetsstyle.typographystyle}>PENDING LEAVES</Typography>

        <Button variant='outlined' 
  onClick={handleBack}
  startIcon={<ArrowBackIosNewIcon/>}>
back
 </Button> 
      </Box>

      <GlobalButton.GlobalDivider />
      <Box sx={SerchingComponetsstyle.DatagridBoxStyle}>

<CustomDatagrid
columnVisibilityModel={columnVisibilityModel}
rows={pendingState}
columns={columns}
sortingfield={'leaveDate'}
rowclickhandle={handlerowclick}
rowId={getrowId}
/>
      </Box>

<CustomModal modalclose={()=>{setmodalopen(!modalopen)}} modalopen={modalopen}  children={ <Card sx={{width:"400px"}}><PendingLeaveUpdate dataerase={updatemodaldata} pendingdata={rowdata} onclose={()=>{setmodalopen(false)}}></PendingLeaveUpdate></Card> 
}   />

<CustomModal modalopen={reportm} modalclose={()=>{setreportm(!reportm)}} children={<Card sx={{width:"400px"}}>
                      <AppliedLeaveUpdateModal dataerase={updatemodaldata} rowdata={rowdata} onClose1={()=>{setreportm(false)}}/></Card> }/>
 {/* <CustomModal  modalopen={open} modalclose={()=>{setOpen(!open)}} children={<LeavesAttachment rowdata={rowdata} />}> */}
 <CustomModal  modalopen={open} modalclose={()=>{setOpen(!open)}} children={<LeavesAttachment attachmentData={rowdata1}/>}>

</CustomModal>
    </Box>
  ):<NoAuth></NoAuth>;
};
