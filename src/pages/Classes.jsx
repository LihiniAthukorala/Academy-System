import React, { useState, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import {
    BookOpen,
    Plus,
    Edit2,
    Trash2,
    Calendar,
    Clock,
    User,
    Users,
    Search,
    School,
    X,
    PlusCircle
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import ConfirmationModal from '../components/ConfirmationModal';
import { formatLKR } from '../utils/currency';

export const Classes = () => {
    const {
        classes,
        teachers,
        addClass,
        updateClass,
        deleteClass,
        students
    } = useAcademy();

    const [searchParams, setSearchParams] = useSearchParams();

    // Search & Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTeacher, setFilterTeacher] = useState('All');

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingClassId, setEditingClassId] = useState(null);

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);

    // Form hooks
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm();

    // Handle opening action via quick links
    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'add') {
            openAddForm();
            searchParams.delete('action');
            setSearchParams(searchParams);
        }
    }, [searchParams]);

    const openAddForm = () => {
        reset({
            name: '',
            teacherId: teachers[0]?.id || '',
            day: 'Monday',
            startTime: '09:00',
            endTime: '11:00',
            classroom: 'Hall A',
            capacity: 30,
            monthlyFee: 120,
            status: 'Active'
        });
        setEditingClassId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (cls) => {
        reset({
            name: cls.name,
            teacherId: cls.teacherId,
            day: cls.day,
            startTime: cls.startTime,
            endTime: cls.endTime,
            classroom: cls.classroom,
            capacity: cls.capacity,
            monthlyFee: cls.monthlyFee,
            status: cls.status
        });
        setEditingClassId(cls.id);
        setIsFormOpen(true);
    };

    const handleFormSubmit = (data) => {
        // Find teacher name from list
        const teacher = teachers.find((t) => t.id === data.teacherId);
        const teacherName = teacher ? teacher.name : 'Unknown';
        const { subject: _ignoredSubject, ...classData } = data;

        const payload = {
            ...classData,
            teacherName,
            capacity: Number(classData.capacity || 0),
            monthlyFee: Number(classData.monthlyFee || 0)
        };

        if (editingClassId) {
            updateClass(editingClassId, payload);
        } else {
            addClass(payload);
        }
        setIsFormOpen(false);
    };

    const confirmDelete = (cls) => {
        setClassToDelete(cls);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (classToDelete) {
            deleteClass(classToDelete.id);
        }
        setDeleteModalOpen(false);
        setClassToDelete(null);
    };

    const getStudentCount = (classId) => {
        return students.filter((s) => s.classId === classId && s.status === 'Active').length;
    };

    // Filter classes registry
    const filteredClasses = classes.filter((cls) => {
        const matchesSearch =
            cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cls.teacherName || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTeacher = filterTeacher === 'All' || cls.teacherId === filterTeacher;

        return matchesSearch && matchesTeacher;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-105 my-0">
                        Registered Class Directory
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-455 font-semibold mt-0.5">
                        Configure subjects courses schedules, teacher assignments, and classroom limits.
                    </p>
                </div>
                <button
                    onClick={openAddForm}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md cursor-pointer shrink-0 transition-transform active:scale-98"
                >
                    <Plus className="w-4 h-4" />
                    Create New Class
                </button>
            </div>

            {/* Class filters panel (gold-accented) */}
            <div className="bg-white/5 dark:bg-slate-900/40 p-4 rounded-2xl border border-[rgba(212,175,55,0.12)] shadow-xs space-y-4 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {/* Search box */}
                    <div className="relative md:col-span-2">
                        <Search className="w-4 h-4 text-[#F6D778] absolute left-3 top-3.5" />
                        <input
                            type="text"
                            placeholder="Search classes by name or teacher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2.5 w-full rounded-xl border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37] transition-colors"
                        />
                    </div>

                    {/* Teacher filter */}
                    <div>
                        <select
                            value={filterTeacher}
                            onChange={(e) => setFilterTeacher(e.target.value)}
                            className="px-3 py-2.5 w-full rounded-xl border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                        >
                            <option value="All">All Instructors</option>
                            {teachers.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-105 col-span-3 text-slate-400 font-semibold shadow-xs">
                        No class schedules found matching the filter specs.
                    </div>
                ) : (
                    filteredClasses.map((cls) => {
                        const count = getStudentCount(cls.id);
                        const isFull = count >= cls.capacity;

                        return (
                            <div
                                key={cls.id}
                                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
                            >
                                {/* Header status strip */}
                                <div className="absolute top-0 right-0 h-1.5 bg-indigo-600 w-full"></div>

                                <div className="p-6 space-y-4">
                                    {/* Title & Badge */}
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                                                {cls.name}
                                            </h3>
                                            <span className="text-[10px] text-slate-400 font-bold block mt-1 font-mono">
                                                Class ID: {cls.id} • {cls.classroom}
                                            </span>
                                        </div>
                                        <StatusBadge status={cls.status} />
                                    </div>

                                    {/* Class stats */}
                                    <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-50 dark:border-slate-805 pt-4">
                                        <div className="space-y-0.5">
                                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Subject Course</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                                {cls.subject}
                                            </span>
                                        </div>

                                        <div className="space-y-0.5">
                                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Lecturer</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                            <span className="text-sm font-black text-indigo-650 dark:text-indigo-400 font-mono">{formatLKR(cls.monthlyFee)}</span>
                                                {cls.teacherName}
                                            </span>
                                        </div>

                                        <div className="space-y-0.5">
                                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Schedule Day</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                {cls.day}s
                                            </span>
                                        </div>

                                        <div className="space-y-0.5">
                                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Classroom Hours</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 font-mono">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                {cls.startTime} - {cls.endTime}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Enrollments micro bar */}
                                    <div className="space-y-1.5 pt-2 border-t border-slate-50 dark:border-slate-800/80">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 font-bold">Students Roll Check:</span>
                                            <span className={`font-bold font-mono ${isFull ? 'text-rose-500' : 'text-slate-700 dark:text-slate-350'}`}>
                                                {count} / {cls.capacity} {isFull && '(Full)'}
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-105 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${isFull ? 'bg-rose-500' : 'bg-indigo-605'}`}
                                                style={{ width: `${Math.min((count / cls.capacity) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Monthly Fee cost info */}
                                    <div className="flex justify-between items-center pt-2 text-xs">
                                        <span className="text-slate-500 font-bold">Monthly Cost:</span>
                                        <span className="text-sm font-black text-indigo-650 dark:text-indigo-400 font-mono">{formatLKR(cls.monthlyFee)}</span>
                                    </div>

                                </div>

                                {/* Card controls footer panel (gold-tinted) */}
                                <div className="px-6 py-4 bg-[rgba(212,175,55,0.02)] dark:bg-[rgba(212,175,55,0.02)] border-t border-[rgba(212,175,55,0.06)] flex justify-end gap-2">
                                    <button
                                        onClick={() => openEditForm(cls)}
                                        className="p-1.5 rounded-lg border border-slate-202 dark:border-slate-750 bg-white dark:bg-slate-905 text-slate-500 hover:text-amber-500 transition-colors cursor-pointer"
                                        title="Edit class parameters"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(cls)}
                                        disabled={count > 0}
                                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${count > 0
                                                ? 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-720 cursor-not-allowed'
                                                : 'border-slate-202 dark:border-slate-750 bg-white dark:bg-slate-905 text-slate-500 hover:text-rose-600'
                                            }`}
                                        title={count > 0 ? "Cannot delete class containing enrolled students" : "Remove class registry"}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                            </div>
                        );
                    })
                )}
            </div>

            {/* Add / Edit CRUD modal overlay */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsFormOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-850 p-6 md:p-8 z-10 animate-slide-in">

                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-lg font-bold text-slate-855 dark:text-slate-150">
                                    {editingClassId ? 'Modify Class Schedule' : 'Create New Class'}
                                </h3>
                                <p className="text-xs text-slate-455 mt-0.5">
                                    Establish weekly session schedules, teacher assignments, and classroom limits.
                                </p>
                            </div>
                            <button onClick={() => setIsFormOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                handleSubmit(handleFormSubmit)(event);
                            }}
                            className="space-y-4"
                        >

                            {/* Class Name */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                                    Class Name *
                                </label>
                                <input
                                    {...register('name', { required: 'Class Name is required' })}
                                    type="text"
                                    placeholder="e.g. Mathematics 2026 Core A"
                                    className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                />
                                {errors.name && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.name.message}</p>}
                            </div>

                            {/* Teacher assignment */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Assign Teacher *</label>
                                <select
                                    {...register('teacherId', { required: 'Teacher assignment is required' })}
                                    className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                >
                                    <option value="">Choose Instructor</option>
                                    {teachers.map((t) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                                {errors.teacherId && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.teacherId.message}</p>}
                            </div>

                            {/* Schedule Details */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Day</label>
                                    <select
                                        {...register('day')}
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                    >
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1 font-mono">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Start Time</label>
                                    <input
                                        {...register('startTime', { required: 'Time is required' })}
                                        type="time"
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                    />
                                </div>

                                <div className="space-y-1 font-mono">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">End Time</label>
                                    <input
                                        {...register('endTime', { required: 'Time is required' })}
                                        type="time"
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Room and Capacity */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Classroom</label>
                                    <input
                                        {...register('classroom', { required: 'Required' })}
                                        type="text"
                                        placeholder="Hall A"
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Capacity *</label>
                                    <input
                                        {...register('capacity', { required: 'Capacity required', min: { value: 1, message: 'Min 1' } })}
                                        type="number"
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                    />
                                    {errors.capacity && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.capacity.message}</p>}
                                </div>

                                {/* Fees */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350 font-mono">Monthly Fee (LKR) *</label>
                                    <input
                                        {...register('monthlyFee', { required: 'Fee required', min: { value: 0, message: 'Fee cannot be negative' } })}
                                        type="number"
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                    />
                                    {errors.monthlyFee && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.monthlyFee.message}</p>}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-355">Class Status</label>
                                <select
                                    {...register('status')}
                                    className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Actions submit */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-4 py-2 border border-slate-205 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit(handleFormSubmit)}
                                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 shadow-md cursor-pointer"
                                >
                                    Save Class Parameters
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation modal for delete */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                title="Remove Session Class Schedule"
                message={`Are you sure you want to delete class ${classToDelete?.name}? All course logs will be wiped.`}
                confirmText="Remove Class"
                type="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteModalOpen(false)}
            />
        </div>
    );
};

export default Classes;
