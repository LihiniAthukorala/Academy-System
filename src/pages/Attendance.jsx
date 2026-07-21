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
    X
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
    const [selectedDate, setSelectedDate] = useState('2026-07-21'); // Default app date
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
        <div className="space-y-6">
            {/* Header title */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-105 my-0">
                        Attendance Log Registry
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-455 font-semibold mt-0.5">
                        Log daily student lessons, track lateness parameters, and audit historical registers.
                    </p>
                </div>

                {/* View togglers button */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl shrink-0">
                    <button
                        onClick={() => setActiveView('mark')}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${activeView === 'mark'
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <UserCheck className="w-3.5 h-3.5" />
                        Mark Sheets
                    </button>
                    <button
                        onClick={() => setActiveView('history')}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${activeView === 'history'
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        Archive Sheets Log
                    </button>
                </div>
            </div>

            {/* Main View: Mark Attendance */}
            {activeView === 'mark' && (
                <div className="space-y-6 animate-fade-in">

                    {/* Selecting Class & date */}
                    <form onSubmit={handleSubmitAttendance} className="space-y-6">
                        <div className="bg-white dark:bg-slate-905 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                                {/* Select Class */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                                        Acknowledge Subject Class *
                                    </label>
                                    <select
                                        value={selectedClassId}
                                        onChange={(e) => setSelectedClassId(e.target.value)}
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-900 text-xs font-semibold focus:outline-none"
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
                                <div className="space-y-1 font-mono">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-355">
                                        Target Log Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                    />
                                </div>

                                {/* Info summary */}
                                {selectedClassId !== '' && records.length > 0 && (
                                    <div className="bg-slate-50 dark:bg-slate-850/50 p-3 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-800 self-end">
                                        <div className="text-xs font-semibold space-y-1">
                                            <p className="text-slate-455">Capacity: <span className="font-bold text-slate-700 dark:text-slate-300">{records.length} enrolled</span></p>
                                            <p className="text-slate-455">Status: <span className="font-bold text-indigo-500">Log Pending</span></p>
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
                                            className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer shadow-xs text-slate-455"
                                            title="Clear/Reload"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Checklist Records list */}
                        {selectedClassId === '' ? (
                            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs">
                                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-bounce" />
                                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest">Mark Sheet Workspace</h3>
                                <p className="text-xs text-slate-450 dark:text-slate-500 mt-2 max-w-sm mx-auto">
                                    Select a class from the list above and set the target log date. The student registry will automatically load.
                                </p>
                            </div>
                        ) : records.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs">
                                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest text-rose-500">No Enrolled Students</h3>
                                <p className="text-xs text-slate-450 dark:text-slate-550 mt-2 max-w-sm mx-auto">
                                    There are no active students enrolled in class "{getClassName(selectedClassId)}". Please enroll students first.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Header selectors */}
                                <div className="flex gap-2 justify-between items-center bg-slate-50/50 dark:bg-slate-850/30 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Quick Global Actions
                                    </span>
                                    <div className="flex gap-1.5 flex-wrap">
                                        <button
                                            type="button"
                                            onClick={() => markAllStatus('Present')}
                                            className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-lg hover:bg-emerald-100/30 cursor-pointer"
                                        >
                                            All Present
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => markAllStatus('Absent')}
                                            className="px-2.5 py-1 text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100/50 rounded-lg hover:bg-rose-100/30 cursor-pointer"
                                        >
                                            All Absent
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => markAllStatus('Late')}
                                            className="px-2.5 py-1 text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100/50 rounded-lg hover:bg-amber-100/30 cursor-pointer"
                                        >
                                            All Late
                                        </button>
                                    </div>
                                </div>

                                {/* Table Sheet */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50/30 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
                                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Name</th>
                                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
                                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Lesson Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {records.map((r) => (
                                                    <tr key={r.studentId} className="hover:bg-slate-50/20 dark:hover:bg-slate-850/10">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={r.profileImage}
                                                                    alt={r.studentName}
                                                                    className="w-9 h-9 rounded-xl object-cover shadow-sm bg-slate-100 ring-2 ring-slate-100 dark:ring-slate-800"
                                                                />
                                                                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-205">
                                                                    {r.studentName}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                                                            {r.studentId}
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            {/* Custom Radio groups options style */}
                                                            <div className="inline-flex gap-1.5 p-1 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/80">
                                                                {[
                                                                    { value: 'Present', icon: CheckCircle, activeClass: 'bg-emerald-650 text-white shadow-xs', hoverClass: 'hover:text-emerald-500 text-emerald-500/70' },
                                                                    { value: 'Absent', icon: XCircle, activeClass: 'bg-rose-650 text-white shadow-xs', hoverClass: 'hover:text-rose-500 text-rose-500/70' },
                                                                    { value: 'Late', icon: Clock, activeClass: 'bg-amber-600 text-white shadow-xs', hoverClass: 'hover:text-amber-500 text-amber-500/70' },
                                                                    { value: 'Excused', icon: HelpCircle, activeClass: 'bg-blue-600 text-white shadow-xs', hoverClass: 'hover:text-blue-500 text-blue-500/70' }
                                                                ].map((opt) => {
                                                                    const IconComponent = opt.icon;
                                                                    return (
                                                                        <button
                                                                            key={opt.value}
                                                                            type="button"
                                                                            onClick={() => handleStatusChange(r.studentId, opt.value)}
                                                                            className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${r.status === opt.value
                                                                                    ? opt.activeClass
                                                                                    : `text-slate-505 dark:text-slate-400 ${opt.hoverClass}`
                                                                                }`}
                                                                        >
                                                                            <IconComponent className="w-3.5 h-3.5 shrink-0" />
                                                                            {opt.value}
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
                                                                className="px-3 py-1.5 w-full max-w-sm rounded-lg border border-slate-205 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Form submit */}
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedClassId(''); setRecords([]); }}
                                        className="px-4 py-2 border border-slate-250 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-bold text-slate-650 hover:bg-slate-50 rounded-xl cursor-pointer"
                                    >
                                        Clear Workspace
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 shadow-md cursor-pointer"
                                    >
                                        <FileCheck2 className="w-4 h-4" />
                                        Publish Attendance Register
                                    </button>
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
                    <div className="bg-white dark:bg-slate-905 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            {/* Search text */}
                            <div className="relative md:col-span-2">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                                <input
                                    type="text"
                                    placeholder="Search class names..."
                                    value={historySearchTerm}
                                    onChange={(e) => setHistorySearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                />
                            </div>

                            {/* Class filter */}
                            <div>
                                <select
                                    value={historyFilterClass}
                                    onChange={(e) => setHistoryFilterClass(e.target.value)}
                                    className="px-3 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-xs font-semibold focus:outline-none"
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
                                    className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* History Lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredHistory.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-100 col-span-2 text-slate-400 font-semibold shadow-xs">
                                No attendance logs found in the archives for the selected filter metrics.
                            </div>
                        ) : (
                            filteredHistory.map((log) => {
                                const stats = getLogStats(log.records);
                                return (
                                    <div key={log.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group">
                                        <div className="absolute top-0 right-0 h-1.5 bg-indigo-600 w-full"></div>
                                        <div className="space-y-4">

                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm leading-tight">
                                                        {log.className}
                                                    </h4>
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase block mt-1 font-mono">
                                                        Date: {log.date} • Log ID: {log.id}
                                                    </span>
                                                </div>
                                                {/* Attendance rate */}
                                                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 px-3 py-1.5 rounded-lg border border-indigo-50 dark:border-none text-center">
                                                    <span className="text-xs font-black text-indigo-650 dark:text-indigo-400 font-mono block">
                                                        {stats.rate}%
                                                    </span>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase">Rate</span>
                                                </div>
                                            </div>

                                            {/* Micro progress bar */}
                                            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${stats.rate >= 90 ? 'bg-emerald-500' : stats.rate >= 75 ? 'bg-indigo-500' : 'bg-rose-500'}`}
                                                    style={{ width: `${stats.rate}%` }}
                                                ></div>
                                            </div>

                                            {/* Small breakdown panel */}
                                            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold font-mono">
                                                <div className="bg-emerald-50/40 dark:bg-emerald-950/10 p-2 rounded-lg text-emerald-650 dark:text-emerald-450 border border-emerald-50 dark:border-none">
                                                    <span>{stats.present}</span>
                                                    <span className="block text-[8px] text-slate-400 font-semibold uppercase mt-0.5">Present</span>
                                                </div>
                                                <div className="bg-rose-50/40 dark:bg-rose-950/10 p-2 rounded-lg text-rose-650 dark:text-rose-455 border border-rose-55 mt-0.5">
                                                    <span>{stats.absent}</span>
                                                    <span className="block text-[8px] text-slate-400 font-semibold uppercase mt-0.5">Absent</span>
                                                </div>
                                                <div className="bg-amber-50/40 dark:bg-amber-950/10 p-2 rounded-lg text-amber-600 dark:text-amber-450 border border-amber-50 dark:border-none">
                                                    <span>{stats.late}</span>
                                                    <span className="block text-[8px] text-slate-400 font-semibold uppercase mt-0.5">Late</span>
                                                </div>
                                                <div className="bg-blue-50/40 dark:bg-blue-950/10 p-2 rounded-lg text-blue-650 dark:text-blue-450 border border-blue-50 dark:border-none">
                                                    <span>{stats.excused}</span>
                                                    <span className="block text-[8px] text-slate-400 font-semibold uppercase mt-0.5">Excused</span>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex gap-2 justify-end border-t border-slate-50 dark:border-slate-800/80 pt-3 text-xs">
                                                <button
                                                    onClick={() => handleReloadLog(log)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-205 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-650 rounded-lg font-bold text-slate-650 cursor-pointer"
                                                >
                                                    <RefreshCw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    Reload Sheet
                                                </button>
                                                <button
                                                    onClick={() => confirmDeleteLog(log)}
                                                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-550 border border-transparent hover:border-rose-100 rounded-lg cursor-pointer"
                                                    title="Delete archived sheet"
                                                >
                                                    <Trash2 className="w-4 h-4 shrink-0" />
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
