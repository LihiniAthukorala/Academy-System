import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Contact = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#020817] text-white">
            <div className="relative overflow-hidden pb-20 pt-24">
                <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.14),_transparent_28%)]" />
                <div className="absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(circle_at_bottom_left,_rgba(139,92,246,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.16),_transparent_24%)]" />
                <div className="relative mx-auto max-w-6xl px-6">
                    <div className="grid gap-10 lg:grid-cols-[0.95fr_0.9fr] lg:items-center">
                        <div className="space-y-6">
                            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Reach Out to Ratnapura Chess Academy</p>
                            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Connect with the premier chess training community.
                            </h1>
                            <p className="max-w-2xl text-lg leading-8 text-slate-300">
                                Whether you want to join our academy, enroll in courses, or learn about our upcoming tournaments, our team is ready to help you take the next step.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="inline-flex items-center justify-center rounded-full bg-amber-400 px-7 py-4 text-sm font-bold text-slate-950 transition hover:brightness-110"
                                >
                                    Login to Access
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Join Academy
                                </button>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-[0_35px_120px_-45px_rgba(0,0,0,0.85)] backdrop-blur-xl">
                            <div className="space-y-6">
                                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Official Address</p>
                                    <p className="mt-4 text-xl font-semibold text-white">Ratnapura Chess Academy</p>
                                    <p className="mt-2 text-slate-300">No 243 1/1, Main Street, Kudugalawatta, Ratnapura</p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</p>
                                    <p className="mt-4 text-xl font-semibold text-white">ratnapurachessacademy@gmail.com</p>
                                    <p className="mt-2 text-slate-300">Reach us for admissions and support</p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Contact Number</p>
                                    <p className="mt-4 text-xl font-semibold text-white">077 990 3464</p>
                                    <p className="mt-2 text-slate-300">Mon - Sat, 8am - 8pm</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
