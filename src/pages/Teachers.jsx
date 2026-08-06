import React, { useState, useEffect, useRef } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Mail,
    Phone,
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
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // CRUD form states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTeacherId, setEditingTeacherId] = useState(null);
    const imageInputRef = useRef(null);
    const [profilePreview, setProfilePreview] = useState('');

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
            qualifications: '',
            address: '',
            status: 'Active',
            profileImage: ''
        });
        setProfilePreview('');
        setEditingTeacherId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (t) => {
        reset({
            name: t.name,
            email: t.email,
            phone: t.phone,
            qualifications: t.qualifications,
            address: t.address,
            status: t.status,
            profileImage: t.profileImage || ''
        });
        setProfilePreview(t.profileImage || '');
        setEditingTeacherId(t.id);
        setIsFormOpen(true);
    };

    const readImageFile = (file) => {
        if (!file || !file.type?.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = () => {
            const imageData = reader.result;
            setValue('profileImage', imageData, { shouldDirty: true, shouldValidate: true });
            setProfilePreview(imageData);
        };
        reader.readAsDataURL(file);
    };

    const handleImageDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        readImageFile(file);
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        readImageFile(file);
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
        (t.qualifications || '').toLowerCase().includes(searchTerm.toLowerCase())
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

    useEffect(() => {
        if (searchParams.get('action') === 'add') {
            openAddForm();
        }
    }, [searchParams]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-105 my-0">
                        Instructor Registers Directory
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-455 font-semibold mt-0.5">
                        Monitor teacher credentials, profile contact details, and assigned class schedules.
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
                        placeholder="Search teachers by name or qualification..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2.5 w-full rounded-xl border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                    />
                </div>
            </div>

            {/* Teachers directory table */}
            <div className="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-950/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">Teacher</th>
                                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">Contact</th>
                                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">Qualifications</th>
                                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">Assigned Classes</th>
                                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">Status</th>
                                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {currentTeachersList.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-semibold">
                                        No instructor registrations match search.
                                    </td>
                                </tr>
                            ) : (
                                currentTeachersList.map((t) => {
                                    const assignedClassesList = getTeacherClasses(t.id);

                                    return (
                                        <tr
                                            key={t.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-950/35 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/teachers/${t.id}`)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-slate-900 ring-2 ring-[#D4AF37]/10">
                                                        {t.profileImage ? (
                                                            <img src={t.profileImage} alt={t.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <span className="text-xs font-black text-[#F6D778]">
                                                                {t.name?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'T'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-slate-900 dark:text-slate-100">{t.name}</div>
                                                        <div className="text-[11px] font-mono text-slate-400">Teacher ID: {t.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="space-y-1 text-slate-700 dark:text-slate-300">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                                        <span>{t.phone || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                                        <span className="truncate">{t.email || '-'}</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                                        <span className="text-slate-500 dark:text-slate-400">{t.address || 'No address logged'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    <span>{t.qualifications || 'No qualifications listed'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                {assignedClassesList.length === 0 ? (
                                                    <span className="text-slate-400 italic">Unassigned</span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {assignedClassesList.map((cName) => (
                                                            <span key={cName} className="rounded-full border border-[rgba(212,175,55,0.16)] bg-[#F6D778]/10 px-2.5 py-1 text-[11px] font-bold text-[#8C641A]">
                                                                {cName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={t.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            openEditForm(t);
                                                        }}
                                                        className="p-2 rounded-lg border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-905 text-slate-500 hover:text-amber-500 transition-colors cursor-pointer"
                                                        title="Edit teacher parameters"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            confirmDelete(t);
                                                        }}
                                                        disabled={assignedClassesList.length > 0}
                                                        className={`p-2 rounded-lg border transition-colors cursor-pointer ${assignedClassesList.length > 0
                                                                ? 'border-slate-101 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                                                : 'border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-905 text-slate-550 hover:text-rose-600'
                                                            }`}
                                                        title={assignedClassesList.length > 0 ? 'Cannot delete instructor actively teaching classes' : 'Remove teacher account'}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
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
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-6">
                    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setIsFormOpen(false)}></div>

                    <div className="relative z-10 my-4 w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-[#D4AF37]/30 bg-slate-950/96 p-6 shadow-2xl shadow-[#D4AF37]/10 md:my-8 md:p-8 animate-slide-in max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)]">
                        <div className="mb-6 flex flex-col gap-4 border-b border-[#D4AF37]/15 pb-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-[#F6D778]">
                                    {editingTeacherId ? 'Modify Teacher Info' : 'Enroll Teacher Account'}
                                </h3>
                                <p className="mt-2 text-sm text-slate-300">
                                    Create or update an instructor profile with the same structure used for student registration.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-700 bg-slate-900/70 px-5 py-4 shadow-sm">
                                <div className="flex items-center gap-3 text-slate-100">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                                        <UserPlus className="w-5 h-5" />
                                    </span>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Teacher Account</p>
                                        <p className="text-sm font-semibold">Fill teacher details and submit registration instantly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                            <section className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-[#F6D778]">Teacher details</h2>
                                        <p className="text-sm text-slate-300">Teacher name, contact details, and qualification information.</p>
                                    </div>
                                    <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#F6D778]">Required fields *</span>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                                        <input
                                            {...register('name', { required: 'Teacher Name is required' })}
                                            type="text"
                                            placeholder="e.g. Dr. Walter White"
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                        />
                                        {errors.name && <p className="text-rose-400 text-[11px]">{errors.name.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-300">Email Address *</label>
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
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                        />
                                        {errors.email && <p className="text-rose-400 text-[11px]">{errors.email.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
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
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                        />
                                        {errors.phone && <p className="text-rose-400 text-[11px]">{errors.phone.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-300">Qualifications</label>
                                    <input
                                        {...register('qualifications')}
                                        type="text"
                                        placeholder="e.g. BSc, PhD in Pure Math"
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-300">Residential Physical Address</label>
                                    <input
                                        {...register('address')}
                                        type="text"
                                        placeholder="308 Negra Arroyo Lane, Albuquerque"
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                    />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-100">Teaching account settings</h2>
                                        <p className="text-sm text-slate-400">Status and any optional account configuration for the teacher profile.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-300">Teaching account status</label>
                                        <select
                                            {...register('status')}
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2 lg:col-span-2">
                                        <label className="text-xs font-semibold text-slate-300">Profile Image</label>
                                        <input {...register('profileImage')} type="hidden" />
                                        <div
                                            onClick={() => imageInputRef.current?.click()}
                                            onDragOver={(event) => event.preventDefault()}
                                            onDrop={handleImageDrop}
                                            className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D4AF37]/35 bg-slate-900 px-5 py-5 text-center transition hover:border-[#F6D778] hover:bg-slate-800/70"
                                        >
                                            {profilePreview ? (
                                                <img
                                                    src={profilePreview}
                                                    alt="Teacher preview"
                                                    className="mb-4 h-24 w-24 rounded-2xl object-cover ring-2 ring-[#D4AF37]/40"
                                                />
                                            ) : (
                                                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-sm font-bold text-[#F6D778]">
                                                    Upload
                                                </div>
                                            )}
                                            <p className="text-sm font-semibold text-slate-100">Drag & drop an image here</p>
                                            <p className="mt-1 text-xs text-slate-400">or click to choose a file from your device</p>
                                            <p className="mt-3 text-[11px] text-slate-500">PNG, JPG, JPEG, WEBP</p>
                                        </div>
                                        <input
                                            ref={imageInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="grid gap-3 sm:grid-cols-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="rounded-2xl border border-[#D4AF37]/30 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-2xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm shadow-[#D4AF37]/30 transition hover:bg-[#F6D778]"
                                >
                                    Save Teacher Account
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
