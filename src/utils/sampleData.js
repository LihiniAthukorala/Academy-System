// Academy data defaults: students, classes, payments, and attendance now start empty.

export const SAMPLE_TEACHERS = [
    {
        id: "TCH-1082",
        name: "Dr. Robert Carter",
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
        phone: "+1-555-0211",
        email: "emma.watson@academy.com",
        address: "789 Pine Crescent, Sunnyvale",
        joinedDate: "2025-01-08",
        classes: ["CLS-4011"],
        status: "Active",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    }
];

export const SAMPLE_CLASSES = [];

export const SAMPLE_STUDENTS = [];

export const SAMPLE_PAYMENTS = [];

export const SAMPLE_ATTENDANCE = [];

export const SAMPLE_NOTIFICATIONS = [];

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
