import React, { useState, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Plus,
    Edit2,
    Trash2,
    Eye,
    X,
    UserPlus,
    BookOpen,
    Phone,
    Mail,
    Calendar,
    DollarSign,
    AlertCircle,
    ChevronDown
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import ConfirmationModal from '../components/ConfirmationModal';
import { formatLKR } from '../utils/currency';

export const Students = () => {
    const {
        students,
        classes,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentOverviewStats
    } = useAcademy();

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Search & Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterGender, setFilterGender] = useState('All');
    const [filterGrade, setFilterGrade] = useState('All');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Form Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStudentId, setEditingStudentId] = useState(null);
    

    // Delete Modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    // Modal forms management
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors }
    } = useForm();

    // Handle redirect from legacy quick links
    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'add') {
            navigate('/students/enroll');
        }
    }, [searchParams, navigate]);

    // Synchronize class fee when class changes in Form
    // Open Form for Editing
    const openEditForm = (student) => {
        reset({
            name: student.name,
            nameInitials: student.nameInitials,
            dob: student.dob,
            gender: student.gender,
            school: student.school,
            grade: student.grade,
            address: student.address,
            phone: student.phone,
            email: student.email,
            joinedDate: student.joinedDate,
            classId: student.classId,
            status: student.status,
            notes: student.notes || ''
        });
        setEditingStudentId(student.id);
        setIsFormOpen(true);
    };

    // Open Form for Adding
    const openAddForm = () => {
        reset({
            name: '',
            nameInitials: '',
            dob: '',
            gender: 'Male',
            school: '',
            grade: '',
            address: '',
            phone: '',
            email: '',
            joinedDate: new Date().toISOString().split('T')[0],
            classId: '',
            status: 'Active',
            notes: ''
        });
        setEditingStudentId(null);
        setIsFormOpen(true);
    };

    

    const handleFormSubmit = (data) => {
        if (editingStudentId) {
            updateStudent(editingStudentId, data);
        } else {
            addStudent(data);
        }
        setIsFormOpen(false);
    };

    // Delete Handlers
    const confirmDelete = (student) => {
        setStudentToDelete(student);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (studentToDelete) {
            deleteStudent(studentToDelete.id);
        }
        setDeleteModalOpen(false);
        setStudentToDelete(null);
    };

    // Class mapping helper
    const getClassName = (classId) => {
        const cls = classes.find((c) => c.id === classId);
        return cls ? cls.name : 'Unassigned';
    };

    // Filter students array
    const filteredStudents = students.filter((std) => {
        const matchesSearch =
            std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            std.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesClass = filterClass === 'All' || std.classId === filterClass;
        const matchesStatus = filterStatus === 'All' || std.status === filterStatus;
        const matchesGender = filterGender === 'All' || std.gender === filterGender;
        const matchesGrade = filterGrade === 'All' || std.grade === filterGrade;

        return matchesSearch && matchesClass && matchesStatus && matchesGender && matchesGrade;
    });

    // Pagination calculations
    const totalItems = filteredStudents.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentStudentsList = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

    // Jump to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterClass, filterStatus, filterGender, filterGrade]);

    return (
        <div className="space-y-6">
            {/* Header controls section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 my-0">
                        Student Directory
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-455 font-semibold mt-0.5">
                        Manage registrations, edit information profiles, and monitor attendance/payment health.
                    </p>
                </div>
                <button
                    onClick={openAddForm}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md cursor-pointer shrink-0 transition-transform active:scale-98"
                >
                    <UserPlus className="w-4 h-4" />
                    Enroll New Student
                </button>
            </div>

            {/* Filter and Search Box panel (gold-accented) */}
            <div className="bg-white/5 dark:bg-slate-900/40 p-4 rounded-2xl border border-[rgba(212,175,55,0.12)] shadow-xs space-y-4 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {/* Search box */}
                    <div className="md:col-span-2 relative">
                        <Search className="w-4 h-4 text-[#F6D778] absolute left-3 top-3.5" />
                        <input
                            type="text"
                            placeholder="Search by student name or record ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2.5 w-full rounded-xl border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37] transition-colors"
                        />
                    </div>

                    {/* Grade filter */}
                    <div>
                        <select
                            value={filterGrade}
                            onChange={(e) => setFilterGrade(e.target.value)}
                            className="px-3 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value="All">All Grades</option>
                            <option value="Grade 1">Grade 1</option>
                            <option value="Grade 2">Grade 2</option>
                            <option value="Grade 3">Grade 3</option>
                            <option value="Grade 4">Grade 4</option>
                            <option value="Grade 5">Grade 5</option>
                            <option value="Grade 6">Grade 6</option>
                            <option value="Grade 7">Grade 7</option>
                            <option value="Grade 8">Grade 8</option>
                            <option value="Grade 9">Grade 9</option>
                            <option value="Grade 10">Grade 10</option>
                            <option value="Grade 11">Grade 11</option>
                            <option value="Grade 12">Grade 12</option>
                            <option value="Grade 13">Grade 13</option>
                        </select>
                    </div>

                    {/* Class filter */}
                    <div>
                        <select
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="px-3 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value="All">All Classes</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status filter */}
                    <div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Gender filter strip */}
                <div className="flex gap-2 items-center flex-wrap pt-1 text-xs">
                    <span className="font-bold text-slate-400 mr-2 uppercase tracking-wider text-[10px]">
                        Filter Gender:
                    </span>
                    {['All', 'Male', 'Female'].map((gender) => (
                        <button
                            key={gender}
                            onClick={() => setFilterGender(gender)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${filterGender === gender
                                    ? 'border-[#D4AF37] bg-[#F6D778]/10 text-[#8C641A]'
                                    : 'border-[#2D3A56] hover:bg-[#F6D778]/6 text-[#E6D8A3]'
                                }`}
                        >
                            {gender}
                        </button>
                    ))}
                </div>
            </div>

            {/* Modern card grid display */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs overflow-hidden">
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {currentStudentsList.length === 0 ? (
                            <div className="col-span-full p-8 text-center text-slate-400 dark:text-slate-500 font-semibold">
                                No student registrations match the active search filters.
                            </div>
                        ) : (
                            currentStudentsList.map((std) => {
                                const stats = getStudentOverviewStats(std.id);
                                return (
                                    <div
                                        key={std.id}
                                        className="bg-gradient-to-br from-white/60 to-slate-50/30 dark:from-slate-800/60 dark:to-slate-900/40 rounded-2xl p-4 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#D4AF37]/25 bg-slate-900 ring-2 ring-[#D4AF37]/10">
                                                    <span className="text-sm font-black text-[#F6D778]">
                                                        {std.name?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'S'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                                                        {std.name}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                                        {std.grade} • {std.gender}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 font-mono mt-1">
                                                        {std.id}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <StatusBadge status={std.status} />
                                                <div className="text-xs text-slate-500">{getClassName(std.classId)}</div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[11px] text-slate-400">Contact</p>
                                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{std.phone || std.email || '-'}</p>
                                                </div>

                                            <div className="text-center">
                                                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{stats.attendancePercentage}%</div>
                                                <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                                                    <div
                                                        className={`h-full ${stats.attendancePercentage >= 90
                                                            ? 'bg-emerald-500'
                                                            : stats.attendancePercentage >= 75
                                                                ? 'bg-indigo-500'
                                                                : 'bg-rose-500'
                                                            }`}
                                                        style={{ width: `${stats.attendancePercentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/students/${std.id}`)}
                                                className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                                                title="View student profile"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openEditForm(std)}
                                                className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                                                title="Edit student"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(std)}
                                                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                                                title="Delete student"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Paginated Footer */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/10 dark:bg-slate-850/10">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-455">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${currentPage === page
                                            ? 'bg-indigo-600 border-indigo-600 text-white'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* CRUD Add/Edit Overlay Modal Dialog */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-6">
                    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setIsFormOpen(false)}></div>

                    <div className="relative z-10 my-4 w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-[#D4AF37]/30 bg-slate-950/96 p-6 shadow-2xl shadow-[#D4AF37]/10 md:my-8 md:p-8 animate-slide-in max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)]">

                        <div className="mb-6 flex flex-col gap-4 border-b border-[#D4AF37]/15 pb-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-[#F6D778]">
                                    {editingStudentId ? 'Modify Student Profile' : 'Enroll New Student'}
                                </h3>
                                <p className="mt-2 text-sm text-slate-300">
                                    Create or update a student profile using the same layout as instructor registrations.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-700 bg-slate-900/70 px-5 py-4 shadow-sm">
                                <div className="flex items-center gap-3 text-slate-100">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                                        <UserPlus className="w-5 h-5" />
                                    </span>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Student Account</p>
                                        <p className="text-sm font-semibold">Fill student details and submit registration instantly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">

                            {/* Row 1: Personal Details */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-[#F6D778]">Student details</h2>
                                        <p className="text-sm text-slate-300">Student name, contact details, and identity information.</p>
                                    </div>
                                    <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#F6D778]">Required fields *</span>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {/* Full Name */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Full Name *
                                        </label>
                                        <input
                                            {...register('name', { required: 'Full name is required' })}
                                            type="text"
                                            placeholder="e.g. John Doe"
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                        />
                                        {errors.name && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.name.message}</p>}
                                    </div>

                                    {/* Name with Initials */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Name with Initials *
                                        </label>
                                        <input
                                            {...register('nameInitials', { required: 'Initials are required' })}
                                            type="text"
                                            placeholder="e.g. J. Doe"
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                        />
                                        {errors.nameInitials && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.nameInitials.message}</p>}
                                    </div>

                                    {/* Birth day */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Date of Birth *
                                        </label>
                                        <input
                                            {...register('dob', { required: 'Date of birth is required' })}
                                            type="date"
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2"
                                        />
                                        {errors.dob && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.dob.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Gender dropdown */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Gender
                                        </label>
                                        <select
                                            {...register('gender')}
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>

                                    {/* Contact Phone */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Contact Mobile Number *
                                        </label>
                                        <input
                                            {...register('phone', {
                                                required: 'Phone number is required',
                                                pattern: {
                                                    value: /^[0-9+\-\s()]{7,15}$/,
                                                    message: 'Must contain valid phone digits'
                                                },
                                                minLength: { value: 7, message: 'Phone number must be at least 7 digits' },
                                                maxLength: { value: 15, message: 'Phone number cannot exceed 15 digits' }
                                            })}
                                            type="text"
                                            placeholder="e.g. +15550999"
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2"
                                        />
                                        {errors.phone && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.phone.message}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Email Address *
                                        </label>
                                        <input
                                            {...register('email', {
                                                required: 'Email address is required',
                                                pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                    message: 'Invalid email address syntax'
                                                }
                                            })}
                                            type="email"
                                            placeholder="e.g. john.doe@mail.com"
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2"
                                        />
                                        {errors.email && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.email.message}</p>}
                                    </div>
                                </div>

                                {/* Address block */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-300">Address *</label>
                                    <input
                                        {...register('address', { required: 'Home address is required' })}
                                        type="text"
                                        placeholder="123 Academic Dr, Campus Block"
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none"
                                    />
                                    {errors.address && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.address.message}</p>}
                                </div>
                            </section>

                            {/* Row 2 removed: Guardian / Parent Profile (no longer used) */}

                            {/* Row 3: School details, Class and Fees */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-100">Academic Details</h2>
                                        <p className="text-sm text-slate-400">Grade and class selection.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {/* School Name */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            School Name *
                                        </label>
                                        <input
                                            {...register('school', { required: 'School name is required' })}
                                            type="text"
                                            placeholder="High School Central"
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none"
                                        />
                                        {errors.school && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.school.message}</p>}
                                    </div>

                                    {/* Grade Selector */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Institute Grade *
                                        </label>
                                        <select
                                            {...register('grade', { required: 'Grade is required' })}
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none"
                                        >
                                            <option value="">Choose Grade</option>
                                            <option value="Grade 1">Grade 1</option>
                                            <option value="Grade 2">Grade 2</option>
                                            <option value="Grade 3">Grade 3</option>
                                            <option value="Grade 4">Grade 4</option>
                                            <option value="Grade 5">Grade 5</option>
                                            <option value="Grade 6">Grade 6</option>
                                            <option value="Grade 7">Grade 7</option>
                                            <option value="Grade 8">Grade 8</option>
                                            <option value="Grade 9">Grade 9</option>
                                            <option value="Grade 10">Grade 10</option>
                                            <option value="Grade 11">Grade 11</option>
                                            <option value="Grade 12">Grade 12</option>
                                            <option value="Grade 13">Grade 13</option>
                                        </select>
                                        {errors.grade && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.grade.message}</p>}
                                    </div>

                                    {/* Selected Class */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Select Class / Course *
                                        </label>
                                        <select
                                            {...register('classId', { required: 'Class selection is required' })}
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none"
                                        >
                                            <option value="">Choose Class</option>
                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.id}>
                                                    {cls.name} ({formatLKR(cls.monthlyFee)}/mo)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Joined Date */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-300">Join Date *</label>
                                        <input
                                            {...register('joinedDate', { required: 'Join date is required' })}
                                            type="date"
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-300">Status</label>
                                        <select
                                            {...register('status')}
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>

                                    {/* Profile image upload removed for students */}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-300">Notes</label>
                                    <textarea
                                        {...register('notes')}
                                        rows="3"
                                        placeholder="Add any notes, medical alerts, or special accommodations..."
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none"
                                    ></textarea>
                                </div>
                            </section>

                            {/* Submit panel */}
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
                                    {editingStudentId ? 'Save Changes' : 'Confirm Registration'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation modal for delete */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                title="Remove Student Record"
                message={`Are you sure you want to delete the student registry for ${studentToDelete?.name} (${studentToDelete?.id})? This operation will remove all associated profile configurations.`}
                confirmText="Delete Registry"
                type="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteModalOpen(false)}
            />
        </div>
    );
};

export default Students;
