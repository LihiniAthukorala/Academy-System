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
                    <h2 className="text-2xl font-black text-blue-900 dark:text-blue-300 my-0">
                        📋 Attendance Log Registry
                    </h2>
                    <p className="text-sm text-blue-700 dark:text-blue-400 font-semibold mt-1">
                        Log daily student lessons, track lateness parameters, and audit historical registers.
                    </p>
                </div>

                {/* View togglers button */}
                <div className="flex bg-slate-200 dark:bg-slate-700 p-1.5 rounded-xl shrink-0">
                    <button
                        onClick={() => setActiveView('mark')}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${activeView === 'mark'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                            }`}
                    >
                        <UserCheck className="w-4 h-4" />
                        Mark Sheets
                    </button>
                    <button
                        onClick={() => setActiveView('history')}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${activeView === 'history'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                            }`}
                    >
                        <Clock className="w-4 h-4" />
                        Archive Sheets Log
                    </button>
                </div>
            </div>

            {/* Main View: Mark Attendance */}
            {activeView === 'mark' && (
                <div className="space-y-6 animate-fade-in">

                    {/* Selecting Class & date */}
                    <form onSubmit={handleSubmitAttendance} className="space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-950 p-5 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-lg">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                                {/* Select Class */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-blue-900 dark:text-blue-300">
                                        📚 Acknowledge Subject Class *
                                    </label>
                                    <select
                                        value={selectedClassId}
                                        onChange={(e) => setSelectedClassId(e.target.value)}
                                        className="px-4 py-3 w-full rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-blue-900 dark:text-white"
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
                                <div className="space-y-2 font-mono">
                                    <label className="text-sm font-bold text-blue-900 dark:text-blue-300">
                                        📅 Target Log Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="px-4 py-3 w-full rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-blue-900 dark:text-white"
                                    />
                                </div>

                                {/* Info summary */}
                                {selectedClassId !== '' && records.length > 0 && (
                                    <div className="bg-slate-50 dark:bg-slate-850/50 p-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-100 dark:border-slate-800 self-end">
                                            <div className="text-sm font-semibold space-y-1">
                                                <p className="text-slate-700 dark:text-slate-300">Capacity: <span className="font-bold text-slate-900 dark:text-slate-100">{records.length} enrolled</span></p>
                                                <p className="text-slate-700 dark:text-slate-300">Status: <span className="font-bold text-indigo-600 dark:text-indigo-400">Log Pending</span></p>
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
                                                className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer shadow-xs text-slate-700 dark:text-slate-300"
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
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-blue-900 p-12 text-center rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-lg">
                                <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3 animate-bounce" />
                                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 uppercase tracking-widest">Mark Sheet Workspace</h3>
                                <p className="text-sm text-blue-800 dark:text-blue-400 mt-3 max-w-sm mx-auto font-semibold">
                                    Select a class from the list above and set the target log date. The student registry will automatically load.
                                </p>
                            </div>
                        ) : records.length === 0 ? (
                            <div className="bg-blue-50 dark:bg-blue-950 p-12 text-center rounded-xl border-2 border-blue-200 col-span-2 text-blue-900 dark:text-blue-300 font-bold shadow-lg text-lg">
                                <AlertCircle className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 uppercase tracking-widest">No Enrolled Students</h3>
                                <p className="text-sm text-blue-800 dark:text-blue-400 mt-3 max-w-sm mx-auto font-semibold">
                                    There are no active students enrolled in class "{getClassName(selectedClassId)}". Please enroll students first.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Header selectors */}
                                <div className="flex gap-2 justify-between items-center bg-blue-50 dark:bg-blue-950 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                                    <span className="text-sm font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                                        ⚡ Quick Global Actions
                                    </span>
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            type="button"
                                            onClick={() => markAllStatus('Present')}
                                            className="px-3 py-2 text-xs font-bold bg-green-600 text-white border-2 border-green-700 rounded-lg hover:bg-green-700 cursor-pointer shadow-md"
                                        >
                                            ✓ All Present
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => markAllStatus('Absent')}
                                            className="px-3 py-2 text-xs font-bold bg-red-600 text-white border-2 border-red-700 rounded-lg hover:bg-red-700 cursor-pointer shadow-md"
                                        >
                                            ✗ All Absent
                                        </button>
                                    </div>
                                </div>

                                {/* Table Sheet */}
                                <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900 p-6 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-blue-600 dark:bg-blue-700 border-b-2 border-blue-700">
                                                    <th className="p-4 text-xs font-bold text-white uppercase tracking-wider">Student Name</th>
                                                    <th className="p-4 text-xs font-bold text-white uppercase tracking-wider">ID</th>
                                                    <th className="p-4 text-xs font-bold text-white uppercase tracking-wider text-center">Status</th>
                                                    <th className="p-4 text-xs font-bold text-white uppercase tracking-wider">Lesson Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y-2 divide-blue-200 dark:divide-blue-800">
                                                {records.map((r) => (
                                                    <tr key={r.studentId} className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#D4AF37]/25 bg-slate-900 ring-2 ring-[#D4AF37]/10">
                                                                    <span className="text-sm font-black text-[#F6D778]">
                                                                        {r.studentName?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'S'}
                                                                    </span>
                                                                </div>
                                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                                    {r.studentName}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-sm font-bold text-blue-900 dark:text-blue-300 font-mono">
                                                            {r.studentId}
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            {/* Custom Radio groups options style */}
                                                            <div className="inline-flex gap-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg border-2 border-slate-300 dark:border-slate-600">
                                                                {[
                                                                    { value: 'Present', icon: CheckCircle, activeClass: 'bg-green-600 text-white shadow-lg', hoverClass: 'hover:bg-green-500 text-green-600' },
                                                                    { value: 'Absent', icon: XCircle, activeClass: 'bg-red-600 text-white shadow-lg', hoverClass: 'hover:bg-red-500 text-red-600' }
                                                                ].map((opt) => {
                                                                    const IconComponent = opt.icon;
                                                                    return (
                                                                        <button
                                                                            key={opt.value}
                                                                            type="button"
                                                                            onClick={() => handleStatusChange(r.studentId, opt.value)}
                                                                            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all border-2 ${r.status === opt.value
                                                                                    ? opt.activeClass
                                                                                    : `border-slate-400 dark:border-slate-500 text-slate-700 dark:text-slate-300 ${opt.hoverClass}`
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
                                                                className="px-3 py-2 w-full max-w-sm rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-slate-900 dark:text-white placeholder-slate-400"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Form submit */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedClassId(''); setRecords([]); }}
                                        className="px-5 py-3 border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-all"
                                    >
                                        Clear Workspace
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg cursor-pointer transition-all border-2 border-blue-700"
                                    >
                                        <FileCheck2 className="w-5 h-5" />
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
                    <div className="bg-blue-50 dark:bg-blue-950 p-5 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-lg space-y-4">
                        <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300">🔍 Filter Archive Sheets</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            {/* Search text */}
                            <div className="relative md:col-span-2">
                                <Search className="w-5 h-5 text-blue-600 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    placeholder="Search class names..."
                                    value={historySearchTerm}
                                    onChange={(e) => setHistorySearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-3 w-full rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-slate-900 dark:text-white placeholder-slate-500"
                                />
                            </div>

                            {/* Class filter */}
                            <div>
                                <select
                                    value={historyFilterClass}
                                    onChange={(e) => setHistoryFilterClass(e.target.value)}
                                    className="px-4 py-3 w-full rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-slate-900 dark:text-white"
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
                                    className="px-4 py-3 w-full rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* History Lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredHistory.length === 0 ? (
                            <div className="bg-blue-50 dark:bg-blue-950 p-12 text-center rounded-xl border-2 border-blue-200 col-span-2 text-blue-900 dark:text-blue-300 font-bold shadow-lg text-lg">
                                📭 No attendance logs found in the archives for the selected filter metrics.
                            </div>
                        ) : (
                            filteredHistory.map((log) => {
                                const stats = getLogStats(log.records);
                                return (
                                    <div key={log.id} className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900 p-6 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="absolute top-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-blue-600 w-full rounded-t-lg"></div>
                                        <div className="space-y-4 mt-2">

                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-black text-lg text-blue-900 dark:text-blue-300 leading-tight">
                                                        📚 {log.className}
                                                    </h4>
                                                    <span className="text-xs text-blue-700 dark:text-blue-400 font-bold uppercase block mt-2 font-mono">
                                                        📅 Date: {log.date} • ID: {log.id}
                                                    </span>
                                                </div>
                                                {/* Attendance rate */}
                                                <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-3 rounded-xl text-center shadow-lg">
                                                    <span className="text-xl font-black text-white font-mono block">
                                                        {stats.rate}%
                                                    </span>
                                                    <span className="text-xs font-bold text-blue-100 uppercase">Attendance</span>
                                                </div>
                                            </div>

                                            {/* Micro progress bar */}
                                            <div className="w-full h-3 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-400">
                                                <div
                                                    className={`h-full font-bold flex items-center justify-center text-white text-xs ${stats.rate >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600' : stats.rate >= 75 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}
                                                    style={{ width: `${stats.rate}%` }}
                                                ></div>
                                            </div>

                                            {/* Small breakdown panel */}
                                            <div className="grid grid-cols-2 gap-2 text-center">
                                                <div className="bg-gradient-to-br from-emerald-300 to-emerald-400 p-3 rounded-lg text-emerald-900 border-2 border-emerald-400 shadow-md">
                                                    <span className="font-bold text-lg block">{stats.present}</span>
                                                    <span className="text-xs font-bold uppercase">Present</span>
                                                </div>
                                                <div className="bg-gradient-to-br from-rose-300 to-rose-400 p-3 rounded-lg text-rose-900 border-2 border-rose-400 shadow-md">
                                                    <span className="font-bold text-lg block">{stats.absent}</span>
                                                    <span className="text-xs font-bold uppercase">Absent</span>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex gap-2 justify-end border-t-2 border-blue-200 dark:border-blue-700 pt-4 text-sm">
                                                <button
                                                    onClick={() => handleReloadLog(log)}
                                                    className="flex items-center gap-2 px-4 py-2 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 font-bold rounded-lg cursor-pointer transition-all"
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                    Reload Sheet
                                                </button>
                                                <button
                                                    onClick={() => confirmDeleteLog(log)}
                                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 border-2 border-red-300 dark:border-red-700 hover:border-red-500 rounded-lg cursor-pointer font-bold transition-all"
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
