 import { Divider ,Box} from "@mui/material"
 export const GlobalButton={

   OperationButton: {backgroundColor:"#2196F3",color:"white",borderRadius:"20px",marginBottom:"20px",width:"22%",minWidth:'120px',
   boxShadow: "rgba(0, 0, 0, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"
  },

   
   HaltButton:{backgroundColor:"#d50000",color:"white",borderRadius:"20px",marginBottom:"20px",width:"22%",minWidth:'120px',
   boxShadow: "rgba(0, 0, 0, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"},
   viewButton:{fontSize: '12px' ,minWidth: '55px',textTransform:'lowercase'},
   GlobalDivider:function(){

    return(
      <Divider color='#2196F3' sx={{height:"1px",marginBottom:"7px"}} ></Divider>

    )
   },

GlobalDivider1:function(){

    return(
     
      <Divider color='#2196F3' sx={{height:"1px",marginTop:"3px"}} ></Divider>
    )
   },

}