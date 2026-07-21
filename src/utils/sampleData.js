// Realistic Sample Data for Academy Management System Frontend

export const SAMPLE_TEACHERS = [
    {
        id: "TCH-1082",
        name: "Dr. Robert Carter",
        subject: "Advanced Mathematics",
        phone: "+1-555-0143",
        email: "robert.carter@academy.com",
        address: "742 Evergreen Terrace, Springfield",
        joinedDate: "2024-01-15",
        classes: ["CLS-7821", "CLS-7822"],
        status: "Active",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    {
        id: "TCH-1405",
        name: "Prof. Sarah Jenkins",
        subject: "Theoretical Physics",
        phone: "+1-555-0178",
        email: "sarah.jenkins@academy.com",
        address: "109 Baker Street, London",
        joinedDate: "2024-03-10",
        classes: ["CLS-9041", "CLS-9042"],
        status: "Active",
        profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    {
        id: "TCH-2011",
        name: "David Miller",
        subject: "General Chemistry",
        phone: "+1-555-0199",
        email: "david.miller@academy.com",
        address: "456 Oak Lane, Maplewood",
        joinedDate: "2024-05-18",
        classes: ["CLS-3011"],
        status: "Active",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    },
    {
        id: "TCH-3144",
        name: "Emma Watson",
        subject: "English Literature",
        phone: "+1-555-0211",
        email: "emma.watson@academy.com",
        address: "789 Pine Crescent, Sunnyvale",
        joinedDate: "2025-01-08",
        classes: ["CLS-4011"],
        status: "Active",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    }
];

export const SAMPLE_CLASSES = [
    {
        id: "CLS-7821",
        name: "Grade 10 Mathematics",
        subject: "Mathematics",
        teacherId: "TCH-1082",
        teacherName: "Dr. Robert Carter",
        grade: "Grade 10",
        day: "Monday",
        startTime: "15:00",
        endTime: "17:00",
        classroom: "Room A-1",
        monthlyFee: 120,
        capacity: 25,
        status: "Active"
    },
    {
        id: "CLS-7822",
        name: "Grade 11 Pure Maths",
        subject: "Mathematics",
        teacherId: "TCH-1082",
        teacherName: "Dr. Robert Carter",
        grade: "Grade 11",
        day: "Wednesday",
        startTime: "16:00",
        endTime: "18:30",
        classroom: "Room A-2",
        monthlyFee: 140,
        capacity: 20,
        status: "Active"
    },
    {
        id: "CLS-9041",
        name: "Grade 11 Mechanics",
        subject: "Physics",
        teacherId: "TCH-1405",
        teacherName: "Prof. Sarah Jenkins",
        grade: "Grade 11",
        day: "Tuesday",
        startTime: "14:30",
        endTime: "16:30",
        classroom: "Lab B-4",
        monthlyFee: 150,
        capacity: 15,
        status: "Active"
    },
    {
        id: "CLS-9042",
        name: "Grade 12 Quantum Physics",
        subject: "Physics",
        teacherId: "TCH-1405",
        teacherName: "Prof. Sarah Jenkins",
        grade: "Grade 12",
        day: "Thursday",
        startTime: "16:30",
        endTime: "19:00",
        classroom: "Lab B-4",
        monthlyFee: 180,
        capacity: 15,
        status: "Active"
    },
    {
        id: "CLS-3011",
        name: "High School Organic Chemistry",
        subject: "Chemistry",
        teacherId: "TCH-2011",
        teacherName: "David Miller",
        grade: "Grade 11",
        day: "Friday",
        startTime: "15:00",
        endTime: "17:00",
        classroom: "Lab C-1",
        monthlyFee: 130,
        capacity: 30,
        status: "Active"
    },
    {
        id: "CLS-4011",
        name: "Grade 10 English",
        subject: "English Literature",
        teacherId: "TCH-3144",
        teacherName: "Emma Watson",
        grade: "Grade 10",
        day: "Saturday",
        startTime: "09:00",
        endTime: "11:30",
        classroom: "Room D-2",
        monthlyFee: 100,
        capacity: 25,
        status: "Active"
    }
];

export const SAMPLE_STUDENTS = [
    {
        id: "STD-4091",
        name: "Alexander Mercer",
        nameInitials: "A. Mercer",
        dob: "2010-04-12",
        gender: "Male",
        school: "Springfield High School",
        grade: "Grade 10",
        address: "12 Valley Road, Springfield",
        phone: "+1-555-0811",
        parentName: "Richard Mercer",
        parentPhone: "+1-555-0812",
        email: "alexander.mercer@gmail.com",
        joinedDate: "2024-01-20",
        classId: "CLS-7821", // Math Gr 10
        monthlyFee: 120,
        status: "Active",
        profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        notes: "Requires additional exercise material on Geometry. Outstanding performance."
    },
    {
        id: "STD-4092",
        name: "Sophia Martinez",
        nameInitials: "S. Martinez",
        dob: "2009-08-25",
        gender: "Female",
        school: "West River Collegiate",
        grade: "Grade 11",
        address: "89 Riverbed Dr, Springfield",
        phone: "+1-555-0155",
        parentName: "Maria Martinez",
        parentPhone: "+1-555-0156",
        email: "sophia.m@outlook.com",
        joinedDate: "2024-02-15",
        classId: "CLS-7822", // Math Gr 11
        monthlyFee: 140,
        status: "Active",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        notes: "Takes both Maths and Physics. Responsive in classes."
    },
    {
        id: "STD-4093",
        name: "Ethan James Harrison",
        nameInitials: "E. J. Harrison",
        dob: "2009-11-03",
        gender: "Male",
        school: "Springfield Academic Academy",
        grade: "Grade 11",
        address: "34 Maple Avenue, Springfield",
        phone: "+1-555-0322",
        parentName: "William Harrison",
        parentPhone: "+1-555-0323",
        email: "ethan.harrison@gmail.com",
        joinedDate: "2024-02-05",
        classId: "CLS-9041", // Physics Gr 11
        monthlyFee: 150,
        status: "Active",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        notes: "Preparation for local Olympiad."
    },
    {
        id: "STD-4094",
        name: "Chloe Isabella Carter",
        nameInitials: "C. I. Carter",
        dob: "2010-01-30",
        gender: "Female",
        school: "Springfield High School",
        grade: "Grade 10",
        address: "74 Meadow Lane, Springfield",
        phone: "+1-555-0451",
        parentName: "Arthur Carter",
        parentPhone: "+1-555-0452",
        email: "chloe.carter@gmail.com",
        joinedDate: "2024-03-01",
        classId: "CLS-4011", // English Gr 10
        monthlyFee: 100,
        status: "Active",
        profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        notes: "Requires support in creative writing assignments."
    },
    {
        id: "STD-4095",
        name: "Lucas Oliver Thompson",
        nameInitials: "L. O. Thompson",
        dob: "2008-05-14",
        gender: "Male",
        school: "Northern Prep Academy",
        grade: "Grade 12",
        address: "216 Birchwood Boulevard",
        phone: "+1-555-0902",
        parentName: "Helen Thompson",
        parentPhone: "+1-555-0903",
        email: "lucas.thompson@gmail.com",
        joinedDate: "2024-02-01",
        classId: "CLS-9042", // Physics Gr 12
        monthlyFee: 180,
        status: "Active",
        profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        notes: "Goaloriented. Excellent logic."
    },
    {
        id: "STD-4096",
        name: "Emma Victoria Smith",
        nameInitials: "E. V. Smith",
        dob: "2009-02-18",
        gender: "Female",
        school: "Springfield High School",
        grade: "Grade 11",
        address: "18 Sunset Ridge, Springfield",
        phone: "+1-555-0678",
        parentName: "Marcus Smith",
        parentPhone: "+1-555-0679",
        email: "emma.smith@yahoo.com",
        joinedDate: "2024-06-10",
        classId: "CLS-3011", // Chemistry
        monthlyFee: 130,
        status: "Active",
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
        notes: "Tended to miss classes initially due to school swimming practices. Now consistent."
    },
    {
        id: "STD-4097",
        name: "Mason James Davis",
        nameInitials: "M. J. Davis",
        dob: "2010-09-02",
        gender: "Male",
        school: "Springfield Science Academy",
        grade: "Grade 10",
        address: "88 Pine Rd, Springfield",
        phone: "+1-555-0220",
        parentName: "Linda Davis",
        parentPhone: "+1-555-0221",
        email: "mason.davis@hotmail.com",
        joinedDate: "2024-05-15",
        classId: "CLS-7821", // Math Gr 10
        monthlyFee: 120,
        status: "Inactive",
        profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        notes: "Moved out of the area in June 2025. Contact parent before re-enrolling."
    }
];

export const SAMPLE_PAYMENTS = [
    {
        id: "REC-8901",
        studentId: "STD-4091",
        studentName: "Alexander Mercer",
        classId: "CLS-7821",
        month: "July",
        year: "2026",
        monthlyFee: 120,
        registrationFee: 0,
        additionalCharges: 10,
        discount: 15,
        totalAmount: 115, // 120 + 0 + 10 - 15 = 115
        paidAmount: 115,
        balance: 0,
        paymentDate: "2026-07-05",
        paymentMethod: "Online Payment",
        status: "Paid",
        referenceNumber: "TXN108273618",
        notes: "Payment complete. Applied academic merit discount of $15."
    },
    {
        id: "REC-8902",
        studentId: "STD-4092",
        studentName: "Sophia Martinez",
        classId: "CLS-7822",
        month: "July",
        year: "2026",
        monthlyFee: 140,
        registrationFee: 0,
        additionalCharges: 0,
        discount: 0,
        totalAmount: 140,
        paidAmount: 80,
        balance: 60,
        paymentDate: "2026-07-08",
        paymentMethod: "Cash",
        status: "Partially Paid",
        referenceNumber: "CASH-7820",
        notes: "Remaining $60 will be cleared next week."
    },
    {
        id: "REC-8903",
        studentId: "STD-4093",
        studentName: "Ethan James Harrison",
        classId: "CLS-9041",
        month: "July",
        year: "2026",
        monthlyFee: 150,
        registrationFee: 20, // New registration
        additionalCharges: 0,
        discount: 10,
        totalAmount: 160, // 150 + 20 + 0 - 10 = 160
        paidAmount: 160,
        balance: 0,
        paymentDate: "2026-07-10",
        paymentMethod: "Bank Transfer",
        status: "Paid",
        referenceNumber: "BANK-MTR-99",
        notes: "Registration fee included. Promocode DISCOUNT10 applied."
    },
    {
        id: "REC-8904",
        studentId: "STD-4094",
        studentName: "Chloe Isabella Carter",
        classId: "CLS-4011",
        month: "July",
        year: "2026",
        monthlyFee: 100,
        registrationFee: 0,
        additionalCharges: 0,
        discount: 5,
        totalAmount: 95,
        paidAmount: 0,
        balance: 95,
        paymentDate: "",
        paymentMethod: "Cash",
        status: "Pending",
        referenceNumber: "",
        notes: "Invoice sent to parent's email."
    },
    {
        id: "REC-8905",
        studentId: "STD-4095",
        studentName: "Lucas Oliver Thompson",
        classId: "CLS-9042",
        month: "June",
        year: "2026",
        monthlyFee: 180,
        registrationFee: 0,
        additionalCharges: 0,
        discount: 0,
        totalAmount: 180,
        paidAmount: 180,
        paymentDate: "2026-06-03",
        paymentMethod: "Card",
        balance: 0,
        status: "Paid",
        referenceNumber: "VISA-CARD-5182",
        notes: "Paid via terminal at reception."
    },
    {
        id: "REC-8906",
        studentId: "STD-4095",
        studentName: "Lucas Oliver Thompson",
        classId: "CLS-9042",
        month: "July",
        year: "2026",
        monthlyFee: 180,
        registrationFee: 0,
        additionalCharges: 25, // Book purchase
        discount: 0,
        totalAmount: 205,
        paidAmount: 0,
        balance: 205,
        paymentDate: "",
        paymentMethod: "Cash",
        status: "Overdue",
        referenceNumber: "",
        notes: "Reminder sent on July 15."
    }
];

export const SAMPLE_ATTENDANCE = [
    // For Class CLS-7821 Math Grade 10 - Date 2026-07-20
    {
        date: "2026-07-20",
        classId: "CLS-7821",
        records: [
            { studentId: "STD-4091", status: "Present", notes: "Arrived on time" },
            { studentId: "STD-4097", status: "Absent", notes: "Inactive status" }
        ]
    },
    // For Class CLS-7821 Math Grade 10 - Date 2026-07-13
    {
        date: "2026-07-13",
        classId: "CLS-7821",
        records: [
            { studentId: "STD-4091", status: "Present", notes: "" },
            { studentId: "STD-4097", status: "Absent", notes: "" }
        ]
    },
    // For Class CLS-7822 Math Grade 11 - Date 2026-07-20
    {
        date: "2026-07-20",
        classId: "CLS-7822",
        records: [
            { studentId: "STD-4092", status: "Present", notes: "" }
        ]
    },
    // For Class CLS-9041 Physics Grade 11 - Date 2026-07-21 (Today)
    {
        date: "2026-07-21",
        classId: "CLS-9041",
        records: [
            { studentId: "STD-4093", status: "Late", notes: "Late by 10 mins due to school bus delay" }
        ]
    },
    // For Class CLS-3011 Chemistry - Date 2026-07-17
    {
        date: "2026-07-17",
        classId: "CLS-3011",
        records: [
            { studentId: "STD-4096", status: "Present", notes: "" }
        ]
    },
    // For Class CLS-4011 English - Date 2026-07-18
    {
        date: "2026-07-18",
        classId: "CLS-4011",
        records: [
            { studentId: "STD-4094", status: "Excused", notes: "Medical leave" }
        ]
    }
];

export const SAMPLE_NOTIFICATIONS = [
    {
        id: "NOT-901",
        title: "Pending Fee Reminder",
        message: "Chloe Isabella Carter's payment of $95 for July is pending.",
        type: "fee",
        date: "2026-07-21T08:15:00Z",
        read: false,
        severity: "warning"
    },
    {
        id: "NOT-902",
        title: "Overdue Payment Alert",
        message: "Lucas Oliver Thompson's fee payment of $205 for CLS-9042 is overdue by 6 days.",
        type: "fee",
        date: "2026-07-20T10:00:00Z",
        read: false,
        severity: "error"
    },
    {
        id: "NOT-903",
        title: "Low Attendance Warning",
        message: "Alexander Mercer's attendance rate is 92%. Monitor closely.",
        type: "attendance",
        date: "2026-07-19T09:30:00Z",
        read: true,
        severity: "warning"
    },
    {
        id: "NOT-904",
        title: "New Student Registered",
        message: "Emma Victoria Smith has finalized registration in High School Organic Chemistry.",
        type: "registration",
        date: "2026-07-18T14:20:00Z",
        read: false,
        severity: "info"
    },
    {
        id: "NOT-905",
        title: "Upcoming Class",
        message: "Grade 11 Pure Maths class by Dr. Robert Carter starts tomorrow at 16:00.",
        type: "schedule",
        date: "2026-07-21T07:00:00Z",
        read: false,
        severity: "info"
    }
];

export const DEFAULT_SETTINGS = {
    academyName: "Ratnapura Chess Academy",
    academyLogo: "/ratnapura-logo.jpeg",
    address: "102 High Street, Academy Plaza, Sector 4",
    phone: "+1-555-9000",
    email: "info@ratnapurachessacademy.edu",
    receiptFooter: "Thank you for choosing Ratnapura Chess Academy. For inquiries or updates, email info@ratnapurachessacademy.edu.",
    defaultMonthlyFee: 120,
    currency: "USD",
    academicYear: "2026"
};
