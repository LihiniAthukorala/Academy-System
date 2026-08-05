import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UserCheck,
    CalendarDays,
    DollarSign,
    AlertCircle,
    BookOpen,
    Plus,
    ArrowUpRight,
    TrendingUp,
    UserPlus,
    Coins,
    Bell,
    Percent
} from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import StatusBadge from '../components/StatusBadge';
import { formatLKR } from '../utils/currency';

export const Dashboard = () => {
    const { students, teachers, classes, payments, attendance, notifications } = useAcademy();
    const navigate = useNavigate();

    // 1. Total & Active Students
    const totalStudents = students.length;
    const activeStudents = students.filter((s) => s.status === 'Active').length;

    // 2. Today's Attendance Rate
    const todayDateStr = '2026-07-21'; // App static date representation
    const todayAttendanceLogs = attendance.filter((a) => a.date === todayDateStr);
    let todayAttendancePercent = 0;
    if (todayAttendanceLogs.length > 0) {
        let totalRecords = 0;
        let presentOrLate = 0;
        todayAttendanceLogs.forEach((log) => {
            log.records.forEach((r) => {
                totalRecords++;
                if (r.status === 'Present' || r.status === 'Late' || r.status === 'Excused') {
                    presentOrLate++;
                }
            });
        });
        todayAttendancePercent = totalRecords > 0 ? Math.round((presentOrLate / totalRecords) * 100) : 100;
    } else {
        // Fallback overall attendance average
        let totalRecords = 0;
        let presentOrLate = 0;
        attendance.forEach(log => {
            log.records.forEach(r => {
                totalRecords++;
                if (r.status === 'Present' || r.status === 'Late' || r.status === 'Excused') presentOrLate++;
            });
        });
        todayAttendancePercent = totalRecords > 0 ? Math.round((presentOrLate / totalRecords) * 100) : 92;
    }

    // 3. Financial calculations (July 2026)
    const currentMonthPayments = payments.filter((p) => p.month === 'July' && p.year === '2026');
    const monthlyCollection = currentMonthPayments.reduce((sum, p) => sum + Number(p.paidAmount || 0), 0);
    const pendingCollection = payments
        .filter((p) => p.status === 'Pending' || p.status === 'Overdue' || p.status === 'Partially Paid')
        .reduce((sum, p) => sum + Number(p.balance || 0), 0);

    // 4. Total Classes
    const totalClasses = classes.length;

    // Stats Card definitions
    const stats = [
        {
            title: 'Total Students',
            value: totalStudents,
            change: '+14% from last term',
            trend: 'up',
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30'
        },
        {
            title: 'Active Students',
            value: activeStudents,
            change: '94.2% engagement rate',
            trend: 'up',
            icon: UserCheck,
            color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
        },
        {
            title: "Today's Attendance",
            value: `${todayAttendancePercent}%`,
            change: '1 class active today',
            trend: 'flat',
            icon: CalendarDays,
            color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
        },
        {
            title: 'Monthly Collection',
            value: formatLKR(monthlyCollection),
            change: 'July invoices summary',
            trend: 'up',
            icon: DollarSign,
            color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30'
        },
        {
            title: 'Pending Fee Balance',
            value: formatLKR(pendingCollection),
            change: 'Action required',
            trend: 'down',
            icon: AlertCircle,
            color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30'
        },
        {
            title: 'Total Classes',
            value: totalClasses,
            change: 'Across 4 subjects',
            trend: 'flat',
            icon: BookOpen,
            color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
        }
    ];

    // Recharts Monthly Revenue Model (computed dynamically or standard trend)
    const incomeTrendData = [
        { name: 'Jan', Income: 850, Pending: 120 },
        { name: 'Feb', Income: 1100, Pending: 80 },
        { name: 'Mar', Income: 1250, Pending: 190 },
        { name: 'Apr', Income: 980, Pending: 110 },
        { name: 'May', Income: 1400, Pending: 150 },
        { name: 'Jun', Income: 1550, Pending: 200 },
        { name: 'Jul', Income: monthlyCollection, Pending: pendingCollection }
    ];

    // Recharts Subject-wise attendance calculation
    const subjectAttendanceData = [
        { subject: 'Mathematics', Rate: 94 },
        { subject: 'Physics', Rate: 88 },
        { subject: 'Chemistry', Rate: 91 },
        { subject: 'English', Rate: 95 }
    ];

    // Feeds
    const recentPayments = payments.slice(0, 4);
    const pendingInvoices = payments.filter((p) => p.status === 'Pending' || p.status === 'Overdue').slice(0, 4);
    const recentStudents = students.slice(0, 4);

    return (
        <div className="space-y-10">
            <section className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
                <div className="rounded-[2rem] bg-white border border-slate-200 p-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
                            <p className="mt-2 text-sm text-slate-500">Quick actions, admissions summary and attendance controls.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Total Classes</p>
                                <p className="mt-3 text-2xl font-black text-slate-900">{totalClasses}</p>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Total Student</p>
                                <p className="mt-3 text-2xl font-black text-slate-900">{totalStudents}</p>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Total Staff</p>
                                <p className="mt-3 text-2xl font-black text-slate-900">{teachers.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {[
                            { label: 'Add Staff', icon: Users, route: '/teachers?action=add' },
                            { label: 'Add Student', icon: Plus, route: '/students/enroll' },
                            { label: 'Take Attendance', icon: UserPlus, route: '/attendance?action=mark' },
                            { label: 'Collect Fees', icon: Coins, route: '/fees?action=add' },
                            { label: 'Add Notice', icon: Bell, route: null },
                            { label: 'Staff Attendance', icon: UserCheck, route: '/attendance?action=mark' },
                            { label: 'Staff Leave', icon: CalendarDays, route: null }
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => item.route && navigate(item.route)}
                                    className={`group flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 text-center transition hover:-translate-y-0.5 ${item.route ? 'cursor-pointer hover:border-blue-400' : 'cursor-not-allowed opacity-70'}`}
                                >
                                    <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-950 text-white shadow-lg shadow-blue-200/10">
                                        <Icon className="w-6 h-6" />
                                    </span>
                                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Pending Admissions</p>
                                <p className="mt-2 text-3xl font-black text-slate-900">{students.filter((s) => s.status !== 'Active').length}</p>
                            </div>
                            <div className="rounded-3xl bg-white p-3 text-blue-950 shadow-sm">
                                <DollarSign className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600">Admissions awaiting verification and pending registration are shown here for quick follow-up.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Calendar</p>
                                <h2 className="text-xl font-bold text-slate-900">May 2025</h2>
                            </div>
                            <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Today</button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-[11px] text-slate-500 mb-3">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="font-bold">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-sm text-slate-700">
                            {Array.from({ length: 35 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`rounded-2xl py-3 ${idx === 10 ? 'bg-blue-950 text-white' : 'bg-slate-100'}`}
                                >
                                    {idx < 31 ? idx + 1 : ''}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Notice Board</h2>
                            <Bell className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="space-y-4">
                            <div className="rounded-[1.75rem] bg-white p-4 shadow-sm border border-slate-200">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Trip</p>
                                <p className="mt-2 font-bold text-slate-900">5 June 2025</p>
                            </div>
                            <div className="rounded-[1.75rem] bg-white p-4 shadow-sm border border-slate-200">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Sports Day</p>
                                <p className="mt-2 font-bold text-slate-900">15 June 2025</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
