import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAcademy } from '../context/AcademyContext';
import { ArrowLeft, Calendar, GraduationCap, UserPlus } from 'lucide-react';

export const EnrollStudent = () => {
    const { classes, addStudent } = useAcademy();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            dob: '',
            gender: '',
            phone: '',
            grade: '',
            school: '',
            classId: '',
            joinedDate: new Date().toISOString().split('T')[0],
            status: 'Active'
        }
    });

    const onSubmit = (data) => {
        addStudent(data);
        navigate('/students');
    };

    const fieldClassName =
        'w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 shadow-sm transition placeholder:text-slate-500 hover:border-slate-600 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/10';
    const labelClassName = 'text-sm font-semibold text-slate-200';
    const sectionClassName = 'rounded-2xl border border-white/10 bg-slate-900/50 p-5 sm:p-6';

    return (
        <div className="relative py-8 sm:py-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-80 max-w-5xl rounded-full bg-amber-400/5 blur-3xl" />
            <div className="mx-auto max-w-5xl space-y-7">
                <div className="space-y-5">
                    <button
                        type="button"
                        onClick={() => navigate('/students')}
                        className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-400 transition hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Student Directory
                    </button>
                    <div className="relative overflow-hidden rounded-3xl border border-amber-300/20 bg-gradient-to-br from-slate-900 via-slate-900 to-[#24200f] p-6 shadow-xl shadow-black/10 sm:p-8">
                        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full border border-amber-300/10" />
                        <div className="absolute -right-2 -top-8 h-40 w-40 rounded-full border border-amber-300/10" />
                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="max-w-xl">
                                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200">
                                    <GraduationCap className="h-3.5 w-3.5" />
                                    Student admission
                                </span>
                                <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                                    Enroll a new student
                                </h1>
                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    Add the student's personal and academy details. Required fields are marked with an asterisk.
                                </p>
                            </div>
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-200/20 bg-amber-300/10 text-amber-200 shadow-inner">
                                <UserPlus className="h-7 w-7" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 shadow-2xl shadow-black/20">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-4 sm:p-7">
                        <section className={sectionClassName}>
                            <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                                    <UserPlus className="h-5 w-5" />
                                </span>
                                <div>
                                    <h2 className="text-base font-bold text-white">Personal details</h2>
                                    <p className="mt-0.5 text-xs text-slate-400">Basic information and contact</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="student-name" className={labelClassName}>
                                    Full name *
                                </label>
                                <input
                                    id="student-name"
                                    {...register('name', { required: 'Full name is required' })}
                                    type="text"
                                    autoComplete="name"
                                    className={fieldClassName}
                                />
                                {errors.name && <p className="text-xs font-medium text-rose-400">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="student-dob" className={labelClassName}>
                                    Date of birth *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                    <input
                                        id="student-dob"
                                        {...register('dob', { required: 'Date of birth is required' })}
                                        type="date"
                                        className={`${fieldClassName} pl-10`}
                                    />
                                </div>
                                {errors.dob && <p className="text-xs font-medium text-rose-400">{errors.dob.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="student-gender" className={labelClassName}>
                                    Gender *
                                </label>
                                <select
                                    id="student-gender"
                                    {...register('gender', { required: 'Gender is required' })}
                                    className={fieldClassName}
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.gender && <p className="text-xs font-medium text-rose-400">{errors.gender.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="student-phone" className={labelClassName}>
                                    Contact number *
                                </label>
                                <input
                                    id="student-phone"
                                    {...register('phone', {
                                        required: 'Contact number is required',
                                        pattern: {
                                            value: /^[0-9+\-\s()]{7,20}$/,
                                            message: 'Enter a valid contact number'
                                        }
                                    })}
                                    type="tel"
                                    autoComplete="tel"
                                    className={fieldClassName}
                                />
                                {errors.phone && <p className="text-xs font-medium text-rose-400">{errors.phone.message}</p>}
                            </div>
                            </div>
                        </section>

                        <section className={sectionClassName}>
                            <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                                    <GraduationCap className="h-5 w-5" />
                                </span>
                                <div>
                                    <h2 className="text-base font-bold text-white">Academy details</h2>
                                    <p className="mt-0.5 text-xs text-slate-400">School, class, and enrollment information</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="student-grade" className={labelClassName}>
                                    Grade *
                                </label>
                                <input
                                    id="student-grade"
                                    {...register('grade', { required: 'Grade is required' })}
                                    type="text"
                                    placeholder="e.g. Grade 10"
                                    className={fieldClassName}
                                />
                                {errors.grade && <p className="text-xs font-medium text-rose-400">{errors.grade.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="student-school" className={labelClassName}>
                                    School *
                                </label>
                                <input
                                    id="student-school"
                                    {...register('school', { required: 'School is required' })}
                                    type="text"
                                    autoComplete="organization"
                                    className={fieldClassName}
                                />
                                {errors.school && <p className="text-xs font-medium text-rose-400">{errors.school.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="student-class" className={labelClassName}>
                                    Select class / course
                                </label>
                                <select id="student-class" {...register('classId')} className={fieldClassName}>
                                    <option value="">Select a class / course</option>
                                    {classes.map((academyClass) => (
                                        <option key={academyClass.id} value={academyClass.id}>
                                            {academyClass.name}
                                            {academyClass.subject ? ` - ${academyClass.subject}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {classes.length === 0 && <p className="text-xs text-slate-400">No classes or courses are available yet.</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="student-joined-date" className={labelClassName}>
                                    Join date *
                                </label>
                                <input
                                    id="student-joined-date"
                                    {...register('joinedDate', { required: 'Join date is required' })}
                                    type="date"
                                    className={fieldClassName}
                                />
                                {errors.joinedDate && <p className="text-xs font-medium text-rose-400">{errors.joinedDate.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="student-status" className={labelClassName}>
                                    Status *
                                </label>
                                <select
                                    id="student-status"
                                    {...register('status', { required: 'Status is required' })}
                                    className={fieldClassName}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            </div>
                        </section>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-800 px-1 pt-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/students')}
                                className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-400/15 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/30"
                            >
                                <UserPlus className="h-4 w-4" />
                                Confirm Registration
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EnrollStudent;
