package com.eidiko.portal.dto.biometric;

import lombok.Data;

@Data
public class BiometricReportViewProjectionDto {
    long empId;
    String avgWorkingHours;
    long isLateCount;
    long veryLateCount;
    long noLateCount;
    String month;
    long year;
}
