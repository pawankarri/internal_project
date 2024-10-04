package com.eidiko.portal.repo.employee;

import com.eidiko.portal.entities.employee.EmpAccessLvlMapping;
import com.eidiko.portal.entities.employee.EmployeeAccessLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmpAccessLvlMappingRepo extends JpaRepository<EmpAccessLvlMapping, Long> {
    EmpAccessLvlMapping findByEmployeeEmpId(Long empId);

    int deleteByAccessLvlMappingId(long accessLvlId);

    EmpAccessLvlMapping findByEmployeeEmpIdAndAccessLevelAccessLvlId(long empId, long accessLvlId);


   // @Query(value = "SELECT e FROM EmpAccessLvlMapping e WHERE e.accessLevel = :accessLevel",nativeQuery = true)
    List<EmpAccessLvlMapping> findByAccessLevelAccessLvlId(int accessLevel);




}
