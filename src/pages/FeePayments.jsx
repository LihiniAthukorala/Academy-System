import React, { useState, useEffect, useCallback } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Printer,
    X,
    CreditCard,
    Phone,
    Calendar,
    AlertCircle,
    FileSpreadsheet,
    Coins,
    Download,
    Notebook
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import ConfirmationModal from '../components/ConfirmationModal';
import { formatLKR } from '../utils/currency';

export const FeePayments = () => {
    const {
        students,
        classes,
        payments,
        addPayment,
        updatePayment,
        deletePayment,
        settings
    } = useAcademy();

    const [searchParams, setSearchParams] = useSearchParams();

    // Search & Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMonth, setFilterMonth] = useState('All');
    const [filterClass, setFilterClass] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterMethod, setFilterMethod] = useState('All');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Modals state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPaymentId, setEditingPaymentId] = useState(null);
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState(null);

    // Form setup
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors }
    } = useForm();

    // Watch fields to dynamically calculate amounts
    const watchMonthlyFee = watch('monthlyFee', 0);
    const watchRegistrationFee = watch('registrationFee', 0);
    const watchAdditionalCharges = watch('additionalCharges', 0);
    const watchDiscount = watch('discount', 0);
    const watchPaidAmount = watch('paidAmount', 0);

    const [totalAmount, setTotalAmount] = useState(0);
    const [remainingBalance, setRemainingBalance] = useState(0);

    // Compute values dynamically
    useEffect(() => {
        const total =
            Number(watchMonthlyFee || 0) +
            Number(watchRegistrationFee || 0) +
            Number(watchAdditionalCharges || 0) -
            Number(watchDiscount || 0);

        const balance = total - Number(watchPaidAmount || 0);

        setTotalAmount(total >= 0 ? total : 0);
        setRemainingBalance(balance >= 0 ? balance : 0);
    }, [watchMonthlyFee, watchRegistrationFee, watchAdditionalCharges, watchDiscount, watchPaidAmount]);

    const openAddForm = useCallback((studentId = '') => {
        const student = students.find((item) => item.id === studentId);
        const studentClass = classes.find((item) => item.id === student?.classId);
        const today = new Date();
        reset({
            studentId,
            classId: student?.classId || '',
            month: today.toLocaleString('en', { month: 'long' }),
            year: String(today.getFullYear()),
            monthlyFee: student?.monthlyFee || studentClass?.monthlyFee || 120,
            registrationFee: 0,
            additionalCharges: 0,
            discount: 0,
            paidAmount: 0,
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMethod: 'Cash',
            status: 'Pending',
            referenceNumber: '',
            notes: ''
        });
        setEditingPaymentId(null);
        setIsFormOpen(true);
    }, [classes, reset, students]);

    // Handle open actions from the dashboard and student directory.
    useEffect(() => {
        if (searchParams.get('action') !== 'add') return;

        openAddForm(searchParams.get('studentId') || '');
        const nextSearchParams = new URLSearchParams(searchParams);
        nextSearchParams.delete('action');
        nextSearchParams.delete('studentId');
        setSearchParams(nextSearchParams, { replace: true });
    }, [openAddForm, searchParams, setSearchParams]);

    // Sync Student defaults when a student is selected in the payment form.
    const watchStudentId = watch('studentId');
    useEffect(() => {
        if (!watchStudentId) return;
        const student = students.find((item) => item.id === watchStudentId);
        if (!student) return;

        const studentClass = classes.find((item) => item.id === student.classId);
        setValue('classId', student.classId || '');
        setValue('monthlyFee', student.monthlyFee || studentClass?.monthlyFee || 120);
    }, [watchStudentId, students, classes, setValue]);

    const openEditForm = (p) => {
        reset({
            studentId: p.studentId,
            classId: p.classId,
            month: p.month,
            year: p.year,
            monthlyFee: p.monthlyFee,
            registrationFee: p.registrationFee,
            additionalCharges: p.additionalCharges,
            discount: p.discount,
            paidAmount: p.paidAmount,
            paymentDate: p.paymentDate,
            paymentMethod: p.paymentMethod,
            status: p.status,
            referenceNumber: p.referenceNumber || '',
            notes: p.notes || ''
        });
        setEditingPaymentId(p.id);
        setIsFormOpen(true);
    };

    const handleFormSubmit = (data) => {
        const payload = {
            ...data,
            monthlyFee: Number(data.monthlyFee || 0),
            registrationFee: Number(data.registrationFee || 0),
            additionalCharges: Number(data.additionalCharges || 0),
            discount: Number(data.discount || 0),
            paidAmount: Number(data.paidAmount || 0)
        };

        if (editingPaymentId) {
            updatePayment(editingPaymentId, payload);
        } else {
            addPayment(payload);
        }
        setIsFormOpen(false);
    };

    const confirmDelete = (p) => {
        setPaymentToDelete(p);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (paymentToDelete) {
            deletePayment(paymentToDelete.id);
        }
        setDeleteModalOpen(false);
        setPaymentToDelete(null);
    };

    const getClassName = (classId) => {
        const cls = classes.find((c) => c.id === classId);
        return cls ? cls.name : 'Unknown Class';
    };

    // Filter Fee Payments
    const filteredPayments = payments.filter((p) => {
        const matchesSearch =
            p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.studentId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesMonth = filterMonth === 'All' || p.month === filterMonth;
        const matchesClass = filterClass === 'All' || p.classId === filterClass;
        const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
        const matchesMethod = filterMethod === 'All' || p.paymentMethod === filterMethod;

        return matchesSearch && matchesMonth && matchesClass && matchesStatus && matchesMethod;
    });

    // Pagging calculations
    const totalItems = filteredPayments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPaymentsList = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterMonth, filterClass, filterStatus, filterMethod]);

    const handlePrintReceipt = () => {
        window.print();
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Print-Only Styles Injection */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-receipt-modal, #print-receipt-modal * {
            visibility: visible;
          }
          #print-receipt-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            border: none;
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

            {/* Header sections */}
            <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-violet-400/15 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70 p-5 shadow-xl shadow-slate-950/20 sm:p-8 xl:flex-row xl:flex-nowrap xl:items-center xl:justify-between xl:gap-6">
                <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full border border-violet-300/10" />
                <div className="pointer-events-none absolute -right-8 -top-20 h-56 w-56 rounded-full border border-violet-300/10" />
                <div className="relative min-w-0 flex-1">
                    <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200">
                        <CreditCard className="h-3.5 w-3.5" />
                        Academy accounts
                    </span>
                    <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                        Fee &amp; invoicing ledger
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                        Track class invoices, record payments, and review outstanding balances.
                    </p>
                </div>
                <button
                    onClick={openAddForm}
                    className="relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/25"
                >
                    <Plus className="w-4 h-4" />
                    Create invoice / record payment
                </button>
            </div>

            {/* Filters ledger board (gold-accented) */}
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg backdrop-blur-sm sm:p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {/* Search ledger */}
                    <div className="relative sm:col-span-2">
                        <Search className="absolute left-3 top-3.5 h-4 w-4 text-violet-300" />
                        <input
                            type="text"
                            placeholder="Search receipt ID, student name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm font-medium text-slate-200 placeholder:text-slate-500 transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10"
                        />
                    </div>

                    {/* Month filter */}
                    <div>
                        <select
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm font-medium text-slate-200 transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10"
                        >
                            <option value="All">All Months</option>
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    {/* Class filter */}
                    <div>
                        <select
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm font-medium text-slate-200 transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10"
                        >
                            <option value="All">All Classes</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status filter */}
                    <div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm font-medium text-slate-200 transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Paid">Paid</option>
                            <option value="Partially Paid">Partially Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                </div>

                {/* Method filter option strip (gold-accented) */}
                <div className="flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4 text-xs">
                    <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Payment Method:
                    </span>
                    {['All', 'Cash', 'Bank Transfer', 'Card', 'Online Payment'].map((method) => (
                        <button
                            key={method}
                            type="button"
                            onClick={() => setFilterMethod(method)}
                            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${filterMethod === method
                                    ? 'border-violet-300/30 bg-violet-400/10 text-violet-200'
                                    : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-white/5 hover:text-slate-200'
                                }`}
                        >
                            {method}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ledger Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl shadow-slate-950/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-950/70">
                                <th className="whitespace-nowrap p-4 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">Receipt no.</th>
                                <th className="whitespace-nowrap p-4 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">Student</th>
                                <th className="whitespace-nowrap p-4 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">Class</th>
                                <th className="whitespace-nowrap p-4 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">Billing month</th>
                                <th className="whitespace-nowrap p-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">Collected</th>
                                <th className="whitespace-nowrap p-4 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">Payment date</th>
                                <th className="whitespace-nowrap p-4 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">Method</th>
                                <th className="whitespace-nowrap p-4 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">Status</th>
                                <th className="whitespace-nowrap p-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {currentPaymentsList.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="p-12 text-center">
                                        <div className="mx-auto flex max-w-md flex-col items-center">
                                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-slate-500">
                                                <FileSpreadsheet className="h-5 w-5" />
                                            </span>
                                            <span className="mt-3 text-sm font-semibold text-slate-300">No matching payment records</span>
                                            <span className="mt-1 text-xs text-slate-500">Try changing your search or filters, or create a new invoice.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                currentPaymentsList.map((p) => (
                                    <tr
                                            key={p.id}
                                            className="transition-colors hover:bg-white/[0.03]"
                                        >
                                        <td className="whitespace-nowrap p-4 font-mono text-xs font-semibold text-violet-200">
                                            {p.id}
                                        </td>
                                        <td className="p-4">
                                                <span className="block text-sm font-semibold leading-none text-slate-100">
                                                    {p.studentName}
                                                </span>
                                            <span className="mt-1 block font-mono text-[10px] font-medium text-slate-500">
                                                {p.studentId}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap p-4 text-xs font-medium text-slate-300">
                                            {getClassName(p.classId)}
                                        </td>
                                        <td className="whitespace-nowrap p-4 text-xs font-medium text-slate-300">
                                            {p.month} {p.year}
                                        </td>
                                        <td className="whitespace-nowrap p-4 text-right font-mono text-sm font-bold text-emerald-300">
                                            {formatLKR(p.paidAmount)}
                                        </td>
                                        <td className="whitespace-nowrap p-4 font-mono text-xs font-medium text-slate-400">
                                            {p.paymentDate || '—'}
                                        </td>
                                        <td className="whitespace-nowrap p-4 text-xs font-medium text-slate-300">
                                            {p.paymentMethod || '—'}
                                        </td>
                                        <td className="p-4 text-center">
                                            <StatusBadge status={p.status} />
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex gap-1.5 justify-end">
                                                <button
                                                    onClick={() => setSelectedReceipt(p)}
                                                    className="p-2 rounded-lg text-slate-450 hover:text-indigo-650 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                    title="Generate payment receipt printout"
                                                >
                                                    <Printer className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEditForm(p)}
                                                    className="p-2 rounded-lg text-slate-450 hover:text-amber-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                    title="Edit invoice record"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(p)}
                                                    className="p-2 rounded-lg text-slate-450 hover:text-rose-650 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                    title="Delete transaction log"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagging Footer */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-850/10">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-455">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border border-slate-202 dark:border-slate-700 text-xs font-bold text-slate-650 hover:bg-slate-55 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${currentPage === page
                                            ? 'bg-indigo-650 border-indigo-600 text-white shadow-xs'
                                            : 'border-slate-202 dark:border-slate-700 text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-slate-202 dark:border-slate-700 text-xs font-bold text-slate-650 hover:bg-slate-55 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* CRUD Form Modal overlay */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={() => setIsFormOpen(false)}></div>
                    <div className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-violet-300/15 bg-[#05091b] shadow-2xl shadow-black/50 animate-slide-in">

                        <div className="relative flex shrink-0 items-center justify-between gap-4 overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 px-5 py-5 sm:px-8 sm:py-6">
                            <div className="pointer-events-none absolute -right-8 -top-20 h-48 w-48 rounded-full border border-violet-300/10" />
                            <div className="relative">
                                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200">Payment management</span>
                                <h3 className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
                                    {editingPaymentId ? 'Update payment record' : 'Create invoice / record payment'}
                                </h3>
                                <p className="mt-1 text-sm leading-5 text-slate-400">
                                    Enter billing details and payment information. Balances update automatically.
                                </p>
                            </div>
                            <button type="button" onClick={() => setIsFormOpen(false)} aria-label="Close payment form" className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-400 transition hover:border-violet-300/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/20">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 overflow-y-auto p-5 sm:p-8">

                            {/* Row 1: Student and Class */}
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-300">
                                        Select Enrolled Student *
                                    </label>
                                    <select
                                        {...register('studentId', { required: 'Student selection is required' })}
                                        disabled={editingPaymentId !== null}
                                        className="w-full rounded-xl border border-slate-600 bg-[#10182a] px-4 py-3 text-sm font-semibold text-slate-100 transition placeholder:text-slate-500 hover:border-slate-500 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <option value="">Choose Student</option>
                                        {students.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.id})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.studentId && <p className="mt-1 text-xs font-semibold text-rose-400">{errors.studentId.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-300">
                                        Target Class / Course
                                    </label>
                                    <select
                                        {...register('classId', { required: 'Class association is required' })}
                                        className="w-full rounded-xl border border-slate-600 bg-[#10182a] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10"
                                    >
                                        <option value="">Select Enrolled Class</option>
                                        {classes.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: Month, Year, Payment Date, Paid Amount */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-300">Invoicing Year</label>
                                    <input
                                        {...register('year', { required: 'Required' })}
                                        type="number"
                                        className="w-full rounded-xl border border-slate-600 bg-[#10182a] px-4 py-3 text-sm font-semibold text-slate-100 transition placeholder:text-slate-500 hover:border-slate-500 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-300">Invoicing Month</label>
                                    <select
                                        {...register('month')}
                                        className="w-full rounded-xl border border-slate-600 bg-[#10182a] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10"
                                    >
                                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-300">Payment Date</label>
                                    <input
                                        {...register('paymentDate')}
                                        type="date"
                                        className="w-full rounded-xl border border-slate-600 bg-[#10182a] px-4 py-3 text-sm font-semibold text-slate-100 transition [color-scheme:dark] hover:border-slate-500 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-300">Paid Amount</label>
                                    <input
                                        {...register('paidAmount', {
                                            required: 'Paid amount is required',
                                            min: { value: 0, message: 'Cannot be negative' }
                                        })}
                                        type="number"
                                        placeholder="Enter amount paid"
                                        className="w-full rounded-xl border border-slate-600 bg-[#10182a] px-4 py-3 text-sm font-semibold text-slate-100 transition placeholder:text-slate-500 hover:border-slate-500 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10"
                                    />
                                    {errors.paidAmount && <p className="mt-1 text-xs font-semibold text-rose-400">{errors.paidAmount.message}</p>}
                                </div>
                            </div>

                            {/* Financial Invoicing Calculator removed as requested */}

                            {/* Row 4: Method, Reference, Status */}
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-300">Payment Method</label>
                                    <select
                                        {...register('paymentMethod')}
                                        className="w-full rounded-xl border border-slate-600 bg-[#10182a] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10"
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Card">Card</option>
                                        <option value="Online Payment">Online Payment</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-300">Reference Number</label>
                                    <input
                                        {...register('referenceNumber')}
                                        type="text"
                                        placeholder="e.g. TXN ID, Slip No"
                                        className="w-full rounded-xl border border-slate-600 bg-[#10182a] px-4 py-3 text-sm font-semibold text-slate-100 transition placeholder:text-slate-500 hover:border-slate-500 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-300">Billing Status Override</label>
                                    <select
                                        {...register('status')}
                                        className="w-full rounded-xl border border-slate-600 bg-[#10182a] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10"
                                    >
                                        <option value="Paid">Paid (Settled)</option>
                                        <option value="Partially Paid">Partially Paid</option>
                                        <option value="Pending">Pending Invoice</option>
                                        <option value="Overdue">Overdue Arrears</option>
                                    </select>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-300">Add Billing Notes</label>
                                <textarea
                                    {...register('notes')}
                                    rows="3"
                                    placeholder="Add any additional details about this payment..."
                                    className="w-full resize-y rounded-xl border border-slate-600 bg-[#10182a] p-4 text-sm font-medium text-slate-100 transition placeholder:text-slate-500 hover:border-slate-500 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10"
                                ></textarea>
                            </div>

                            {/* Footer submission */}
                            <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/10 pt-5 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-950/40 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/25"
                                >
                                    Save Transaction
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Printable invoice Receipt Preview Modal */}
            {selectedReceipt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print bg-slate-900/60 backdrop-blur-xs">
                    <div className="absolute inset-0 bg-slate-900/60" onClick={() => setSelectedReceipt(null)}></div>

                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 z-10 overflow-y-auto max-h-[95vh] animate-slide-in">
                        {/* Modal actions close */}
                        <div className="absolute top-4 right-4 flex gap-2 no-print">
                            <button
                                onClick={handlePrintReceipt}
                                className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-650 cursor-pointer transition-colors"
                                title="Print Receipt"
                            >
                                <Printer className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setSelectedReceipt(null)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer transition-colors"
                                title="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Printable Frame Area */}
                        <div id="print-receipt-modal" className="text-slate-800 dark:text-slate-200 p-2 font-sans">

                            {/* Receipt Header details */}
                            <div className="flex justify-between items-start border-b-2 border-dashed border-slate-200 dark:border-slate-800 pb-5">
                                <div>
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-md mb-2">
                                        <Coins className="w-6 h-6 animate-pulse" />
                                    </div>
                                    <h3 className="text-lg font-black tracking-tight">{settings.academyName}</h3>
                                    <p className="text-[10px] text-slate-455 font-bold uppercase tracking-wider font-mono">Official Payment Receipt</p>
                                </div>
                                <div className="text-right text-xs space-y-1">
                                    <p className="font-extrabold text-slate-800 dark:text-slate-100 text-sm font-mono">{selectedReceipt.id}</p>
                                    <p className="text-slate-400 font-semibold">{settings.address}</p>
                                    <p className="text-slate-405 font-bold">{settings.phone}</p>
                                    <p className="text-slate-405 font-bold">{settings.email}</p>
                                </div>
                            </div>

                            {/* Student details */}
                            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <span className="text-slate-400 font-bold block mb-1">Student Details</span>
                                    <p className="font-extrabold text-slate-850 dark:text-slate-205">{selectedReceipt.studentName}</p>
                                    <p className="text-slate-400 font-bold mt-1">ID: {selectedReceipt.studentId}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-slate-400 font-bold block mb-1">Receipt Details</span>
                                    <p className="font-semibold text-slate-805 dark:text-slate-300">Class: {getClassName(selectedReceipt.classId)}</p>
                                    <p className="font-semibold text-slate-805 dark:text-slate-300 mt-1">Billing Month: {selectedReceipt.month} {selectedReceipt.year}</p>
                                </div>
                            </div>

                            {/* Invoice Table list */}
                            <div className="py-5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
                                    Billing Breakdown
                                </span>
                                <div className="space-y-2.5 text-xs">
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Monthly Tuition Fee</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{formatLKR(selectedReceipt.monthlyFee)}</span>
                                    </div>

                                    {selectedReceipt.registrationFee > 0 && (
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-slate-600 dark:text-slate-400 font-medium">Registration Fee</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{formatLKR(selectedReceipt.registrationFee)}</span>
                                        </div>
                                    )}

                                    {selectedReceipt.additionalCharges > 0 && (
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-slate-600 dark:text-slate-400 font-medium">Additional Study Materials</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{formatLKR(selectedReceipt.additionalCharges)}</span>
                                        </div>
                                    )}

                                    {selectedReceipt.discount > 0 && (
                                        <div className="flex justify-between items-center py-1 text-emerald-600 dark:text-emerald-450 font-bold">
                                            <span>Applied Promocode / Scholarship Discount</span>
                                            <span className="font-mono">-{formatLKR(selectedReceipt.discount)}</span>
                                        </div>
                                    )}

                                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-sm font-black">
                                        <span className="text-slate-800 dark:text-slate-200 font-extrabold">Total Amount Invoiced</span>
                                        <span className="font-mono">{formatLKR(selectedReceipt.totalAmount)}</span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm font-black text-emerald-600 dark:text-emerald-400 pt-1">
                                        <span className="font-extrabold">Amount Cleared / Paid</span>
                                        <span className="font-mono">-{formatLKR(selectedReceipt.paidAmount)}</span>
                                    </div>

                                    <div className={`flex justify-between items-center text-sm font-black py-2.5 px-3 rounded-lg border my-2 ${selectedReceipt.balance > 0
                                            ? 'bg-rose-50/20 border-rose-100/50 text-rose-650'
                                            : 'bg-emerald-50/20 border-emerald-100/50 text-emerald-600 dark:text-emerald-400'
                                        }`}>
                                        <span className="font-extrabold">Net Arrears Balance Due</span>
                                        <span className="font-mono">{formatLKR(selectedReceipt.balance)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Invoicing info */}
                            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-t border-b border-dashed border-slate-200 dark:border-slate-800">
                                <div className="space-y-1.5">
                                    <p className="font-semibold text-slate-500 dark:text-slate-400">
                                        Payment Gateway: <span className="font-bold text-slate-800 dark:text-slate-200">{selectedReceipt.paymentMethod}</span>
                                    </p>
                                    {selectedReceipt.referenceNumber && (
                                        <p className="font-semibold text-slate-505 dark:text-slate-400">
                                            TXN Reference No: <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedReceipt.referenceNumber}</span>
                                        </p>
                                    )}
                                    {selectedReceipt.paymentDate && (
                                        <p className="font-semibold text-slate-505 dark:text-slate-400">
                                            Payment Date: <span className="font-bold text-slate-800 dark:text-slate-200">{selectedReceipt.paymentDate}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-slate-500 dark:text-slate-400">
                                        Billing Status: <span className="font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">{selectedReceipt.status}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Receipt Footer */}
                            <div className="mt-6 text-center text-[10px] text-slate-400 font-semibold italic max-w-sm mx-auto leading-relaxed">
                                {settings.receiptFooter}
                            </div>

                            {/* Signatures block */}
                            <div className="mt-12 grid grid-cols-2 gap-8 text-xs pt-6 border-t border-slate-50 dark:border-slate-800">
                                <div>
                                    <div className="h-6 w-32 border-b border-slate-300 dark:border-slate-700 mx-auto"></div>
                                    <p className="text-[10px] text-slate-400 mt-2 font-bold text-center uppercase tracking-wider">Received By (Officer)</p>
                                </div>
                                <div>
                                    <div className="h-6 w-32 border-b border-slate-300 dark:border-slate-700 mx-auto"></div>
                                    <p className="text-[10px] text-slate-400 mt-2 font-bold text-center uppercase tracking-wider">Parent / Payer Signature</p>
                                </div>
                            </div>

                        </div>

                        {/* Print action buttons */}
                        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 no-print">
                            <button
                                onClick={() => setSelectedReceipt(null)}
                                className="px-4 py-2 border border-slate-250 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-305 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                Close View
                            </button>
                            <button
                                onClick={handlePrintReceipt}
                                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 shadow-md cursor-pointer"
                            >
                                <Printer className="w-4 h-4" />
                                Print Invoice
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Confirmation modal for delete actions */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                title="Remove Invoiced Receipt Log"
                message={`Are you sure you want to delete receipt entry ${paymentToDelete?.id} for student ${paymentToDelete?.studentName}? All associated collection ledger calculations will adjust accordingly.`}
                confirmText="Remove Receipt"
                type="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteModalOpen(false)}
            />
        </div>
    );
};

export default FeePayments;
