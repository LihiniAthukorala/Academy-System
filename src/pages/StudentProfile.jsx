import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAcademy } from '../context/AcademyContext';
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    User,
    Phone,
    Mail,
    Home,
    GraduationCap,
    Clock,
    BookOpen,
    FileText,
    Edit,
    ClipboardList
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { formatLKR } from '../utils/currency';

export const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        students,
        classes,
        payments,
        getAttendanceSummaryByStudent,
        getStudentOverviewStats
    } = useAcademy();

    const [activeTab, setActiveTab] = useState('Overview');

    // Find the student
    const student = students.find((s) => s.id === id);

    if (!student) {
        return (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Student Not Found</h3>
                <p className="text-xs text-slate-455 mt-2">The requested student ID does not match any current records.</p>
                <Link
                    to="/students"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-650 hover:underline mt-4"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
                </Link>
            </div>
        );
    }

    // Retrieve stats
    const stats = getStudentOverviewStats(student.id);
    const attendanceData = getAttendanceSummaryByStudent(student.id);
    const studentPayments = payments.filter((p) => p.studentId === student.id);
    const studentClass = classes.find((c) => c.id === student.classId);

    const tabs = ['Overview', 'Attendance', 'Fee Payments', 'Classes', 'Notes'];

    return (
        <div className="space-y-6">
            {/* Back button & Title */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/students')}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-55 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 my-0">
                            Student Register Profile
                        </h2>
                        <p className="text-xs text-slate-450 dark:text-slate-500 font-semibold mt-0.5">
                            Detailed tracking dashboard for academic enrollments, fee balances, and class attendance logs.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => navigate(`/students?action=edit&id=${student.id}`)}
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-xs cursor-pointer transition-all active:translate-y-0.5"
                >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Student Details
                </button>
            </div>

            {/* Main personal banner */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 md:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left">
                    <img
                        src={student.profileImage}
                        alt={student.name}
                        className="w-24 h-24 rounded-2xl object-cover bg-slate-100 ring-4 ring-slate-100 dark:ring-slate-800/80 shadow-md shrink-0"
                    />
                    <div>
                        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-none">
                                {student.name}
                            </h3>
                            <StatusBadge status={student.status} />
                        </div>
                        <p className="text-xs text-slate-400 font-bold font-mono mt-2">
                            ID: {student.id} • Registered Grade: {student.grade}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-455 font-semibold mt-1">
                            Enrolled in class: <span className="text-indigo-650 dark:text-indigo-400 font-bold">{studentClass ? studentClass.name : 'None'}</span>
                        </p>
                    </div>
                </div>

                {/* Top summary stats */}
                <div className="grid grid-cols-3 gap-2 w-full md:w-auto self-stretch">
                    <div className="bg-indigo-50/40 dark:bg-indigo-950/20 p-4 rounded-2xl text-center flex flex-col justify-center border border-indigo-50/20 dark:border-none">
                        <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
                            {stats.attendancePercentage}%
                        </span>
                        <span className="text-[9px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-wider mt-1.5">
                            Attendance
                        </span>
                    </div>

                    <div className="bg-emerald-50/40 dark:bg-emerald-950/20 p-4 rounded-2xl text-center flex flex-col justify-center border border-emerald-50/20 dark:border-none">
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                            {formatLKR(stats.totalPaid)}
                        </span>
                        <span className="text-[9px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-wider mt-1.5">
                            Total Paid
                        </span>
                    </div>

                    <div className="bg-rose-50/40 dark:bg-rose-950/20 p-4 rounded-2xl text-center flex flex-col justify-center border border-rose-55/10 dark:border-none">
                        <span className={`text-lg font-black font-mono ${stats.totalOutstanding > 0 ? 'text-rose-600 dark:text-rose-455' : 'text-slate-600 dark:text-slate-400'}`}>
                            {formatLKR(stats.totalOutstanding)}
                        </span>
                        <span className="text-[9px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-wider mt-1.5">
                            Balance Due
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs navigation */}
            <div className="border-b border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === tab
                                ? 'border-indigo-600 text-indigo-650 dark:text-indigo-400'
                                : 'border-transparent text-slate-600 dark:text-slate-455 hover:text-slate-900 dark:hover:text-slate-205 pb-2.5'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Panels */}
            <div className="mt-2">
                {/* Tab 1: Overview */}
                {activeTab === 'Overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal credentials */}
                        <div className="bg-white dark:bg-slate-905 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs space-y-4">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-2">
                                <User className="w-4 h-4 text-slate-400" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-slate-400 font-bold block mb-1">Full Name</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{student.name}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-bold block mb-1">Name with Initials</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{student.nameInitials}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-bold block mb-1">Date of Birth</span>
                                    <span className="font-semibold text-slate-850 dark:text-slate-200">{student.dob}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-bold block mb-1">Gender</span>
                                    <span className="font-semibold text-slate-850 dark:text-slate-200">{student.gender}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-bold block mb-1">Mobile Contact</span>
                                    <span className="font-semibold text-slate-850 dark:text-slate-250 flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-slate-400" />
                                        {student.phone}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-bold block mb-1">Email Address</span>
                                    <span className="font-semibold text-slate-850 dark:text-slate-250 flex items-center gap-1 select-all">
                                        <Mail className="w-3 h-3 text-slate-400" />
                                        {student.email}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-slate-400 font-bold block mb-1">School Name</span>
                                    <span className="font-semibold text-slate-850 dark:text-slate-200 flex items-center gap-1">
                                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                                        {student.school}
                                    </span>
                                </div>
                                <div className="col-span-2 border-t border-slate-50 dark:border-slate-800/80 pt-3">
                                    <span className="text-slate-400 font-bold block mb-1">Physical Address</span>
                                    <span className="font-semibold text-slate-850 dark:text-slate-200 flex items-center gap-1">
                                        <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        {student.address}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Parent info */}
                        <div className="bg-white dark:bg-slate-905 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs space-y-4">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-2">
                                <Users className="w-4 h-4 text-slate-400" />
                                Parent or Guardian Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-slate-400 font-bold block mb-1">Parent or Guardian Name</span>
                                    <span className="font-semibold text-slate-850 dark:text-slate-200">{student.parentName}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-bold block mb-1">Parent Contact Number</span>
                                    <span className="font-semibold text-slate-850 dark:text-slate-250 flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-slate-400" />
                                        {student.parentPhone}
                                    </span>
                                </div>
                                <div className="sm:col-span-2 border-t border-slate-50 dark:border-slate-800/80 pt-4">
                                    <span className="text-slate-400 font-bold block mb-1">Admission Join Date</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        {student.joinedDate}
                                    </span>
                                </div>
                                <div className="sm:col-span-2">
                                    <span className="text-slate-400 font-bold block mb-1">Admission Class Default Monthly Fee</span>
                                    <span className="font-extrabold text-slate-850 dark:text-slate-200 font-mono text-sm">
                                        {formatLKR(student.monthlyFee)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Attendance Registry */}
                {activeTab === 'Attendance' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xs">
                        <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/20">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Attendance Log for student
                            </span>
                            <span className="text-xs font-extrabold text-slate-650 dark:text-slate-350">
                                Presents: {attendanceData.presentCount} | Absents: {attendanceData.absentCount} | Late: {attendanceData.lateCount} | Excused: {attendanceData.excusedCount}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/30 dark:bg-slate-850/30 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                                        <th className="p-4 font-bold">Class Date</th>
                                        <th className="p-4 font-bold">Registered Subject Class</th>
                                        <th className="p-4 font-bold text-center">Status</th>
                                        <th className="p-4 font-bold">Lesson Attendance Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    {attendanceData.history.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-slate-400 font-semibold">
                                                This student has no archived attendance registers recorded.
                                            </td>
                                        </tr>
                                    ) : (
                                        attendanceData.history.map((log, index) => (
                                            <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 font-mono">
                                                    {log.date}
                                                </td>
                                                <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                                                    {log.className}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <StatusBadge status={log.status} />
                                                </td>
                                                <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">
                                                    {log.notes || '—'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab 3: Payments */}
                {activeTab === 'Fee Payments' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xs">
                        <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/20">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Payment Collection History
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/30 dark:bg-slate-850/30 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                                        <th className="p-4 font-bold">Receipt ID</th>
                                        <th className="p-4 font-bold">Billing Cycle</th>
                                        <th className="p-4 font-bold text-right">Invoiced Amount</th>
                                        <th className="p-4 font-bold text-right">Paid Amount</th>
                                        <th className="p-4 font-bold text-right">Remaining Balance</th>
                                        <th className="p-4 font-bold">Payment Date</th>
                                        <th className="p-4 font-bold">Payment Gateway</th>
                                        <th className="p-4 font-bold text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-105 dark:divide-slate-800 text-xs">
                                    {studentPayments.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="p-8 text-center text-slate-400 font-semibold">
                                                This student has no outstanding or settled transactions yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        studentPayments.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                                <td className="p-4 font-bold text-indigo-650 dark:text-indigo-400 font-mono">
                                                    {p.id}
                                                </td>
                                                <td className="p-4 font-semibold text-slate-850 dark:text-slate-205">
                                                    {p.month} {p.year}
                                                </td>
                                                <td className="p-4 text-right font-bold text-slate-800 dark:text-slate-200 font-mono">
                                                    {formatLKR(p.totalAmount)}
                                                </td>
                                                <td className="p-4 text-right font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                                                    {formatLKR(p.paidAmount)}
                                                </td>
                                                <td className="p-4 text-right font-bold font-mono">
                                                    <span className={p.balance > 0 ? 'text-rose-650' : 'text-slate-400'}>
                                                        {formatLKR(p.balance)}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                                                    {p.paymentDate || '—'}
                                                </td>
                                                <td className="p-4 text-slate-500 dark:text-slate-400 font-semibold">
                                                    {p.paymentMethod}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <StatusBadge status={p.status} />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab 4: Classes */}
                {activeTab === 'Classes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {studentClass ? (
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-0 right-0 h-2 bg-indigo-600 w-full"></div>
                                <div className="space-y-4 pt-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                                                {studentClass.name}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 font-mono">
                                                Class ID: {studentClass.id}
                                            </p>
                                        </div>
                                        <StatusBadge status={studentClass.status} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-xs border-t border-slate-50 dark:border-slate-800/80 pt-4">
                                        <div>
                                            <span className="text-slate-400 font-bold block mb-1">Subject</span>
                                            <span className="font-semibold text-slate-805 dark:text-slate-205 flex items-center gap-1">
                                                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                                {studentClass.subject}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-slate-400 font-bold block mb-1">Assigned Teacher</span>
                                            <span className="font-semibold text-slate-805 dark:text-slate-205 flex items-center gap-1">
                                                <User className="w-3.5 h-3.5 text-slate-400" />
                                                {studentClass.teacherName}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-slate-400 font-bold block mb-1">Weekly Schedule</span>
                                            <span className="font-semibold text-slate-805 dark:text-slate-205 flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                {studentClass.day}s
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-slate-400 font-bold block mb-1">Classroom & Capacity</span>
                                            <span className="font-semibold text-slate-805 dark:text-slate-205 flex items-center gap-1">
                                                <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                                                {studentClass.classroom} (Max {studentClass.capacity})
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-slate-400 font-bold block mb-1">Scheduled Hours</span>
                                            <span className="font-semibold text-slate-805 dark:text-slate-205 flex items-center gap-1 font-mono">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                {studentClass.startTime} - {studentClass.endTime}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-slate-400 font-bold block mb-1">Monthly Course Fee</span>
                                            <span className="font-extrabold text-indigo-500 font-mono text-sm leading-none block">
                                                {formatLKR(studentClass.monthlyFee)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center col-span-2">
                                <span className="text-slate-400 font-semibold text-xs block">
                                    This student is not enrolled in any class currently.
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 5: Notes */}
                {activeTab === 'Notes' && (
                    <div className="bg-white dark:bg-slate-905 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs space-y-4">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 pb-2 border-b border-slate-50 dark:border-slate-800">
                            <FileText className="w-4 h-4 text-slate-400" />
                            Academy Observations & Support Notes
                        </h3>
                        {student.notes ? (
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold italic bg-slate-50/50 dark:bg-slate-850/40 p-4 rounded-xl">
                                "{student.notes}"
                            </p>
                        ) : (
                            <p className="text-xs text-slate-400 font-semibold italic text-center py-6">
                                No observations or custom support records posted for this profile.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentProfile;
