import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAcademy } from '../context/AcademyContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, BookOpenCheck, Shield, GraduationCap, UserCircle } from 'lucide-react';

export const Login = () => {
    const { login } = useAcademy();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('Administrator'); // 'Administrator' | 'Teacher' | 'Receptionist'

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            emailOrUsername: 'admin',
            password: 'password123',
            rememberMe: true
        }
    });

    const onSubmit = async (data) => {
        // Simulate login delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        const success = login(data.emailOrUsername, data.password, selectedRole);
        if (success) {
            navigate('/dashboard');
        }
    };

    const roles = [
        { id: 'Administrator', label: 'Admin', icon: Shield, desc: 'Full control' },
        { id: 'Teacher', label: 'Teacher', icon: GraduationCap, desc: 'Attendance & classes' },
        { id: 'Receptionist', label: 'Reception', icon: UserCircle, desc: 'Students & fees' }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 px-4">
            {/* Decorative Gradient Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[120px] dark:bg-indigo-900/10 pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[120px] dark:bg-purple-900/10 pointer-events-none"></div>

            {/* Styled Grid Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>

            {/* Login Card wrapper */}
            <div className="w-full max-w-xl z-10 animate-slide-in">
                <div className="glassmorphism rounded-3xl shadow-2xl overflow-hidden border border-white/40 dark:border-slate-800 p-8 md:p-10">

                    {/* Logo Headers */}
                    <div className="text-center mb-8">
                        <img src="/ratnapura-logo.jpeg" alt="Ratnapura Chess Academy logo" className="mx-auto w-16 h-16 rounded-2xl shadow-xl shadow-indigo-600/20 mb-4" />
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                            Ratnapura Chess Academy
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-455 font-semibold mt-1">
                            Complete education & institute management engine.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Role Select Buttons */}
                        <div>
                            <label className="block text-xs font-bold text-slate-455 dark:text-slate-400 uppercase tracking-widest mb-3 text-center">
                                Select Your Role
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {roles.map((role) => {
                                    const Icon = role.icon;
                                    const isSelected = selectedRole === role.id;
                                    return (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => setSelectedRole(role.id)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${isSelected
                                                    ? 'border-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'scale-110' : ''}`} />
                                            <span className="text-xs font-bold">{role.label}</span>
                                            <span className="text-[9px] opacity-75 mt-0.5 hidden sm:block">{role.desc}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Email/Username field */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                Email Address or Username
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                                    <Mail className="w-4 h-4" />
                                </span>
                                <input
                                    {...register('emailOrUsername', {
                                        required: 'Email or Username is required',
                                        minLength: {
                                            value: 3,
                                            message: 'Must be at least 3 characters long'
                                        }
                                    })}
                                    type="text"
                                    placeholder="admin, receptionist, or email"
                                    className={`pl-10 pr-4 py-3 w-full rounded-2xl border bg-white/50 dark:bg-slate-900/50 text-sm font-semibold focus:outline-none focus:ring-4 transition-all ${errors.emailOrUsername
                                            ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-500'
                                            : 'border-slate-200 dark:border-slate-750 focus:ring-indigo-500/10 focus:border-indigo-550 dark:focus:border-indigo-500'
                                        }`}
                                />
                            </div>
                            {errors.emailOrUsername && (
                                <p className="text-rose-550 text-xs font-semibold mt-1">
                                    {errors.emailOrUsername.message}
                                </p>
                            )}
                        </div>

                        {/* Password field */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Account Password
                                </label>
                                <a
                                    href="#forgot"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        alert('Simulation Note: Default setup passwords are: "admin" / "password123". For reception: "receptionist" / "password123".');
                                    }}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline"
                                >
                                    Forgot Password?
                                </a>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 4,
                                            message: 'Password must be at least 4 characters long'
                                        }
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className={`pl-10 pr-10 py-3 w-full rounded-2xl border bg-white/50 dark:bg-slate-900/50 text-sm font-semibold focus:outline-none focus:ring-4 transition-all ${errors.password
                                            ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-500'
                                            : 'border-slate-200 dark:border-slate-750 focus:ring-indigo-500/10 focus:border-indigo-550 dark:focus:border-indigo-500'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-rose-550 text-xs font-semibold mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Remember Me Box */}
                        <div className="flex items-center">
                            <input
                                {...register('rememberMe')}
                                id="remember_me"
                                type="checkbox"
                                className="h-4 w-4 rounded-md border-slate-350 dark:border-slate-600 text-indigo-650 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label
                                htmlFor="remember_me"
                                className="ml-2 block text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer"
                            >
                                Remember my credentials on this browser
                            </label>
                        </div>

                        {/* Login Action Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Verifying Session...
                                </span>
                            ) : (
                                'Sign In & open Workspace'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
