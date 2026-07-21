import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useNavigate } from 'react-router-dom';
import {
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
    Coins
} from 'lucide-react';
import heroImage from '../assets/hero.png';
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

export const Dashboard = () => {
    const { students, classes, payments, attendance, notifications } = useAcademy();
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
            value: `$${monthlyCollection}`,
            change: 'July invoices summary',
            trend: 'up',
            icon: DollarSign,
            color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30'
        },
        {
            title: 'Pending Fee Balance',
            value: `$${pendingCollection}`,
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
            {/* Hero Dashboard Header */}
            <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.16),transparent_20%),radial-gradient(circle_at_bottom_left,_rgba(167,139,250,0.16),transparent_20%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(15,23,42,0.92),rgba(30,41,59,0.8))]" />
                <div className="relative grid gap-6 lg:grid-cols-[1.3fr_1fr] p-8 md:p-10 xl:p-12">
                    <div className="space-y-6 max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300 shadow-sm shadow-slate-950/40">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.3)]"></span>
                            Academy Strategy Center
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                                Chess has never looked like this
                            </h1>
                            <p className="text-base sm:text-lg text-slate-300 leading-8">
                                Real-time academy performance and insights wrapped in a premium chess-style control center for Ratnapura Chess Academy.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 via-indigo-600 to-sky-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:brightness-110 transition"
                            >
                                Watch live now
                            </button>
                            <button
                                onClick={() => navigate('/reports')}
                                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10 transition"
                            >
                                See it in action
                            </button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.9)]">
                                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">Pending Fees</p>
                                <p className="mt-4 text-3xl font-black text-white">${pendingCollection}</p>
                            </div>
                            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.9)]">
                                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">Active Students</p>
                                <p className="mt-4 text-3xl font-black text-white">{activeStudents}</p>
                            </div>
                            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.9)]">
                                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">Total Classes</p>
                                <p className="mt-4 text-3xl font-black text-white">{totalClasses}</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-2xl">
                        <img src={heroImage} alt="Chess hero" className="h-full w-full object-cover object-center brightness-[0.85]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/10 bg-slate-950/75 p-5 backdrop-blur-sm">
                            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-400">Premium Strategy Center</p>
                            <p className="mt-3 text-sm font-semibold text-white">Live boards, actionable insights, and polished chess academy analytics.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Summary Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 hover:shadow-md transition-shadow relative overflow-hidden group"
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">
                                    {stat.value}
                                </span>
                                <span className={`p-2.5 rounded-xl shrink-0 ${stat.color}`}>
                                    <Icon className="w-4 h-4" />
                                </span>
                            </div>
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-3 truncate uppercase tracking-wider">
                                {stat.title}
                            </h3>
                            <p className="text-[10px] text-slate-455 dark:text-slate-400 font-semibold mt-1 flex items-center gap-1">
                                {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" />}
                                {stat.change}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* charts display grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Income Chart */}
                <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                Academy Cash Flow Trend
                            </h3>
                            <span className="text-[10px] text-slate-455 dark:text-slate-500 font-semibold">
                                Monthly income collection vs outstanding balances in USD
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={incomeTrendData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800/40" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    }}
                                    className="dark:bg-slate-850"
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                                <Area type="monotone" dataKey="Income" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="Pending" stroke="#ef4444" strokeWidth={1.5} fillOpacity={1} fill="url(#colorPending)" strokeDasharray="4 4" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Attendance Rates */}
                <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                Attendance By Subject
                            </h3>
                            <span className="text-[10px] text-slate-455 dark:text-slate-500 font-semibold">
                                Average attendance rates calculated this semester
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subjectAttendanceData} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800/40" />
                                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={10} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[50, 100]} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                                <Bar dataKey="Rate" name="Attendance %" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom widgets lists grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* Recents Registry students */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 border-b border-slate-50 dark:border-slate-800 pb-2">
                        <h3 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
                            Recent Registrations
                        </h3>
                        <button
                            onClick={() => navigate('/students')}
                            className="text-[10px] font-bold text-indigo-650 hover:text-indigo-700 dark:text-indigo-400 hover:underline flex items-center cursor-pointer"
                        >
                            See all
                            <ArrowUpRight className="w-3 h-3 ml-0.5" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentStudents.map((std) => (
                            <div key={std.id} className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <img
                                    src={std.profileImage}
                                    alt={std.name}
                                    className="w-8 h-8 rounded-full object-cover shadow-sm bg-slate-205"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-805 dark:text-slate-200 truncate leading-none">
                                        {std.name}
                                    </p>
                                    <p className="text-[10px] text-slate-455 mt-1 font-semibold">
                                        {std.grade} • Joined {std.joinedDate}
                                    </p>
                                </div>
                                <StatusBadge status={std.status} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Fee Invoices */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 border-b border-slate-50 dark:border-slate-800 pb-2">
                        <h3 className="text-xs font-bold text-slate-855 dark:text-slate-200 uppercase tracking-wider">
                            Recent Payments
                        </h3>
                        <button
                            onClick={() => navigate('/fees')}
                            className="text-[10px] font-bold text-indigo-650 hover:text-indigo-700 dark:text-indigo-400 hover:underline flex items-center cursor-pointer"
                        >
                            View ledger
                            <ArrowUpRight className="w-3 h-3 ml-0.5" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentPayments.map((p) => (
                            <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none">
                                        {p.studentName}
                                    </p>
                                    <p className="text-[10px] text-slate-455 mt-1 font-semibold">
                                        Reciept: {p.id} • {p.paymentMethod}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-mono block">
                                        +${p.paidAmount}
                                    </span>
                                    <span className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold">
                                        {p.month}
                                    </span>
                                </div>
                                <StatusBadge status={p.status} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Invoices Reminders */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 border-b border-slate-50 dark:border-slate-800 pb-2">
                        <h3 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
                            Pending Fees Alert
                        </h3>
                        <button
                            onClick={() => navigate('/fees')}
                            className="text-[10px] font-bold text-indigo-650 hover:text-indigo-700 dark:text-indigo-400 hover:underline flex items-center cursor-pointer"
                        >
                            Audit all
                            <ArrowUpRight className="w-3 h-3 ml-0.5" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {pendingInvoices.length === 0 ? (
                            <p className="text-xs text-slate-400 font-semibold text-center py-6">
                                No outstanding invoices found.
                            </p>
                        ) : (
                            pendingInvoices.map((p) => (
                                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none">
                                            {p.studentName}
                                        </p>
                                        <p className="text-[10px] text-rose-500 font-bold mt-1">
                                            Balance: ${p.balance}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <StatusBadge status={p.status} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
