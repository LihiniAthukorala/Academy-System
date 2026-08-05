import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAcademy } from '../context/AcademyContext';
import {
    X,
    UserPlus,
    Phone,
    Calendar,
    ArrowLeft
} from 'lucide-react';

export const EnrollStudent = () => {
    const { classes, addStudent } = useAcademy();
    const navigate = useNavigate();
    const imageInputRef = useRef(null);
    const [profilePreview, setProfilePreview] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            nameInitials: '',
            dob: '',
            gender: 'Male',
            school: '',
            grade: 'Grade 10',
            address: '',
            phone: '',
            parentName: '',
            parentPhone: '',
            joinedDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            profileImage: '',
            notes: ''
        }
    });

    const onSubmit = (data) => {
        addStudent(data);
        navigate('/students');
    };

    const onCancel = () => {
        navigate('/students');
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

    return (
        <div className="py-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <button
                            type="button"
                            onClick={() => navigate('/students')}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Student Directory
                        </button>
                        <h1 className="mt-4 text-3xl font-black text-slate-900">Enroll New Student</h1>
                        <p className="mt-2 text-sm text-slate-300">Complete the enrollment form to register a new student account into the academy system.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm">
                        <div className="flex items-center gap-3 text-slate-700">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                                <UserPlus className="w-5 h-5" />
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Quick Enrollment</p>
                                <p className="text-sm font-semibold">Fill student details and submit registration instantly.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-[#D4AF37]/30 bg-slate-950/95 p-6 shadow-2xl shadow-[#D4AF37]/10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <section className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-[#F6D778]">Student details</h2>
                                    <p className="text-sm text-slate-300">Student name, contact details, and identity information.</p>
                                </div>
                                <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#F6D778]">Required fields *</span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                                    <input
                                        {...register('name', { required: 'Full name is required' })}
                                        type="text"
                                        placeholder="e.g. Amelia Carter"
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                    />
                                    {errors.name && <p className="text-rose-600 text-[11px]">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-300">Name with Initials *</label>
                                    <input
                                        {...register('nameInitials', { required: 'Initials are required' })}
                                        type="text"
                                        placeholder="e.g. A. Carter"
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                    />
                                    {errors.nameInitials && <p className="text-rose-600 text-[11px]">{errors.nameInitials.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-300">Date of Birth *</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                        <input
                                            {...register('dob', { required: 'Date of birth is required' })}
                                            type="date"
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-10 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                        />
                                    </div>
                                    {errors.dob && <p className="text-rose-600 text-[11px]">{errors.dob.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-300">Gender *</label>
                                    <select
                                        {...register('gender')}
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                        <input
                                            {...register('phone', {
                                                required: 'Phone number is required',
                                                pattern: {
                                                    value: /^[0-9+\-\s()]{7,20}$/,
                                                    message: 'Enter a valid phone number'
                                                }
                                            })}
                                            type="text"
                                            placeholder="e.g. +1 555 012 345"
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-10 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-rose-600 text-[11px]">{errors.phone.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300">Address *</label>
                                <input
                                    {...register('address', { required: 'Address is required' })}
                                    type="text"
                                    placeholder="123 Chess Lane, Academy District"
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                />
                                {errors.address && <p className="text-rose-600 text-[11px]">{errors.address.message}</p>}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Guardian & Academic Details</h2>
                                    <p className="text-sm text-slate-500">Parent contact details plus grade and class selection.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-300">Grade *</label>
                                    <select
                                        {...register('grade')}
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                    >
                                        <option value="Grade 10">Grade 10</option>
                                        <option value="Grade 11">Grade 11</option>
                                        <option value="Grade 12">Grade 12</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-300">Join Date *</label>
                                    <input
                                        {...register('joinedDate', { required: 'Join date is required' })}
                                        type="date"
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                    />
                                    {errors.joinedDate && <p className="text-rose-600 text-[11px]">{errors.joinedDate.message}</p>}
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-[#F6D778]">Additional Information</h2>
                                    <p className="text-sm text-slate-500">Optional details and student profile configuration.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-2">
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
                                                alt="Student preview"
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
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-300">Status</label>
                                    <select
                                        {...register('status')}
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300">Notes</label>
                                <textarea
                                    {...register('notes')}
                                    rows="4"
                                    placeholder="Add any notes, medical alerts, or special accommodations..."
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                />
                            </div>
                        </section>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="rounded-2xl border border-[#D4AF37]/30 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-2xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm shadow-[#D4AF37]/30 transition hover:bg-[#F6D778]"
                            >
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
