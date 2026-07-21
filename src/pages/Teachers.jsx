import React, { useState, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useForm } from 'react-hook-form';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Mail,
    Phone,
    BookOpen,
    MapPin,
    GraduationCap,
    X,
    UserPlus
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import ConfirmationModal from '../components/ConfirmationModal';

export const Teachers = () => {
    const {
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        classes
    } = useAcademy();

    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // CRUD form states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTeacherId, setEditingTeacherId] = useState(null);

    // Delete log confirmation states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);

    // Form Hooks
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm();

    const openAddForm = () => {
        reset({
            name: '',
            email: '',
            phone: '',
            subject: 'Mathematics',
            qualifications: '',
            address: '',
            status: 'Active'
        });
        setEditingTeacherId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (t) => {
        reset({
            name: t.name,
            email: t.email,
            phone: t.phone,
            subject: t.subject,
            qualifications: t.qualifications,
            address: t.address,
            status: t.status
        });
        setEditingTeacherId(t.id);
        setIsFormOpen(true);
    };

    const handleFormSubmit = (data) => {
        if (editingTeacherId) {
            updateTeacher(editingTeacherId, data);
        } else {
            addTeacher(data);
        }
        setIsFormOpen(false);
    };

    const confirmDelete = (t) => {
        setTeacherToDelete(t);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (teacherToDelete) {
            deleteTeacher(teacherToDelete.id);
        }
        setDeleteModalOpen(false);
        setTeacherToDelete(null);
    };

    // Helper: Get classes assigned to a teacher
    const getTeacherClasses = (teacherId) => {
        return classes.filter((c) => c.teacherId === teacherId).map((c) => c.name);
    };

    // Filter list
    const filteredTeachers = teachers.filter((t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination compute
    const totalItems = filteredTeachers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTeachersList = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-105 my-0">
                        Instructor Registers Directory
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-455 font-semibold mt-0.5">
                        Monitor teacher credentials, profiles contact details, and current subject course schedules.
                    </p>
                </div>
                <button
                    onClick={openAddForm}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 rounded-xl shadow-md cursor-pointer shrink-0 transition-transform active:scale-98"
                >
                    <UserPlus className="w-4 h-4" />
                    Enroll Teacher Account
                </button>
            </div>

            {/* Search panel (gold-accented) */}
            <div className="bg-white/5 dark:bg-slate-900/40 p-4 rounded-2xl border border-[rgba(212,175,55,0.12)] shadow-xs">
                <div className="relative max-w-sm">
                    <Search className="w-4 h-4 text-[#F6D778] absolute left-3 top-3.5" />
                    <input
                        type="text"
                        placeholder="Search teachers by instructor name or specialty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2.5 w-full rounded-xl border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                    />
                </div>
            </div>

            {/* Teachers directory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentTeachersList.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-105 col-span-3 text-slate-400 font-semibold shadow-xs">
                        No instructor registrations match search.
                    </div>
                ) : (
                    currentTeachersList.map((t) => {
                        const assignedClassesList = getTeacherClasses(t.id);

                        return (
                            <div
                                key={t.id}
                                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                            >
                                {/* Status line */}
                                <div className="absolute top-0 right-0 h-1.5 bg-indigo-600 w-full animate-pulse"></div>

                                <div className="p-6 space-y-4">
                                    {/* Banner */}
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="text-base font-extrabold text-slate-909 dark:text-slate-100 leading-tight">
                                                {t.name}
                                            </h3>
                                            <span className="text-[10px] text-slate-400 font-bold block mt-1 font-mono">
                                                Teacher ID: {t.id}
                                            </span>
                                        </div>
                                        <StatusBadge status={t.status} />
                                    </div>

                                    {/* Skills summary details */}
                                    <div className="space-y-2.5 text-xs border-t border-slate-50 dark:border-slate-805 pt-4">

                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                {t.subject} Specialist
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span className="font-medium text-slate-600 dark:text-slate-400">
                                                {t.qualifications || 'No qualifications listed'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                {t.phone}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span className="font-semibold text-slate-700 dark:text-slate-350 select-all truncate">
                                                {t.email}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-2 border-t border-slate-50 dark:border-slate-800/80 pt-2.5">
                                            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                            <span className="font-medium text-slate-500 dark:text-slate-400 leading-tight">
                                                {t.address || 'No address logged'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Assigned classes list badges */}
                                    <div className="space-y-1.5 pt-2 border-t border-slate-50 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                                            Assigned Class Schedules
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {assignedClassesList.length === 0 ? (
                                                <span className="text-[10px] text-slate-400 font-semibold italic">Unassigned Class</span>
                                            ) : (
                                                assignedClassesList.map((cName, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 rounded-md bg-[#F6D778]/10 text-[#8C641A] border border-[rgba(212,175,55,0.12)] text-[10px] font-bold"
                                                    >
                                                        {cName}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                </div>

                                {/* Operations Footer (gold-tinted) */}
                                <div className="px-6 py-4 bg-[rgba(212,175,55,0.02)] dark:bg-[rgba(212,175,55,0.02)] border-t border-[rgba(212,175,55,0.06)] flex justify-end gap-2">
                                    <button
                                        onClick={() => openEditForm(t)}
                                        className="p-1.5 rounded-lg border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-905 text-slate-500 hover:text-amber-500 transition-colors cursor-pointer"
                                        title="Edit teacher parameters"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(t)}
                                        disabled={assignedClassesList.length > 0}
                                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${assignedClassesList.length > 0
                                                ? 'border-slate-101 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                                : 'border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-905 text-slate-550 hover:text-rose-600'
                                            }`}
                                        title={assignedClassesList.length > 0 ? "Cannot delete instructor actively teaching classes" : "Remove teacher account"}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagging Footer widgets */}
            {totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 rounded-2xl shadow-xs">
                    <span className="text-xs font-semibold text-slate-500">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
                    </span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-lg border text-xs font-bold text-slate-650 hover:bg-slate-55 disabled:opacity-50 cursor-pointer"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${currentPage === page
                                        ? 'bg-indigo-650 text-white shadow-xs'
                                        : 'text-slate-650 hover:bg-slate-55 border-slate-202'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded-lg border text-xs font-bold text-slate-650 hover:bg-slate-55 disabled:opacity-50 cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* CRUD Edit/Add Overlay Modal dialog */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsFormOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-white dark:bg-slate-905 rounded-3xl shadow-2xl border border-slate-202 dark:border-slate-800 p-6 md:p-8 z-10 animate-slide-in">

                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-lg font-bold text-slate-855 dark:text-slate-150">
                                    {editingTeacherId ? 'Modify Teacher Info' : 'Enroll Teacher Account'}
                                </h3>
                                <p className="text-xs text-slate-455 mt-0.5">
                                    Register new tutor details, specialize subjects, and contact numbers.
                                </p>
                            </div>
                            <button onClick={() => setIsFormOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

                            {/* Name */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Full Name *</label>
                                <input
                                    {...register('name', { required: 'Teacher Name is required' })}
                                    type="text"
                                    placeholder="e.g. Dr. Walter White"
                                    className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                />
                                {errors.name && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.name.message}</p>}
                            </div>

                            {/* Email & Phone */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350 font-mono">Email Address *</label>
                                    <input
                                        {...register('email', {
                                            required: 'Email coordinates are required',
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                message: 'Invalid email format'
                                            }
                                        })}
                                        type="email"
                                        placeholder="walter@academy.com"
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                    />
                                    {errors.email && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.email.message}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Phone Number *</label>
                                    <input
                                        {...register('phone', {
                                            required: 'Phone contact is required',
                                            pattern: {
                                                value: /^[0-9+\-\s()]{7,15}$/,
                                                message: 'Invalid phone format'
                                            }
                                        })}
                                        type="text"
                                        placeholder="+12345678"
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-slate-201 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                    />
                                    {errors.phone && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.phone.message}</p>}
                                </div>
                            </div>

                            {/* Subject Specialist Specialization & Qualifications */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-355">Specialized Subject</label>
                                    <select
                                        {...register('subject')}
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                    >
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Chemistry">Chemistry</option>
                                        <option value="English">English</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Qualifications</label>
                                    <input
                                        {...register('qualifications')}
                                        type="text"
                                        placeholder="e.g. BSc, PhD in Pure Math"
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Residential Physical Address</label>
                                <input
                                    {...register('address')}
                                    type="text"
                                    placeholder="308 Negra Arroyo Lane, Albuquerque"
                                    className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold"
                                />
                            </div>

                            {/* Status */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Teaching account status</label>
                                <select
                                    {...register('status')}
                                    className="px-3.5 py-2.5 w-full rounded-xl border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Submit footer */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-4 py-2 border border-slate-205 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 shadow-md cursor-pointer"
                                >
                                    Save Account Parameters
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirmation modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                title="Remove Instructor Account"
                message={`Are you sure you want to delete Walter's instructor registry for ${teacherToDelete?.name}? All course links will adjust.`}
                confirmText="Remove Instructor"
                type="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteModalOpen(false)}
            />
        </div>
    );
};

export default Teachers;
