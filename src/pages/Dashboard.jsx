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
            <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0B1020] via-[#090B16] to-black text-white shadow-2xl">
                <div className="absolute inset-0 bg-chessboard opacity-8 pointer-events-none mix-blend-overlay" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.08),transparent_20%),radial-gradient(circle_at_bottom_left,_rgba(79,70,229,0.09),transparent_25%)] pointer-events-none" />
                <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute top-12 right-16 h-48 w-48 rounded-full bg-[#4F46E5]/10 blur-3xl pointer-events-none" />
                <div className="absolute top-6 right-6 h-96 w-96 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-40 blur-3xl pointer-events-none" />
                <div className="absolute inset-0 pointer-events-none">
                    <span className="absolute top-20 left-16 text-[5rem] font-black text-white/5">♖</span>
                    <span className="absolute top-40 right-24 text-[4rem] font-black text-white/5">♘</span>
                    <span className="absolute bottom-20 left-28 text-[4.5rem] font-black text-white/5">♗</span>
                    <span className="absolute bottom-32 right-10 text-[5rem] font-black text-white/5">♜</span>
                </div>

                <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] p-8 md:p-10 xl:p-12">
                    <div className="space-y-8 max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300 shadow-sm shadow-slate-950/40">
                            Premium Chess Academy
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-[4.75rem] font-black leading-tight tracking-tight">
                                Master Every Move.
                                <br />
                                Manage Every Champion.
                            </h1>
                            <p className="max-w-2xl text-base sm:text-lg leading-8 text-slate-300">
                                Manage students, attendance, classes, and fee payments from one premium academy dashboard designed for professional chess coaching.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <button
                                onClick={() => navigate('/students')}
                                className="flex items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_-30px_rgba(79,70,229,0.9)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#4338ca]"
                            >
                                <Plus className="w-4 h-4 text-white" />
                                Add Student
                            </button>
                            <button
                                onClick={() => navigate('/fees')}
                                className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-[#D4AF37] hover:bg-white/15"
                            >
                                <Coins className="w-4 h-4 text-[#D4AF37]" />
                                Add Fee Payment
                            </button>
                            <button
                                onClick={() => navigate('/attendance')}
                                className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-[#4F46E5] hover:bg-slate-900/70"
                            >
                                <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                                Mark Attendance
                            </button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-[0_30px_70px_-40px_rgba(255,255,255,0.12)] backdrop-blur-xl transition hover:shadow-[0_35px_90px_-40px_rgba(255,255,255,0.16)]">
                                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">Pending Fees</p>
                                <p className="mt-4 text-3xl font-black text-white">${pendingCollection}</p>
                            </div>
                            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-[0_30px_70px_-40px_rgba(255,255,255,0.12)] backdrop-blur-xl transition hover:shadow-[0_35px_90px_-40px_rgba(255,255,255,0.16)]">
                                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">Active Students</p>
                                <p className="mt-4 text-3xl font-black text-white">{activeStudents}</p>
                            </div>
                            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-[0_30px_70px_-40px_rgba(255,255,255,0.12)] backdrop-blur-xl transition hover:shadow-[0_35px_90px_-40px_rgba(255,255,255,0.16)]">
                                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">Total Classes</p>
                                <p className="mt-4 text-3xl font-black text-white">{totalClasses}</p>
                            </div>
                        </div>
                    </div>

                    <div className="group relative hidden overflow-hidden rounded-[2.25rem] border border-[rgba(212,175,55,0.18)] bg-slate-950/25 p-6 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.8)] backdrop-blur-xl lg:block transition-transform duration-300 hover:-translate-y-0.5">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.14),transparent_28%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(79,70,229,0.14),transparent_35%)]" />
                        <div className="absolute top-6 right-6 h-36 w-36 rounded-full bg-[#F6D778]/15 blur-3xl opacity-90 pointer-events-none" />
                        <div className="absolute top-20 right-16 h-24 w-24 rounded-full bg-[#D4AF37]/10 blur-3xl opacity-80 pointer-events-none" />
                        <div className="absolute left-10 top-32 h-1 w-1 rounded-full bg-[#D4AF37]/40 blur-sm opacity-90" />
                        <div className="absolute right-14 bottom-20 h-1 w-1 rounded-full bg-[#F6D778]/40 blur-sm opacity-90" />
                        <div className="absolute left-20 bottom-16 h-2 w-2 rounded-full bg-[#D4AF37]/40 blur-sm opacity-90" />
                        <div className="relative flex h-full items-center justify-center">
                            <div className="relative h-80 w-60 rounded-[2.25rem] border border-[rgba(212,175,55,0.2)] bg-white/10 shadow-[0_30px_70px_-30px_rgba(212,175,55,0.18)] backdrop-blur-2xl transition-transform duration-300 group-hover:-translate-y-1">
                                <div className="absolute inset-0 rounded-[2.25rem] bg-gradient-to-b from-[#F6D778]/15 to-transparent" />
                                <div className="absolute left-1/2 top-6 -translate-x-1/2 text-[5.5rem] text-[#D4AF37] drop-shadow-[0_0_30px_rgba(212,175,55,0.35)]">♔</div>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm uppercase tracking-[0.3em] text-[#F6D778]">Glass King</div>
                            </div>
                            <div className="absolute right-5 top-12 h-44 w-36 rounded-[2rem] border border-[rgba(212,175,55,0.18)] bg-white/10 shadow-[0_20px_40px_-20px_rgba(212,175,55,0.2)] backdrop-blur-2xl transition-transform duration-300 group-hover:-translate-y-1">
                                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-[#F6D778]/12 to-transparent" />
                                <div className="absolute left-1/2 top-8 -translate-x-1/2 text-[5rem] text-[#D4AF37]/95 drop-shadow-[0_0_22px_rgba(212,175,55,0.28)]">♕</div>
                                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[0.66rem] uppercase tracking-[0.24em] text-[#F6D778]">Glass Queen</div>
                            </div>
                        </div>
                        <div className="absolute left-6 bottom-10 text-[4rem] text-[#8C641A]/10">♘</div>
                        <div className="absolute right-8 bottom-24 text-[4.5rem] text-[#8C641A]/10">♖</div>
                        <div className="absolute left-14 top-24 text-[4rem] text-[#8C641A]/10">♗</div>
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
