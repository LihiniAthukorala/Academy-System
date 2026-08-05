import React, { useState } from 'react';
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
    const { students, teachers, classes, payments, attendance, notifications, addNotification, triggerToast } = useAcademy();
    const navigate = useNavigate();
    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeMessage, setNoticeMessage] = useState('');
    const [noticeType, setNoticeType] = useState('info');

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

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();
    const currentMonthName = today.toLocaleString('default', { month: 'long' });
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarCells = Array.from({ length: Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7 });
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-10">
            <section className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
                <div className="rounded-[2rem] bg-slate-950 border border-slate-800 p-6 shadow-sm text-slate-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-100">Dashboard</h1>
                            <p className="mt-2 text-sm text-slate-400">Quick actions, admissions summary and attendance controls.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 text-center">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Total Classes</p>
                                <p className="mt-3 text-2xl font-black text-slate-100">{totalClasses}</p>
                            </div>
                            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 text-center">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Total Student</p>
                                <p className="mt-3 text-2xl font-black text-slate-100">{totalStudents}</p>
                            </div>
                            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 text-center">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Total Staff</p>
                                <p className="mt-3 text-2xl font-black text-slate-100">{teachers.length}</p>
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
                            { label: 'Staff Attendance', icon: UserCheck, route: null },
                            { label: 'Staff Leave', icon: CalendarDays, route: null }
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => item.route && navigate(item.route)}
                                    className={`group flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-slate-800 bg-slate-950 p-5 text-center text-slate-100 transition hover:-translate-y-0.5 ${item.route ? 'cursor-pointer hover:border-blue-500' : 'cursor-not-allowed opacity-70'}`}
                                >
                                    <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-950 text-white shadow-lg shadow-blue-200/10">
                                        <Icon className="w-6 h-6" />
                                    </span>
                                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[2rem] border border-slate-800 bg-slate-950 p-6 shadow-sm text-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Calendar</p>
                                <h2 className="text-xl font-bold text-slate-100">{currentMonthName} {currentYear}</h2>
                            </div>
                            <button
                                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-blue-500 hover:bg-slate-800"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            >
                                Today
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-[11px] text-slate-400 mb-3">
                            {weekdays.map((day) => (
                                <div key={day} className="font-semibold uppercase tracking-[0.2em]">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-sm text-slate-100">
                            {calendarCells.map((_, idx) => {
                                const dayNumber = idx - firstDayOfMonth + 1;
                                const isCurrentDay = dayNumber === currentDay;
                                const isValidDay = dayNumber >= 1 && dayNumber <= daysInMonth;

                                return (
                                    <div
                                        key={idx}
                                        className={`rounded-[1.75rem] h-14 flex items-center justify-center transition ${isValidDay ? 'bg-slate-900 text-slate-100 shadow-sm shadow-slate-950/30 hover:bg-slate-800' : 'bg-transparent'} ${isCurrentDay ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-lg shadow-blue-500/20' : ''}`}
                                    >
                                        {isValidDay ? dayNumber : ''}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="rounded-[2rem] border border-slate-800 bg-slate-950 p-6 shadow-sm text-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-100">Notice Board</h2>
                            <Bell className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="space-y-4">
                            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-4 shadow-sm">
                                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Notice Title</label>
                                <input
                                    type="text"
                                    value={noticeTitle}
                                    onChange={(e) => setNoticeTitle(e.target.value)}
                                    placeholder="Enter notice heading"
                                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
                                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Notice Message</label>
                                <textarea
                                    value={noticeMessage}
                                    onChange={(e) => setNoticeMessage(e.target.value)}
                                    placeholder="Write the notice details here"
                                    rows={4}
                                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
                                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Type</label>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {['info', 'success', 'warning', 'error'].map((typeOption) => (
                                        <button
                                            key={typeOption}
                                            type="button"
                                            onClick={() => setNoticeType(typeOption)}
                                            className={`rounded-3xl border px-4 py-2 text-sm font-semibold transition ${noticeType === typeOption ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300'}`}
                                        >
                                            {typeOption}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!noticeTitle.trim() || !noticeMessage.trim()) {
                                        triggerToast('Please provide both title and message for the notice.', 'warning');
                                        return;
                                    }
                                    addNotification(noticeTitle.trim(), noticeMessage.trim(), 'dashboard', noticeType);
                                    triggerToast('Notice added to the board.', 'success');
                                    setNoticeTitle('');
                                    setNoticeMessage('');
                                    setNoticeType('info');
                                }}
                                className="w-full rounded-3xl bg-blue-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200/10 transition hover:-translate-y-0.5 hover:bg-blue-800"
                            >
                                Publish Notice
                            </button>
                        </div>
                        {notifications.length > 0 && (
                            <div className="mt-6 space-y-3">
                                {notifications.slice(0, 3).map((notice) => (
                                    <div key={notice.id} className="rounded-[1.75rem] bg-slate-100 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{notice.type || 'Notice'}</p>
                                            <span className="text-[10px] text-slate-500">{new Date(notice.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="mt-2 font-bold text-slate-900">{notice.title}</p>
                                        <p className="mt-1 text-sm text-slate-600 line-clamp-2">{notice.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
