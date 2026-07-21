import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#020817] text-white">
            <div className="relative flex min-h-screen items-center justify-center px-6 py-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.12),_transparent_30%)]" />
                <div className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-white/10 bg-slate-950/85 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
                    <h1 className="text-4xl font-black tracking-tight text-white">Register with Ratnapura Chess Academy</h1>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                        Join the premier chess training community today. Create your account and start learning with our expert coaches.
                    </p>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2">
                        <button
                            onClick={() => navigate('/login')}
                            className="rounded-3xl bg-amber-400 px-6 py-4 text-sm font-bold text-slate-950 transition hover:brightness-110"
                        >
                            Continue to Login
                        </button>
                        <button
                            onClick={() => navigate('/contact')}
                            className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            Talk to a Coach
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
