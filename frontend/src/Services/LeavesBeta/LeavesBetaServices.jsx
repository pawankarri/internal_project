import { myAxios } from "../../Server/MyAxios"

export const LeavesBetaServices ={
    AddLeaveType:async function(leaveType){
        
        return await myAxios.post(`leaves-beta/add-leave-types`,leaveType).then((res)=>res.data)
    },

    getAllLeavesType:async function()
    {
        return await myAxios.get('leaves-beta/get-all-leave-types').then((res)=>res.data)
    },

    deleteLeaveType:async function(leaveTypeId)
    {
        return await myAxios.delete(`leaves-beta/delete-leave-types/${leaveTypeId}`).then((res)=>res.data)
    },
     
    getPendingLeavesForRM:async function()
    {
        return await myAxios.get(`leaves-beta/get-all-pending-leaves`).then((res)=>res.data)
    },
    getAllEmployeesPendingLeavesForHR:async function()
    {
        return await myAxios.get(`leaves-beta/get-all-employees-pending-leaves`).then((res)=>res.data)
    },
    // getAllEmplyoeesLeaveStatus:async function(month,year)
    // {
    //     return await myAxios.get(`leaves-beta/hr-team/get-all-employees-leaves-status/${month}/${year}`).then((res)=>res.data)
    // },

    

    getEmplyoeesLeaveStatusByEmpId: async function (empId, year) {
        return await myAxios.get(`leaves-beta/get-leaves-beta-by-emp?empId=${empId}&year=${year}`).then((res) => res.data);
      },

      getViewAttachments:async function (filename) {
        return await myAxios.get(`leaves-beta/show-attachment?filename=${filename}`).then((res) => res.data);
      },
      
      deleteLeave:async function (leavesBetaId) {
        return await myAxios.delete(`leaves-beta/delete-applied-leave?leaveBetaId=${leavesBetaId}`).then((res) => res.data);
      },


      
      getEmplyoeesLeaveStatus: async function (month, year,status) {
        return await myAxios.get(`leaves-beta/hr-team/get-all-employees-leaves-status/${month}/${year}/${status}`).then((res) => res.data);
      },



      getEmplyoeesLeaveStatusForRm: async function (month, year,status) {
        return await myAxios.get(`leaves-beta/reporting-manager/get-employees-leaves-status/${month}/${year}/${status}`).then((res) => res.data);
      },

      getAllEmployeesYearlyLeavesReport: async function (year) {
        return await myAxios.get(`leaves-beta/leave-report/${year}`).then((res) => res.data);
      },


      getEmployeeLeaveReportAfterRowClick: async function (empId,year) {
        return await myAxios.get(`leaves-beta/get-employee-yearly-leaves-report/${empId}/${year}`).then((res) => res.data);
      },

      getUploadedAttachments: async function (filename) {
        return await myAxios.get(`leaves-beta/show-attachment?filename=${filename}`).then((res) => res.data);
      },
      getReportingEmployeesLeaveReport: async function (year) {
        return await myAxios.get(`leaves-beta/get-reporting-employees-leaves-report/${year}`).then((res) => res.data);
      },

      

}