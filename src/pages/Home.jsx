import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const Home = () => {
    const { theme, toggleTheme } = useAcademy();
    const navigate = useNavigate();
    const location = useLocation();
    const [heroImageFailed, setHeroImageFailed] = useState(false);
    const aboutSectionRef = useRef(null);

    const stats = [
        { label: 'Total Students', value: '1.8K+' },
        { label: 'Coaches', value: '24' },
        { label: 'Years of Experience', value: '12' }
    ];

    useEffect(() => {
        const section = new URLSearchParams(location.search).get('section');

        if (section === 'about' && aboutSectionRef.current) {
            aboutSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [location.search]);

    return (
        <div className="min-h-screen bg-[#020817] text-white overflow-hidden">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="neon-piece neon-piece-king neon-pink neon-float-a" style={{ top: '18%', left: '5%' }}>
                    <span className="piece-base" />
                    <span className="piece-body" />
                    <span className="piece-top" />
                    <span className="piece-cross-h" />
                    <span className="piece-cross-v" />
                </div>

                <div className="neon-piece neon-piece-knight neon-blue neon-float-b" style={{ top: '56%', right: '6%' }}>
                    <span className="piece-base" />
                    <span className="piece-body" />
                    <span className="piece-head" />
                </div>

                <div className="neon-piece neon-piece-bishop neon-cyan neon-float-c" style={{ bottom: '8%', left: '16%' }}>
                    <span className="piece-base" />
                    <span className="piece-body" />
                    <span className="piece-head" />
                    <span className="piece-slit" />
                </div>

                <div className="neon-piece neon-piece-queen neon-cyan neon-float-b" style={{ top: '14%', right: '24%' }}>
                    <span className="piece-base" />
                    <span className="piece-body" />
                    <span className="piece-crown" />
                    <span className="piece-tip piece-tip-left" />
                    <span className="piece-tip piece-tip-mid" />
                    <span className="piece-tip piece-tip-right" />
                </div>

                <div className="neon-piece neon-piece-rook neon-pink neon-float-a" style={{ bottom: '14%', right: '20%' }}>
                    <span className="piece-base" />
                    <span className="piece-body" />
                    <span className="piece-top" />
                    <span className="piece-notch piece-notch-a" />
                    <span className="piece-notch piece-notch-b" />
                    <span className="piece-notch piece-notch-c" />
                </div>
            </div>

            <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.16),_transparent_30%)] pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-96 bg-[radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.14),_transparent_24%)] pointer-events-none" />

            <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
                <a
                    href="https://share.google/ZPkYpwJZXGbxIyoAU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 transition-opacity hover:opacity-90"
                    aria-label="Open Ratnapura Chess Academy location in Google Maps"
                >
                    <img src="/ratnapura-logo.jpeg" alt="Ratnapura Chess Academy" className="h-12 w-12 rounded-3xl object-cover border border-white/10 shadow-xl shadow-blue-500/20" />
                    <div>
                        <p className="text-sm font-semibold text-slate-200/75 uppercase tracking-[0.25em]">Ratnapura</p>
                        <p className="text-base font-black tracking-tight text-white">Chess Academy</p>
                    </div>
                </a>

                <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-200 md:flex">
                    <Link to="/home" className="transition hover:text-white">Home</Link>
                    <Link to="/home?section=about" className="transition hover:text-white">About Us</Link>
                    <a href="#coaches" className="transition hover:text-white">Coaches</a>
                    <a href="#tournaments" className="transition hover:text-white">Tournaments</a>
                    <a href="#contact" className="transition hover:text-white">Contact</a>
                </nav>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10"
                    >
                        {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="hidden rounded-2xl border border-slate-600 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-400 hover:bg-slate-800 md:inline-flex"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-amber-400/20 transition hover:brightness-110 md:inline-flex"
                    >
                        Get Started
                    </button>
                    <button className="md:hidden rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100">
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </header>

            <main id="home" className="relative z-20 mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 lg:px-8 lg:py-16">
                <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 rounded-full border border-slate-600/40 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300 shadow-[0_15px_60px_-45px_rgba(15,23,42,0.9)]">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.55)]"></span>
                            Premium Chess Education
                        </div>
                        <div className="space-y-6">
                            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Master the Game. Build Your Future.
                            </h1>
                            <p className="max-w-2xl text-sm text-slate-300 sm:text-base lg:text-lg leading-8">
                                Learn strategic thinking with tailored chess training, elite coaching, and performance-driven programs designed for ambitious students at Ratnapura Chess Academy.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <button
                                onClick={() => navigate('/register')}
                                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-8 py-4 text-sm font-bold text-slate-950 transition hover:shadow-[0_18px_45px_-18px_rgba(251,191,36,0.8)] hover:brightness-110"
                            >
                                Join Academy
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                            >
                                View Courses
                            </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {stats.map((item) => (
                                <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-[0_24px_80px_-40px_rgba(0,0,0,0.7)] transition hover:-translate-y-1 hover:border-amber-400/25">
                                    <p className="text-xs uppercase tracking-[0.2em] leading-5 text-slate-400 break-words">{item.label}</p>
                                    <p className="mt-4 text-3xl font-black text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),transparent)] blur-3xl" />
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/40">
                            <div className="absolute -right-8 top-8 h-24 w-24 rounded-full bg-gradient-to-br from-violet-500/20 to-sky-400/10 blur-3xl" />
                            <div className="relative h-[420px] w-full overflow-hidden rounded-[1.5rem] bg-[#0A1025]">
                                <img
                                    src={heroImageFailed ? '/src/assets/hero.png' : '/home.jpg'}
                                    alt="Chess board"
                                    className="h-full w-full object-cover object-center"
                                    onError={() => setHeroImageFailed(true)}
                                />
                                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,16,37,0.08)_0%,rgba(10,16,37,0.22)_45%,rgba(10,16,37,0.52)_100%)]" />
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.16),transparent_48%),radial-gradient(circle_at_top_right,rgba(246,215,120,0.12),transparent_24%)] mix-blend-screen" />
                                <div className="pointer-events-none absolute bottom-16 left-1/2 h-[2px] w-[68%] -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,rgba(0,255,240,0),rgba(0,255,240,0.95),rgba(139,92,246,0.9),rgba(0,255,240,0))] shadow-[0_0_16px_rgba(34,211,238,0.8)] animate-neon-sweep" />
                                <div className="pointer-events-none absolute bottom-16 left-1/2 h-4 w-[68%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.35),transparent_68%)] blur-md animate-pulse" />
                            </div>
                        </div>
                        <div className="absolute bottom-8 left-8 hidden rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-sm text-slate-200 shadow-xl shadow-slate-950/60 sm:block">
                            <p className="font-semibold text-white">Elite coaching, strategy labs, tournament readiness.</p>
                        </div>
                    </div>
                </div>

                <section id="about" ref={aboutSectionRef} className="grid gap-10 rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 shadow-[0_25px_80px_-45px_rgba(15,23,42,0.85)] lg:grid-cols-2 scroll-mt-24">
                    <div className="space-y-4">
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">About the academy</p>
                        <h2 className="text-2xl font-bold text-white">A cinematic training ground for modern chess learners.</h2>
                        <p className="text-sm leading-7 text-slate-300">
                            Step into a premium academy where every lesson is designed to sharpen your mind, refine your style, and unlock your full competitive potential.
                        </p>
                    </div>
                    <div className="space-y-4 text-slate-300">
                        <p className="rounded-3xl border border-white/10 bg-slate-900/75 p-5">Expert-led courses, personalized progress tracking, and live strategy sessions for learners of every level.</p>
                        <p className="rounded-3xl border border-white/10 bg-slate-900/75 p-5">Tournament preparation programs that combine technical mastery with psychological strength.</p>
                    </div>
                </section>

                <section id="contact" className="grid gap-6 rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-[0_25px_80px_-45px_rgba(15,23,42,0.85)]">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Ready to begin?</p>
                            <h2 className="text-2xl font-bold text-white">Reach out and start your strategic journey.</h2>
                        </div>
                        <button
                            onClick={() => navigate('/contact')}
                            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                        >
                            Contact Us
                        </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Location</p>
                            <p className="mt-4 text-lg font-semibold text-white">Ratnapura Chess Academy</p>
                            <a
                                href="https://maps.app.goo.gl/nxs7EaQkx4pWQXdr7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/15 hover:text-cyan-100"
                                aria-label="Open Ratnapura Chess Academy location in Google Maps"
                            >
                                Google Map Link
                            </a>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</p>
                            <p className="mt-4 text-lg font-semibold text-white">ratnapurachessacademy@gmail.com</p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Contact Us</p>
                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <a
                                    href="tel:+94779903464"
                                    className="text-lg font-semibold text-white transition hover:text-cyan-300"
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
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Open hours</p>
                            <p className="mt-4 text-lg font-semibold text-white">Mon - Sat, 8am - 8pm</p>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
};

export default Home;
