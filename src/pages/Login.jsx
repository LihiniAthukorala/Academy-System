import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAcademy } from '../context/AcademyContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Home, Lock, Mail, BookOpenCheck, Shield, GraduationCap, UserCircle } from 'lucide-react';

export const Login = () => {
    const { login } = useAcademy();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('Administrator'); // 'Administrator' | 'Teacher'

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
        { id: 'Teacher', label: 'Teacher', icon: GraduationCap, desc: 'Attendance & classes' }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/bc.png')] bg-center bg-cover opacity-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(79,70,229,0.08),transparent_35%)] pointer-events-none" />
            <div className="absolute inset-0 bg-chessboard opacity-6 pointer-events-none" />
            <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] items-center justify-center px-4 py-6">
                <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/40">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.1),transparent_40%)] opacity-80" />
                        <div className="absolute right-[-8%] top-1/4 h-[260px] w-[260px] rounded-full bg-[#4F46E5]/10 blur-3xl" />
                        <div className="absolute left-[-8%] bottom-10 h-[240px] w-[240px] rounded-full bg-[#D4AF37]/10 blur-3xl" />
                        <div className="relative z-10 flex min-h-auto flex-col justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.26em] text-slate-300">
                                    <img src="/ratnapura-logo.jpeg" alt="Ratnapura Chess Academy" className="h-8 w-8 rounded-xl object-cover" />
                                    Ratnapura Chess Academy
                                </div>
                                <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                                    A premium chess institute for aspiring champions
                                </h1>
                                <p className="mt-3 max-w-xl text-xs leading-5 text-slate-300">
                                    Sign in to manage students, classes, fees and attendance from one premium chess academy workspace.
                                </p>
                            </div>

                            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/65 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-xl flex-1">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),transparent_30%)]" />
                                <img
                                    src="/bc.png"
                                    alt="Chess hero"
                                    className="mx-auto h-80 w-full rounded-[1.75rem] object-cover opacity-90"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950 to-transparent" />
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="group mx-auto mb-6 flex h-12 w-full max-w-[320px] items-center justify-center gap-3 rounded-[14px] border border-[#2D3A56] bg-[#111827] px-5 text-[16px] font-semibold text-[#F8FAFC] transition duration-250 ease-out hover:border-[#D4AF37] hover:bg-[#1A2438] hover:text-[#D4AF37] active:scale-[0.98] sm:absolute sm:right-6 sm:top-6 sm:mx-0 sm:w-auto"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            <Home className="w-5 h-5 text-[#D4AF37] transition-transform duration-250 group-hover:scale-105" />
                            <span>Back to Home</span>
                        </button>

                        <div className="relative z-10">
                            <div className="mb-8 flex items-center gap-4">
                                <img src="/ratnapura-logo.jpeg" alt="Ratnapura Chess Academy logo" className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/10" />
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Ratnapura Chess Academy</p>
                                    <h2 className="text-3xl font-extrabold text-white">Welcome back</h2>
                                </div>
                            </div>

                            <p className="max-w-xl text-sm leading-6 text-slate-300/80 mb-8">
                                Log in to your academy workspace and run attendance, fees, grades and notifications with royal precision.
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-[0.24em] text-slate-400 mb-3 text-center sm:text-left">
                                        Select Your Role
                                    </label>
                                    <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-3">
                                        {roles.map((role) => {
                                            const Icon = role.icon;
                                            const isSelected = selectedRole === role.id;
                                            return (
                                                <button
                                                    key={role.id}
                                                    type="button"
                                                    onClick={() => setSelectedRole(role.id)}
                                                    className={`flex flex-col items-center justify-center gap-2 rounded-[1.75rem] border px-4 py-4 text-center text-sm font-semibold transition-all duration-200 ${isSelected
                                                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-100 shadow-lg shadow-indigo-500/10'
                                                        : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500 hover:bg-slate-900/95'
                                                    }`}
                                                >
                                                    <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`} />
                                                    <span>{role.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">
                                        Email Address or Username
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
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
                                            placeholder="admin or teacher"
                                            className={`pl-10 pr-4 py-3 w-full rounded-3xl border bg-slate-900/80 text-sm text-white shadow-sm transition-all ${errors.emailOrUsername
                                                ? 'border-rose-500 ring-2 ring-rose-500/10'
                                                : 'border-slate-700 focus:border-indigo-500 ring-1 ring-transparent focus:ring-indigo-500/20'
                                            }`}
                                        />
                                    </div>
                                    {errors.emailOrUsername && (
                                        <p className="text-rose-400 text-xs font-semibold mt-1">
                                            {errors.emailOrUsername.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-300">
                                            Account Password
                                        </label>
                                        <a
                                            href="#forgot"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                alert('Simulation Note: Default setup passwords are: "admin" / "password123" or "teacher" / "password123".');
                                            }}
                                            className="text-xs font-semibold text-indigo-300 hover:text-indigo-100"
                                        >
                                            Forgot Password?
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
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
                                            className={`pl-10 pr-10 py-3 w-full rounded-3xl border bg-slate-900/80 text-sm text-white shadow-sm transition-all ${errors.password
                                                ? 'border-rose-500 ring-2 ring-rose-500/10'
                                                : 'border-slate-700 focus:border-indigo-500 ring-1 ring-transparent focus:ring-indigo-500/20'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-rose-400 text-xs font-semibold mt-1">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <input
                                        {...register('rememberMe')}
                                        id="remember_me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="remember_me" className="font-semibold text-slate-300">
                                        Remember my credentials on this browser
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 py-3.5 text-sm font-extrabold text-white shadow-2xl shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                            Verifying Session...
                                        </span>
                                    ) : (
                                        'Sign In & open Workspace'
                                    )}
                                </button>
                            </form>

                            <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-500">
                                <p>New here? Register with your academy credentials or contact support for account setup.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
