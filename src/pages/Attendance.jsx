import React, { useState, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useSearchParams } from 'react-router-dom';
import {
    Calendar,
    BookOpen,
    CheckCircle,
    HelpCircle,
    Clock,
    XCircle,
    UserCheck,
    Search,
    Plus,
    RefreshCw,
    Eye,
    FileCheck2,
    Trash2,
    X,
    AlertCircle
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import ConfirmationModal from '../components/ConfirmationModal';

export const Attendance = () => {
    const {
        students,
        classes,
        attendance,
        saveAttendance,
        deleteAttendanceLog,
        triggerToast
    } = useAcademy();

    const [searchParams, setSearchParams] = useSearchParams();

    // Primary navigation views: 'mark' or 'history'
    const [activeView, setActiveView] = useState('mark');

    // Mark Attendance panel states
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [records, setRecords] = useState([]); // Array of { studentId, studentName, status, notes }

    // History panel states
    const [historySearchTerm, setHistorySearchTerm] = useState('');
    const [historyFilterClass, setHistoryFilterClass] = useState('All');
    const [historyFilterDate, setHistoryFilterDate] = useState('');

    // Delete log confirmation state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [logToDelete, setLogToDelete] = useState(null);

    // Synchronize dashboard mark attendance query params
    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'mark') {
            setActiveView('mark');
            if (classes.length > 0 && !selectedClassId) {
                setSelectedClassId(classes[0].id);
            }
            searchParams.delete('action');
            setSearchParams(searchParams);
        }
    }, [searchParams, classes]);

    // Load students or existing attendance rolls when Class or Date switches
    useEffect(() => {
        if (!selectedClassId || selectedClassId === '') {
            setRecords([]);
            return;
        }

        // Check if attendance is already logged for this Class and Date
        const existingLog = attendance.find(
            (a) => a.classId === selectedClassId && a.date === selectedDate
        );

        if (existingLog) {
            // Load pre-existing state
            const mapped = existingLog.records.map((r) => {
                // Safe check for latest name/details
                const std = students.find((s) => s.id === r.studentId);
                return {
                    studentId: r.studentId,
                    studentName: std ? std.name : r.studentName,
                    profileImage: std ? std.profileImage : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
                    status: r.status,
                    notes: r.notes || ''
                };
            });
            setRecords(mapped);
            triggerToast('Draft status loaded from attendance registry.', 'info');
        } else {
            // Initialize new attendance sheet with enrolled students
            const enrolledStudents = students.filter(
                (s) => s.classId === selectedClassId && s.status === 'Active'
            );
            const mapped = enrolledStudents.map((s) => ({
                studentId: s.id,
                studentName: s.name,
                profileImage: s.profileImage,
                status: 'Present', // Default status is present
                notes: ''
            }));
            setRecords(mapped);
        }
    }, [selectedClassId, selectedDate, attendance, students]);

    // Update a single student status row
    const handleStatusChange = (studentId, status) => {
        setRecords((prev) =>
            prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
        );
    };

    // Update a single student notes row
    const handleNotesChange = (studentId, notes) => {
        setRecords((prev) =>
            prev.map((r) => (r.studentId === studentId ? { ...r, notes } : r))
        );
    };

    // Quick Action: Mark All Selected
    const markAllStatus = (status) => {
        setRecords((prev) => prev.map((r) => ({ ...r, status })));
        triggerToast(`Marked all sheet students as ${status}.`, 'info');
    };

    // Save changes to ledger
    const handleSubmitAttendance = (e) => {
        e.preventDefault();
        if (!selectedClassId || selectedClassId === '') {
            triggerToast('Please select a class first.', 'error');
            return;
        }
        if (records.length === 0) {
            triggerToast('No active students found in the selected class directory.', 'warning');
            return;
        }

        const payloadRecords = records.map((r) => ({
            studentId: r.studentId,
            studentName: r.studentName,
            status: r.status,
            notes: r.notes
        }));

        saveAttendance(selectedClassId, selectedDate, payloadRecords);
        // Switch to history tab to reflect save
        setActiveView('history');
    };

    const getClassName = (classId) => {
        const cls = classes.find((c) => c.id === classId);
        return cls ? cls.name : 'Unknown';
    };

    const currentLog = attendance.find(
        (log) => log.classId === selectedClassId && log.date === selectedDate
    );
    const presentCount = records.filter((record) => record.status === 'Present').length;
    const absentCount = records.filter((record) => record.status === 'Absent').length;

    // Filter Attendance Logs History
    const filteredHistory = attendance.filter((log) => {
        const matchesSearch = log.className.toLowerCase().includes(historySearchTerm.toLowerCase());
        const matchesClass = historyFilterClass === 'All' || log.classId === historyFilterClass;
        const matchesDate = historyFilterDate === '' || log.date === historyFilterDate;

        return matchesSearch && matchesClass && matchesDate;
    });

    const getLogStats = (recordsList) => {
        const total = recordsList.length;
        const present = recordsList.filter((r) => r.status === 'Present').length;
        const late = recordsList.filter((r) => r.status === 'Late').length;
        const absent = recordsList.filter((r) => r.status === 'Absent').length;
        const excused = recordsList.filter((r) => r.status === 'Excused').length;

        const rate = total > 0 ? Math.round(((present + late + excused) / total) * 100) : 100;
        return { total, present, late, absent, excused, rate };
    };

    // Reload history record into Marking workspace
    const handleReloadLog = (log) => {
        setSelectedClassId(log.classId);
        setSelectedDate(log.date);
        setActiveView('mark');
    };

    // Delete Log Dialogs
    const confirmDeleteLog = (log) => {
        setLogToDelete(log);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (logToDelete) {
            deleteAttendanceLog(logToDelete.id);
        }
        setDeleteModalOpen(false);
        setLogToDelete(null);
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header title */}
            <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-sky-400/15 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70 p-5 shadow-xl shadow-slate-950/20 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-6 sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full border border-sky-300/10" />
                <div className="pointer-events-none absolute -right-8 -top-20 h-56 w-56 rounded-full border border-sky-300/10" />
                <div className="relative min-w-0 flex-1">
                    <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-300/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-200">
                        <Calendar className="h-3.5 w-3.5" />
                        Academy records
                    </span>
                    <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                        Attendance registry
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                        Mark lesson attendance, record notes, and review previous class registers.
                    </p>
                </div>

                {/* View togglers button */}
                <div className="relative inline-flex w-full shrink-0 rounded-xl border border-white/10 bg-slate-950/70 p-1 sm:w-auto">
                    <button
                        onClick={() => setActiveView('mark')}
                        className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-xs font-bold transition-all sm:flex-none ${activeView === 'mark'
                                ? 'bg-sky-500 text-white shadow-lg shadow-sky-950/30'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <UserCheck className="w-4 h-4" />
                        Mark sheet
                    </button>
                    <button
                        onClick={() => setActiveView('history')}
                        className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-xs font-bold transition-all sm:flex-none ${activeView === 'history'
                                ? 'bg-sky-500 text-white shadow-lg shadow-sky-950/30'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Clock className="w-4 h-4" />
                        History
                    </button>
                </div>
            </div>

            {/* Main View: Mark Attendance */}
            {activeView === 'mark' && (
                <div className="space-y-6 animate-fade-in">

                    {/* Selecting Class & date */}
                    <form onSubmit={handleSubmitAttendance} className="space-y-6">
                        <div className="rounded-2xl border border-sky-400/25 bg-gradient-to-br from-slate-900 to-slate-900/80 p-4 shadow-lg shadow-slate-950/20 sm:p-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                                {/* Select Class */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wide text-slate-300">
                                        Class *
                                    </label>
                                    <select
                                        value={selectedClassId}
                                        onChange={(e) => setSelectedClassId(e.target.value)}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-400/10"
                                    >
                                        <option value="">Choose Class</option>
                                        {classes.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} ({c.teacherName})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Select Date */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wide text-slate-300">
                                        Attendance date *
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-400/10"
                                    />
                                </div>

                                {/* Info summary */}
                                {selectedClassId !== '' && records.length > 0 && (
                                    <div className="flex items-center justify-between gap-3 rounded-xl border border-sky-400/20 bg-sky-400/5 p-4 self-end">
                                        <div className="space-y-1 text-sm">
                                            <p className="font-semibold text-slate-300">Enrolled <span className="font-bold text-white">{records.length} students</span></p>
                                            <p className="font-semibold text-slate-300">Status <span className={`font-bold ${currentLog ? 'text-emerald-300' : 'text-amber-200'}`}>{currentLog ? 'Saved' : 'Draft'}</span></p>
                                        </div>
                                        {/* Reset button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const existing = attendance.find(a => a.classId === selectedClassId && a.date === selectedDate);
                                                if (!existing) {
                                                    setRecords(prev => prev.map(r => ({ ...r, status: 'Present', notes: '' })));
                                                } else {
                                                    triggerToast('Reset to saved status.', 'info');
                                                }
                                            }}
                                            className="rounded-lg border border-sky-400/20 bg-slate-900 p-2.5 text-slate-300 transition hover:bg-sky-400/10 hover:text-white"
                                            title="Reset attendance sheet"
                                            aria-label="Reset attendance sheet"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Checklist Records list */}
                        {selectedClassId === '' ? (
                            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-10 text-center shadow-inner">
                                <BookOpen className="mx-auto mb-3 h-10 w-10 text-sky-300" />
                                <h3 className="text-lg font-bold text-white">Choose a class to begin</h3>
                                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                                    Select a class from the list above and set the target log date. The student registry will automatically load.
                                </p>
                            </div>
                        ) : records.length === 0 ? (
                            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-10 text-center text-lg font-bold text-amber-100 shadow-lg">
                                <AlertCircle className="mx-auto mb-3 h-10 w-10 text-amber-300" />
                                <h3 className="text-lg font-bold">No enrolled students</h3>
                                <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-6 text-slate-400">
                                    There are no active students enrolled in class "{getClassName(selectedClassId)}". Please enroll students first.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Header selectors */}
                                <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-300">
                                        <CheckCircle className="h-4 w-4 text-amber-300" />
                                        Quick actions
                                    </span>
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            type="button"
                                            onClick={() => markAllStatus('Present')}
                                            className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-200 transition hover:bg-emerald-500/20"
                                        >
                                            ✓ All Present
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => markAllStatus('Absent')}
                                            className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-200 transition hover:bg-rose-500/20"
                                        >
                                            ✗ All Absent
                                        </button>
                                    </div>
                                </div>

                                {/* Table Sheet */}
                                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl shadow-slate-950/20">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-slate-700 bg-slate-950/70">
                                                    <th className="p-4 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Student</th>
                                                    <th className="p-4 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Student ID</th>
                                                    <th className="p-4 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Status</th>
                                                    <th className="p-4 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Lesson notes</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800">
                                                {records.map((r) => (
                                                    <tr key={r.studentId} className="transition-colors hover:bg-white/[0.03]">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-sky-300/15 bg-slate-950">
                                                                    <span className="text-sm font-black text-sky-200">
                                                                        {r.studentName?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'S'}
                                                                    </span>
                                                                </div>
                                                                <span className="text-sm font-semibold text-slate-100">
                                                                    {r.studentName}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 font-mono text-xs font-semibold text-slate-400">
                                                            {r.studentId}
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            {/* Custom Radio groups options style */}
                                                            <div className="inline-flex gap-1 rounded-xl border border-slate-700 bg-slate-950 p-1">
                                                                {[
                                                                    { value: 'Present', icon: CheckCircle, activeClass: 'bg-emerald-500 text-white shadow-md shadow-emerald-950/30', hoverClass: 'hover:bg-emerald-500/10 text-emerald-300' },
                                                                    { value: 'Absent', icon: XCircle, activeClass: 'bg-rose-500 text-white shadow-md shadow-rose-950/30', hoverClass: 'hover:bg-rose-500/10 text-rose-300' }
                                                                ].map((opt) => {
                                                                    const IconComponent = opt.icon;
                                                                    return (
                                                                        <button
                                                                            key={opt.value}
                                                                            type="button"
                                                                            onClick={() => handleStatusChange(r.studentId, opt.value)}
                                                                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition-all ${r.status === opt.value
                                                                                    ? opt.activeClass
                                                                                    : `border-transparent text-slate-400 ${opt.hoverClass}`
                                                                                }`}
                                                                        >
                                                                            <IconComponent className="w-4 h-4 shrink-0" />
                                                                            <span>{opt.value}</span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <input
                                                                type="text"
                                                                placeholder="Lateness reason, parent alert..."
                                                                value={r.notes}
                                                                onChange={(e) => handleNotesChange(r.studentId, e.target.value)}
                                                                className="w-full min-w-48 max-w-sm rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-400/10"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Form submit */}
                                <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center">
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                        <span className="rounded-lg border border-emerald-400/15 bg-emerald-400/5 px-3 py-2 text-emerald-200">{presentCount} present</span>
                                        <span className="rounded-lg border border-rose-400/15 bg-rose-400/5 px-3 py-2 text-rose-200">{absentCount} absent</span>
                                    </div>
                                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedClassId(''); setRecords([]); }}
                                        className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
                                    >
                                        Clear Workspace
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/25"
                                    >
                                        <FileCheck2 className="w-5 h-5" />
                                        Publish Attendance Register
                                    </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            )}

            {/* Main View: Attendance History Logs */}
            {activeView === 'history' && (
                <div className="space-y-6 animate-fade-in">

                    {/* History filters */}
                    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg sm:p-5">
                        <h3 className="text-sm font-bold text-slate-200">Filter attendance history</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            {/* Search text */}
                            <div className="relative md:col-span-2">
                                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search class names..."
                                    value={historySearchTerm}
                                    onChange={(e) => setHistorySearchTerm(e.target.value)}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm font-medium text-slate-200 placeholder:text-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-400/10"
                                />
                            </div>

                            {/* Class filter */}
                            <div>
                                <select
                                    value={historyFilterClass}
                                    onChange={(e) => setHistoryFilterClass(e.target.value)}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-400/10"
                                >
                                    <option value="All">All Classes</option>
                                    {classes.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Filter */}
                            <div>
                                <input
                                    type="date"
                                    value={historyFilterDate}
                                    onChange={(e) => setHistoryFilterDate(e.target.value)}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-400/10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* History Lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredHistory.length === 0 ? (
                            <div className="col-span-2 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center text-sm font-medium text-slate-400">
                                No attendance logs found for the selected filters.
                            </div>
                        ) : (
                            filteredHistory.map((log) => {
                                const stats = getLogStats(log.records);
                                return (
                                    <div key={log.id} className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg transition hover:border-sky-400/25 sm:p-6">
                                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 to-blue-600"></div>
                                        <div className="space-y-4 mt-2">

                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-black text-lg leading-tight text-white">
                                                        {log.className}
                                                    </h4>
                                                    <span className="mt-2 block font-mono text-xs font-semibold text-slate-400">
                                                        {log.date} · {log.id}
                                                    </span>
                                                </div>
                                                {/* Attendance rate */}
                                                <div className="rounded-xl border border-sky-400/15 bg-sky-400/5 px-4 py-3 text-center">
                                                    <span className="block font-mono text-xl font-black text-sky-200">
                                                        {stats.rate}%
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attendance</span>
                                                </div>
                                            </div>

                                            {/* Micro progress bar */}
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                                                <div
                                                    className={`h-full font-bold flex items-center justify-center text-white text-xs ${stats.rate >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600' : stats.rate >= 75 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}
                                                    style={{ width: `${stats.rate}%` }}
                                                ></div>
                                            </div>

                                            {/* Small breakdown panel */}
                                            <div className="grid grid-cols-2 gap-2 text-center">
                                                <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-3 text-emerald-200">
                                                    <span className="block text-lg font-bold">{stats.present}</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Present</span>
                                                </div>
                                                <div className="rounded-xl border border-rose-400/15 bg-rose-400/5 p-3 text-rose-200">
                                                    <span className="block text-lg font-bold">{stats.absent}</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Absent</span>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4 text-sm">
                                                <button
                                                    onClick={() => handleReloadLog(log)}
                                                    className="flex items-center gap-2 rounded-lg border border-sky-400/20 bg-sky-400/5 px-4 py-2 font-bold text-sky-200 transition hover:bg-sky-400/10"
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                    Reload Sheet
                                                </button>
                                                <button
                                                    onClick={() => confirmDeleteLog(log)}
                                                    className="rounded-lg border border-rose-400/20 p-2 text-rose-300 transition hover:bg-rose-400/10"
                                                    title="Delete archived sheet"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Delete confirmation modals */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                title="Remove Attendance Record Log"
                message={`Are you sure you want to delete the registered attendance log for ${logToDelete?.className} on class date ${logToDelete?.date}? Deleted records cannot be restored.`}
                confirmText="Remove Record"
                type="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteModalOpen(false)}
            />
        </div>
    );
};

export default Attendance;
