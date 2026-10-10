import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Menu, Moon, Sparkles, Sun, Trophy, X } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { fetchPublicArticles } from '../utils/api';

export const Home = () => {
    const { theme, toggleTheme, teachers } = useAcademy();
    const navigate = useNavigate();
    const location = useLocation();
    const aboutSectionRef = useRef(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [articles, setArticles] = useState([]);

    const stats = [
        { label: 'Total Students', value: '1.8K+' },
        { label: 'Coaches', value: teachers.length },
        { label: 'Years of Experience', value: '12' }
    ];

    useEffect(() => {
        const section = new URLSearchParams(location.search).get('section');

        if (section === 'about' && aboutSectionRef.current) {
            aboutSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [location.search]);

    useEffect(() => {
        fetchPublicArticles().then(setArticles).catch((error) => {
            console.error('Could not load academy articles:', error);
        });
    }, []);

    return (
        <div className="min-h-screen overflow-hidden bg-[#07111f] text-white selection:bg-amber-300 selection:text-slate-950">
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

            <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.09),_transparent_30%)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-96 bg-[radial-gradient(circle_at_bottom_right,_rgba(30,64,175,0.14),_transparent_28%)]" />

            <header className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
                <a
                    href="https://share.google/ZPkYpwJZXGbxIyoAU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 transition-opacity hover:opacity-90"
                    aria-label="Open Ratnapura Chess Academy location in Google Maps"
                >
                    <img src="/ratnapura-logo.jpeg" alt="Ratnapura Chess Academy" className="h-11 w-11 rounded-2xl object-cover border border-amber-300/30 shadow-xl shadow-amber-500/10" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-200/80">Ratnapura</p>
                        <p className="text-base font-black tracking-tight text-white">Chess Academy</p>
                    </div>
                </a>

                <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-300 md:flex">
                    <Link to="/home" className="text-amber-200 transition hover:text-amber-100">Home</Link>
                    <Link to="/home?section=about" className="transition hover:text-amber-200">About</Link>
                    <a href="#coaches" className="transition hover:text-amber-200">Coaches</a>
                    <a href="#tournaments" className="transition hover:text-amber-200">Programs</a>
                    <a href="#contact" className="transition hover:text-amber-200">Contact</a>
                </nav>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-100 transition hover:border-amber-300/30 hover:bg-white/10"
                    >
                        {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="hidden rounded-xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-amber-300/40 hover:bg-white/[0.08] md:inline-flex"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="hidden rounded-xl bg-amber-300 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-xl shadow-amber-300/15 transition hover:bg-amber-200 md:inline-flex"
                    >
                        Get Started
                    </button>
                    <button onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Toggle navigation menu" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-100 md:hidden">
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </header>

            {mobileMenuOpen && (
                <nav className="relative z-30 mx-5 -mt-1 space-y-1 rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl md:hidden">
                    {[['Home', '/home'], ['About', '/home?section=about'], ['Coaches', '#coaches'], ['Programs', '#tournaments'], ['Contact', '#contact'], ['Login', '/login']].map(([label, href]) => (
                        <a key={label} href={href} onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-amber-200">{label}</a>
                    ))}
                </nav>
            )}

            <main id="home" className="relative z-20 mx-auto flex max-w-7xl flex-col gap-20 px-5 py-10 lg:px-8 lg:py-16">
                <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <div className="space-y-8 home-hero-copy">
                        <div className="inline-flex home-reveal home-reveal-delay-1 items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-amber-200">
                            <Sparkles className="h-3.5 w-3.5" />
                            Think deeper. Play stronger.
                        </div>
                        <div className="space-y-6">
                            <h1 className="home-reveal home-reveal-delay-2 max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                                Your next move starts <span className="text-amber-300">here.</span>
                            </h1>
                            <p className="home-reveal home-reveal-delay-3 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                                Structured chess coaching for curious beginners, ambitious competitors, and every player ready to grow with confidence.
                            </p>
                        </div>
                        <div className="home-reveal home-reveal-delay-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
                            >
                                Enter academy <ArrowRight className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-amber-300/40 hover:bg-white/[0.08]"
                            >
                                Explore programs <ChevronRight className="h-4 w-4 text-amber-300" />
                            </button>
                        </div>

                        <div className="home-reveal home-reveal-delay-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {stats.map((item) => (
                                <div key={item.label} className="home-stat-card rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition hover:border-amber-300/30">
                                    <p className="text-2xl font-black text-white">{item.value}</p>
                                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center home-hero-art">
                        <div className="home-hero-glow absolute h-[80%] w-[80%] rounded-full bg-amber-300/10 blur-3xl" />
                        <div className="home-hero-frame relative overflow-hidden rounded-[2rem] border border-amber-200/20 bg-slate-950/80 p-3 shadow-2xl shadow-black/40">
                            <div className="absolute -right-8 top-8 h-24 w-24 rounded-full bg-gradient-to-br from-violet-500/20 to-sky-400/10 blur-3xl" />
                            <div className="relative h-[390px] w-full overflow-hidden rounded-[1.5rem] bg-[#0A1025] sm:h-[480px]">
                                <img
                                    src="/chess-andres.png"
                                    alt="Colorful chess pieces representing strategic mastery"
                                    className="h-full w-full object-contain object-center opacity-95"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,16,37,0.08)_0%,rgba(10,16,37,0.22)_45%,rgba(10,16,37,0.52)_100%)]" />
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.16),transparent_48%),radial-gradient(circle_at_top_right,rgba(246,215,120,0.12),transparent_24%)] mix-blend-screen" />
                                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl border border-white/15 bg-slate-950/75 px-4 py-3 backdrop-blur-md">
                                    <span className="text-xs font-semibold text-white">Build skill. Build character.</span>
                                    <Trophy className="h-4 w-4 text-amber-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section id="about" ref={aboutSectionRef} className="home-section-reveal grid gap-10 rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 shadow-[0_25px_80px_-45px_rgba(15,23,42,0.85)] lg:grid-cols-2 scroll-mt-24">
                    <div className="space-y-4">
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">About the academy</p>
                        <h2 className="text-3xl font-black tracking-tight text-white">More than a game. A way of thinking.</h2>
                        <p className="text-sm leading-7 text-slate-300">
                            Step into a premium academy where every lesson is designed to sharpen your mind, refine your style, and unlock your full competitive potential.
                        </p>
                    </div>
                    <div className="space-y-4 text-slate-300">
                        <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">Expert-led courses, personalized progress tracking, and live strategy sessions for learners of every level.</p>
                        <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">Tournament preparation programs that combine technical mastery with psychological strength.</p>
                    </div>
                </section>

                <section id="tournaments" className="scroll-mt-24 space-y-8">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">The academy path</p>
                            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Choose your next challenge.</h2>
                        </div>
                        <p className="max-w-sm text-sm leading-6 text-slate-400">A clear progression from first principles to confident tournament play.</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {(articles.length > 0 ? articles.slice(0, 3) : [
                            ['01', 'Foundation', 'Learn the rules, patterns, and habits that make every move count.', '♟'],
                            ['02', 'Performance', 'Sharpen calculation, tactics, and decision-making with expert feedback.', '♞'],
                            ['03', 'Competition', 'Prepare for the clock, the board, and the pressure of tournament day.', '♛'],
                        ]).map((item, index) => {
                            const isArticle = !Array.isArray(item);
                            const number = isArticle ? String(index + 1).padStart(2, '0') : item[0];
                            const title = isArticle ? item.title : item[1];
                            const description = isArticle ? item.excerpt : item[2];
                            const piece = isArticle ? '♜' : item[3];
                            return (
                            <article key={isArticle ? item.id : title} className="home-program-card group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-amber-300/30">
                                <div className="flex items-start justify-between">
                                    <span className="text-xs font-bold tracking-[0.25em] text-amber-300">{number}</span>
                                    <span className="text-3xl text-amber-200/70">{piece}</span>
                                </div>
                                <h3 className="mt-8 text-xl font-bold text-white">{title}</h3>
                                <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
                                {isArticle ? <Link to={`/articles/${item.id}`} className="mt-6 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.15em] text-slate-300 transition group-hover:text-amber-200">Explore article <ChevronRight className="h-3.5 w-3.5" /></Link> : <span className="mt-6 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.15em] text-slate-300 transition group-hover:text-amber-200">Learn more <ChevronRight className="h-3.5 w-3.5" /></span>}
                            </article>
                            );
                        })}
                    </div>
                </section>

                <section id="coaches" className="scroll-mt-24 space-y-10 rounded-[2rem] border border-slate-700/60 bg-[#050d1c] px-6 py-8 shadow-[0_25px_80px_-45px_rgba(15,23,42,0.85)] sm:px-10 sm:py-10">
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Meet the team</p>
                        <h2 className="text-3xl font-black tracking-tight text-white">Our registered coaches</h2>
                        <p className="max-w-2xl text-base leading-7 text-slate-300">
                            Meet the coaches helping our students grow their skills and confidence.
                        </p>
                    </div>
                    {teachers.length > 0 ? (
                        <div className="grid max-w-5xl gap-5 sm:grid-cols-2">
                            {teachers.map((teacher) => (
                                <article key={teacher.id} className="group flex min-h-[132px] items-center gap-5 rounded-[1.75rem] border border-slate-700/70 bg-[#0b1428] px-6 py-5 transition duration-300 hover:-translate-y-1 hover:border-amber-300/30 hover:bg-[#101b32]">
                                    {teacher.profileImage ? (
                                        <img
                                            src={teacher.profileImage}
                                            alt={`${teacher.name} profile`}
                                            className="h-20 w-20 shrink-0 rounded-2xl object-cover shadow-lg shadow-black/20"
                                        />
                                    ) : (
                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-amber-300/10 text-lg font-bold text-amber-200">
                                            {teacher.name?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'C'}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h3 className="truncate text-lg font-bold text-white transition group-hover:text-amber-100">{teacher.name}</h3>
                                        <p className="mt-2 text-base text-slate-400">{teacher.qualifications || 'Chess Coach'}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-2xl border border-slate-700/70 bg-[#0b1428] p-6 text-sm text-slate-300">
                            Coach profiles will appear here once staff have been registered.
                        </p>
                    )}
                </section>

                <section id="contact" className="grid gap-6 rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-[0_25px_80px_-45px_rgba(15,23,42,0.85)]">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Ready to begin?</p>
                            <h2 className="text-2xl font-bold text-white">Reach out and start your strategic journey.</h2>
                        </div>
                        <button
                            onClick={() => navigate('/contact')}
                            className="inline-flex items-center justify-center rounded-xl bg-amber-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
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
