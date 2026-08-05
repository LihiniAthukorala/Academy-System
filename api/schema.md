# MongoDB collections for Academy System

## students
Use one document per student.

Recommended fields:
- name
- dob
- gender
- school
- grade
- address
- phone
- parentName
- parentPhone
- email
- joinedDate
- classId
- monthlyFee
- status
- profileImage
- notes
- createdAt
- updatedAt

## classes
Use one document per class.

Recommended fields:
- name
- subject
- teacherId
- teacherName
- grade
- day
- startTime
- endTime
- classroom
- monthlyFee
- capacity
- status
- createdAt
- updatedAt

## attendance
Use one document per class per date.

Recommended fields:
- classId
- className
- date
- records
- createdAt
- updatedAt

Each record inside records should contain:
- studentId
- studentName
- status
- notes

## payments
Use one document per payment record.

Recommended fields:
- studentId
- studentName
- monthlyFee
- registrationFee
- additionalCharges
- discount
- paidAmount
- totalAmount
- balance
- status
- paymentDate
- createdAt
- updatedAt
