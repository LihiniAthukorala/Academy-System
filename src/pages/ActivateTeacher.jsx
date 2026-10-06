import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    completeTeacherActivation,
    requestTeacherOtp,
    verifyTeacherOtp
} from '../utils/api';

export const ActivateTeacher = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [activationToken, setActivationToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [stage, setStage] = useState('email');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRequestOtp = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        setIsSubmitting(true);
        try {
            const response = await requestTeacherOtp(email);
            setMessage(response.message);
            setStage('otp');
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyOtp = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        setIsSubmitting(true);
        try {
            const response = await verifyTeacherOtp(email, otp);
            setActivationToken(response.activationToken);
            setMessage(response.message);
            setStage('credentials');
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCompleteActivation = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await completeTeacherActivation(email, activationToken, username, password);
            setMessage(response.message);
            setStage('complete');
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-100">
            <div className="absolute inset-0 bg-[url('/bc.png')] bg-cover bg-center opacity-10" />
            <section className="relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-slate-950/95 p-7 shadow-2xl sm:p-10">
                <img src="/ratnapura-logo.jpeg" alt="Ratnapura Chess Academy" className="mb-6 h-14 w-14 rounded-2xl object-cover" />
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Teacher account setup</p>
                <h1 className="mt-2 text-3xl font-extrabold text-white">
                    {stage === 'credentials' || stage === 'complete' ? 'Create your account' : 'Verify your email'}
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                    {stage === 'email' && 'Enter the Gmail address registered by the academy administrator.'}
                    {stage === 'otp' && 'Enter the six-digit code sent to your registered email address.'}
                    {stage === 'credentials' && 'Your email is verified. Choose a username and a strong password.'}
                    {stage === 'complete' && 'Your teacher account is ready. Sign in with your new username and password.'}
                </p>

                {stage === 'email' && (
                    <form onSubmit={handleRequestOtp} className="mt-8 space-y-5">
                        <label className="block space-y-2 text-sm font-semibold text-slate-200">
                            Gmail address
                            <input
                                required
                                type="email"
                                autoComplete="email"
                                placeholder="name@gmail.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-400"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-2xl bg-indigo-500 px-5 py-3 font-bold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {stage === 'otp' && (
                    <form onSubmit={handleVerifyOtp} className="mt-8 space-y-5">
                        <label className="block space-y-2 text-sm font-semibold text-slate-200">
                            Registered Gmail address
                            <input
                                required
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-400"
                            />
                        </label>
                        <label className="block space-y-2 text-sm font-semibold text-slate-200">
                            Email verification code
                            <input
                                required
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                pattern="[0-9]{6}"
                                maxLength={6}
                                placeholder="6-digit code"
                                value={otp}
                                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-400"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-2xl bg-indigo-500 px-5 py-3 font-bold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? 'Verifying...' : 'Verify email'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setStage('email');
                                setMessage('');
                            }}
                            className="w-full text-sm font-semibold text-indigo-300 hover:text-indigo-100"
                        >
                            Use a different email
                        </button>
                    </form>
                )}

                {stage === 'credentials' && (
                    <form onSubmit={handleCompleteActivation} className="mt-8 space-y-5">
                        <label className="block space-y-2 text-sm font-semibold text-slate-200">
                            Create username
                            <input
                                required
                                minLength={3}
                                maxLength={32}
                                pattern="[A-Za-z0-9._-]{3,32}"
                                autoComplete="username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-400"
                            />
                            <span className="block text-xs font-normal text-slate-400">3-32 letters, numbers, dots, underscores, or hyphens.</span>
                        </label>
                        <label className="block space-y-2 text-sm font-semibold text-slate-200">
                            Create password
                            <input
                                required
                                type="password"
                                autoComplete="new-password"
                                minLength={12}
                                maxLength={128}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-400"
                            />
                            <span className="block text-xs font-normal text-slate-400">Use at least 12 characters.</span>
                        </label>
                        <label className="block space-y-2 text-sm font-semibold text-slate-200">
                            Confirm password
                            <input
                                required
                                type="password"
                                autoComplete="new-password"
                                minLength={12}
                                maxLength={128}
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-400"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-2xl bg-indigo-500 px-5 py-3 font-bold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating account...' : 'Create teacher account'}
                        </button>
                    </form>
                )}

                {error && <p role="alert" className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
                {message && <p role="status" className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</p>}

                <p className="mt-6 text-center text-sm text-slate-400">
                    Already activated? <Link to="/login" className="font-semibold text-indigo-300 hover:text-indigo-100">Sign in</Link>
                </p>
            </section>
        </main>
    );
};

export default ActivateTeacher;
