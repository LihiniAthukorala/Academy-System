import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
    TrendingUp,
    DollarSign,
    Users,
    Award,
    Calendar,
    Download,
    Printer,
    ChevronRight,
    PieChart as PieIcon,
    Percent,
    LineChart as LineIcon
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
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';

export const Reports = () => {
    const { students, classes, payments, attendance } = useAcademy();

    // Filters state
    const [filterYear, setFilterYear] = useState('2026');
    const [filterClass, setFilterClass] = useState('All');

    // Compute metrics dynamically based on active filter configs

    // Total Invoiced & Collected & Outstanding
    const filteredPayments = payments.filter((p) => {
        const matchesYear = p.year === filterYear;
        const matchesClass = filterClass === 'All' || p.classId === filterClass;
        return matchesYear && matchesClass;
    });

    const totalInvoiced = filteredPayments.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalCollected = filteredPayments.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalOutstanding = filteredPayments.reduce((sum, p) => sum + p.balance, 0);

    // Overall attendance rate
    const filteredAttendanceLogs = attendance.filter((a) => {
        return filterClass === 'All' || a.classId === filterClass;
    });

    let totalRecords = 0;
    let totalPresentOrLate = 0;
    filteredAttendanceLogs.forEach((log) => {
        log.records.forEach((r) => {
            totalRecords++;
            if (r.status === 'Present' || r.status === 'Late' || r.status === 'Excused') {
                totalPresentOrLate++;
            }
        });
    });
    const avgAttendanceRate = totalRecords > 0 ? Math.round((totalPresentOrLate / totalRecords) * 100) : 94;

    // Class Capacity Utilization
    const activeStudents = students.filter(s => s.status === 'Active');
    const totalClassCapacity = classes.reduce((sum, c) => sum + c.capacity, 0);
    const classUtilization = totalClassCapacity > 0 ? Math.round((activeStudents.length / totalClassCapacity) * 100) : 75;

    // Chart 1: Monthly cash revenue history
    const monthlyDataMap = {};
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    months.forEach((m) => {
        monthlyDataMap[m] = { name: m.slice(0, 3), Invoiced: 0, Collected: 0 };
    });

    filteredPayments.forEach((p) => {
        if (monthlyDataMap[p.month]) {
            monthlyDataMap[p.month].Invoiced += p.totalAmount;
            monthlyDataMap[p.month].Collected += p.paidAmount;
        }
    });

    // slice to first 7 months (or active months)
    const monthlyCashTrend = Object.values(monthlyDataMap).slice(0, 7);

    // Chart 2: Subject-wise Collection Distribution
    const subjectDataMap = {};
    filteredPayments.forEach((p) => {
        const cls = classes.find((c) => c.id === p.classId);
        const sub = cls ? cls.subject : 'Others';
        if (!subjectDataMap[sub]) {
            subjectDataMap[sub] = 0;
        }
        subjectDataMap[sub] += p.paidAmount;
    });

    const subjectCollection = Object.entries(subjectDataMap).map(([name, value]) => ({
        name,
        value
    }));

    const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

    // Chart 3: Class-wise Attendance Comparison
    const classAttendanceData = classes.map((c) => {
        const logs = attendance.filter((a) => a.classId === c.id);
        let totalR = 0;
        let presentR = 0;
        logs.forEach((log) => {
            log.records.forEach((r) => {
                totalR++;
                if (r.status === 'Present' || r.status === 'Late' || r.status === 'Excused') {
                    presentR++;
                }
            });
        });
        const rate = totalR > 0 ? Math.round((presentR / totalR) * 100) : 90;
        return { name: c.name.slice(0, 16), Rate: rate };
    });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            {/* Print styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report-area, #printable-report-area * {
            visibility: visible;
          }
          #printable-report-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-805 dark:text-slate-105 my-0">
                        Analytics & Reports Center
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-455 font-semibold mt-0.5">
                        Audit long-term financial progression pipelines, subject allocations, and student attendance engagement.
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-205 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-xs cursor-pointer"
                    >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        Print Report Sheet
                    </button>
                </div>
            </div>

            {/* Filters box (gold-accented) */}
            <div className="bg-[rgba(212,175,55,0.03)] dark:bg-[#071018]/60 p-4 rounded-2xl border border-[rgba(212,175,55,0.12)] shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                    {/* Year option */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#0b1220] dark:text-[#F8FAFC]">Historical Year</label>
                        <select
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="px-3 py-2 w-full rounded-xl border border-[rgba(212,175,55,0.12)] bg-white/5 dark:bg-[#0B1020]/60 text-[#0b1220] dark:text-[#F8FAFC] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                        >
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                        </select>
                    </div>

                    {/* Class option */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#0b1220] dark:text-[#F8FAFC]">Selected Class Course</label>
                        <select
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="px-3 py-2 w-full rounded-xl border border-[rgba(212,175,55,0.12)] bg-white/5 dark:bg-[#0B1020]/60 text-[#0b1220] dark:text-[#F8FAFC] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                        >
                            <option value="All">All Classes Combined</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-[rgba(212,175,55,0.08)] dark:bg-[rgba(212,175,55,0.06)] p-3 rounded-xl border border-[rgba(212,175,55,0.12)] flex items-center justify-between self-end text-xs">
                        <span className="text-sm font-semibold text-[#1f2937] dark:text-[#F8FAFC]">Current Year Filters Active</span>
                        <span className="text-sm font-bold text-[#8C641A] dark:text-[#F6D778]">{filterYear} Cycle</span>
                    </div>

                </div>
            </div>

            {/* Printable Area content wrapper */}
            <div id="printable-report-area" className="space-y-6">

                {/* Metric summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Invoiced */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex justify-between items-center">
                        <div>
                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Annual Invoiced sum</span>
                            <span className="text-lg font-black text-slate-850 dark:text-slate-200 mt-2 block font-mono">${totalInvoiced}</span>
                        </div>
                        <span className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-slate-400">
                            <DollarSign className="w-5 h-5" />
                        </span>
                    </div>

                    {/* Collected */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex justify-between items-center">
                        <div>
                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Cleared Collected Revenue</span>
                            <span className="text-lg font-black text-emerald-650 mt-2 block font-mono">${totalCollected}</span>
                        </div>
                        <span className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600">
                            <TrendingUp className="w-5 h-5" />
                        </span>
                    </div>

                    {/* Outstanding */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex justify-between items-center">
                        <div>
                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Awaiting Balance Arrears</span>
                            <span className="text-lg font-black text-rose-650 mt-2 block font-mono">${totalOutstanding}</span>
                        </div>
                        <span className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500">
                            <Award className="w-5 h-5" />
                        </span>
                    </div>

                    {/* Attendance */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex justify-between items-center">
                        <div>
                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Average Attendance Rate</span>
                            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-2 block font-mono">{avgAttendanceRate}%</span>
                        </div>
                        <span className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-505">
                            <Percent className="w-5 h-5" />
                        </span>
                    </div>

                </div>

                {/* Charts graphs grids */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Monthly financial cash flow */}
                    <div className="bg-white dark:bg-slate-905 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs lg:col-span-2">
                        <h4 className="text-xs font-bold text-[#F6D778] uppercase tracking-widest mb-6 block">
                            Invoiced Billing vs Cleared Cash
                        </h4>
                        <div className="w-full h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyCashTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800/40" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                                    <Bar dataKey="Invoiced" name="Invoiced Amount ($)" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={24} />
                                    <Bar dataKey="Collected" name="Collected Paid ($)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Subject collection distribution */}
                    <div className="bg-white dark:bg-slate-905 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                        <h4 className="text-xs font-bold text-[#F6D778] uppercase tracking-widest mb-6 block">
                            Subject Collection Share
                        </h4>

                        <div className="w-full h-56 relative flex justify-center items-center">
                            {subjectCollection.length === 0 ? (
                                <span className="text-xs text-slate-400 font-semibold italic">No collections registered</span>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={subjectCollection}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {subjectCollection.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* legend checklist specs */}
                        <div className="space-y-1.5 text-[10px] font-bold border-t border-slate-50 dark:border-slate-800/80 pt-3">
                            {subjectCollection.map((entry, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                        <span className="text-slate-500">{entry.name}</span>
                                    </div>
                                    <span className="text-slate-800 dark:text-slate-205 font-mono">${entry.value}</span>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Class Attendance Comparisons bar charts */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs lg:col-span-3">
                        <h4 className="text-xs font-bold text-[#F6D778] uppercase tracking-widest mb-6 block">
                            Class Attendance rate performance comparison
                        </h4>
                        <div className="w-full h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={classAttendanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800/40" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[60, 100]} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                                    <Bar dataKey="Rate" name="Attendance Rate %" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Reports;
