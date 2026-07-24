import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Contact = () => {
    const navigate = useNavigate();
    const mapsUrl = 'https://maps.app.goo.gl/nxs7EaQkx4pWQXdr7';

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
                                    <a
                                        href={mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/15 hover:text-cyan-100"
                                        aria-label="Open Ratnapura Chess Academy location in Google Maps"
                                    >
                                        Google Map Link
                                    </a>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</p>
                                    <p className="mt-4 text-xl font-semibold text-white">ratnapurachessacademy@gmail.com</p>
                                    <p className="mt-2 text-slate-300">Reach us for admissions and support</p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Contact Number</p>
                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <a
                                            href="tel:+94779903464"
                                            className="text-xl font-semibold text-white transition hover:text-cyan-300"
                                            aria-label="Call Ratnapura Chess Academy at 077 990 3464"
                                        >
                                            077 990 3464
                                        </a>
                                        <a
                                            href="https://wa.me/94779903464?text=Hello%20Ratnapura%20Chess%20Academy"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300/50 hover:bg-emerald-300/15 hover:text-emerald-100"
                                        >
                                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                                                <path d="M20.52 3.48A11.79 11.79 0 0 0 12.05 0C5.44 0 .06 5.37.05 11.98c0 2.11.55 4.17 1.6 5.99L0 24l6.18-1.62a11.95 11.95 0 0 0 5.86 1.5h.01c6.61 0 11.99-5.38 11.99-11.99 0-3.2-1.25-6.2-3.52-8.41Zm-8.47 18.4h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.67.96.98-3.58-.24-.37a9.88 9.88 0 0 1-1.53-5.26c0-5.48 4.46-9.94 9.95-9.94 2.66 0 5.16 1.04 7.04 2.92a9.9 9.9 0 0 1 2.91 7.03c0 5.48-4.46 9.93-9.93 9.93Zm5.77-7.89c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.81 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.6-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.39-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.55.08-.84.39-.29.32-1.11 1.08-1.11 2.63s1.14 3.05 1.3 3.26c.16.21 2.22 3.39 5.38 4.75.75.32 1.33.52 1.78.66.75.24 1.43.21 1.97.13.6-.09 1.89-.77 2.15-1.52.26-.74.26-1.37.19-1.52-.08-.16-.29-.24-.61-.4Z" />
                                            </svg>
                                            WhatsApp Chat
                                        </a>
                                    </div>
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
