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
            parentName: student.parentName,
            parentPhone: student.parentPhone,
            email: student.email,
            joinedDate: student.joinedDate,
            classId: student.classId,
            monthlyFee: student.monthlyFee,
            status: student.status,
            profileImage: student.profileImage || '',
            notes: student.notes || ''
        });
        setEditingStudentId(student.id);
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
                    onClick={() => navigate('/students/enroll')}
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
                            <option value="Grade 10">Grade 10</option>
                            <option value="Grade 11">Grade 11</option>
                            <option value="Grade 12">Grade 12</option>
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

            {/* Main Datatable display */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-transparent dark:bg-transparent border-b border-[rgba(212,175,55,0.12)]">
                                <th className="p-4 text-xs font-bold text-[#F6D778] uppercase tracking-widest">Student</th>
                                <th className="p-4 text-xs font-bold text-[#F6D778] uppercase tracking-widest">Student ID</th>
                                <th className="p-4 text-xs font-bold text-[#F6D778] uppercase tracking-widest">Enrolled Class</th>
                                <th className="p-4 text-xs font-bold text-[#F6D778] uppercase tracking-widest">Guardian Phone</th>
                                <th className="p-4 text-xs font-bold text-[#F6D778] uppercase tracking-widest text-center">Fees Status</th>
                                <th className="p-4 text-xs font-bold text-[#F6D778] uppercase tracking-widest text-center">Attendance %</th>
                                <th className="p-4 text-xs font-bold text-[#F6D778] uppercase tracking-widest text-center">Status</th>
                                <th className="p-4 text-xs font-bold text-[#F6D778] uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgba(212,175,55,0.06)] dark:divide-[rgba(140,100,26,0.06)]">
                            {currentStudentsList.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-12 text-center text-slate-400 dark:text-slate-500 font-semibold">
                                        No student registrations match the active search filters.
                                    </td>
                                </tr>
                            ) : (
                                currentStudentsList.map((std) => {
                                    const stats = getStudentOverviewStats(std.id);
                                    return (
                                        <tr
                                            key={std.id}
                                            className="transition-colors hover:bg-[rgba(212,175,55,0.06)] dark:hover:bg-[rgba(212,175,55,0.04)]"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={std.profileImage}
                                                        alt={std.name}
                                                        className="w-10 h-10 rounded-xl object-cover bg-slate-100 ring-2 ring-slate-100 dark:ring-slate-800 shadow-xs"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-300 leading-none">
                                                            {std.name}
                                                        </p>
                                                        <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                                                            {std.grade} • {std.gender}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm font-bold text-slate-600 dark:text-slate-400 font-mono">
                                                {std.id}
                                            </td>
                                            <td className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                {getClassName(std.classId)}
                                            </td>
                                            <td className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                {std.parentPhone}
                                            </td>
                                            <td className="p-4 text-center">
                                                <StatusBadge status={stats.paymentStatus === 'Pending' ? 'Pending' : 'Paid'} />
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                        {stats.attendancePercentage}%
                                                    </span>
                                                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
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
                                            </td>
                                            <td className="p-4 text-center">
                                                <StatusBadge status={std.status} />
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => navigate(`/students/${std.id}`)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-650 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                        title="View student profile"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditForm(std)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                        title="Edit student"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(std)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-rose-650 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                        title="Delete student"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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

                {/* Paginated Footer */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-850/10">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={() => setIsFormOpen(false)}></div>
                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-850 p-6 md:p-8 animate-slide-in">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-lg font-bold text-slate-850 dark:text-slate-150">
                                    {editingStudentId ? 'Modify Student Profile' : 'Enroll New Student'}
                                </h3>
                                <p className="text-xs text-slate-455 mt-0.5">
                                    Ensure all details contain valid documentation records. Automatically processes registration.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Form Content */}
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">

                            {/* Row 1: Personal Details */}
                            <div className="bg-slate-50/50 dark:bg-slate-850/40 p-5 rounded-2xl space-y-4">
                                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                                    1. Personal Details
                                </span>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Full Name */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Full Name *
                                        </label>
                                        <input
                                            {...register('name', { required: 'Full name is required' })}
                                            type="text"
                                            placeholder="e.g. John Doe"
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-550/20"
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
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-550/20"
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
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2"
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
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2"
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
                                                }
                                            })}
                                            type="text"
                                            placeholder="e.g. +15550999"
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2"
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
                                                    value: /^[a-zA-Z0-0._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                    message: 'Invalid email address syntax'
                                                }
                                            })}
                                            type="email"
                                            placeholder="e.g. john.doe@mail.com"
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2"
                                        />
                                        {errors.email && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.email.message}</p>}
                                    </div>
                                </div>

                                {/* Address block */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Physical Address *
                                    </label>
                                    <input
                                        {...register('address', { required: 'Home address is required' })}
                                        type="text"
                                        placeholder="123 Academic Dr, Campus Block"
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                    />
                                    {errors.address && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.address.message}</p>}
                                </div>
                            </div>

                            {/* Row 2: Guardian Details */}
                            <div className="bg-slate-50/50 dark:bg-slate-850/40 p-5 rounded-2xl space-y-4">
                                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">
                                    2. Guardian / Parent Profile
                                </span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Guardian Name */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Parent / Guardian Name *
                                        </label>
                                        <input
                                            {...register('parentName', { required: 'Guardian name is required' })}
                                            type="text"
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                        />
                                        {errors.parentName && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.parentName.message}</p>}
                                    </div>

                                    {/* Guardian Phone */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Parent Contact Number *
                                        </label>
                                        <input
                                            {...register('parentPhone', {
                                                required: 'Guardian contact is required',
                                                pattern: {
                                                    value: /^[0-9+\-\s()]{7,15}$/,
                                                    message: 'Must contain valid telephone digits'
                                                }
                                            })}
                                            type="text"
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                        />
                                        {errors.parentPhone && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.parentPhone.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: School details, Class and Fees */}
                            <div className="bg-slate-50/50 dark:bg-slate-850/40 p-5 rounded-2xl space-y-4">
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                                    3. Academic & Enrolments
                                </span>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* School Name */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            School Name *
                                        </label>
                                        <input
                                            {...register('school', { required: 'School name is required' })}
                                            type="text"
                                            placeholder="High School Central"
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                        />
                                        {errors.school && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.school.message}</p>}
                                    </div>

                                    {/* Grade Selector */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Institute Grade
                                        </label>
                                        <select
                                            {...register('grade')}
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                        >
                                            <option value="Grade 10">Grade 10</option>
                                            <option value="Grade 11">Grade 11</option>
                                            <option value="Grade 12">Grade 12</option>
                                        </select>
                                    </div>

                                    {/* Selected Class */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Select Class / Course *
                                        </label>
                                        <select
                                            {...register('classId', { required: 'Class selection is required' })}
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                        >
                                            <option value="">Choose Class</option>
                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.id}>
                                                    {cls.name} (${cls.monthlyFee}/mo)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Monthly Fee */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                                            Monthly Fee Amount ($) *
                                        </label>
                                        <input
                                            {...register('monthlyFee', {
                                                required: 'Monthly fee is required',
                                                min: { value: 0, message: 'Fee cannot be negative' }
                                            })}
                                            type="number"
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                        />
                                        {errors.monthlyFee && <p className="text-rose-550 text-[10px] font-semibold mt-1">{errors.monthlyFee.message}</p>}
                                    </div>

                                    {/* Joined Date */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Admission Join Date *
                                        </label>
                                        <input
                                            {...register('joinedDate', { required: 'Admission date is required' })}
                                            type="date"
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                        />
                                    </div>

                                    {/* Status Dropdown */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Admission Status
                                        </label>
                                        <select
                                            {...register('status')}
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>

                                    {/* Profile Image URL */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Profile Image URL
                                        </label>
                                        <input
                                            {...register('profileImage')}
                                            type="text"
                                            placeholder="e.g. Unsplash URL"
                                            className="px-3.5 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Additional Notes text */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        {...register('notes')}
                                        rows="3"
                                        placeholder="Enter support directions, special attention requests, medical history..."
                                        className="p-3 w-full rounded-xl border border-slate-250 dark:border-slate-750 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Submit panel */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-4 py-2 border border-slate-250 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md cursor-pointer"
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
