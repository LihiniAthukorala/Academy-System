import React, { useState, useRef, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLocation, Link } from 'react-router-dom';
import {
    Bell,
    Sun,
    Moon,
    Search,
    Menu,
    ChevronDown,
    User,
    LogOut,
    CheckCircle,
    Inbox
} from 'lucide-react';

export const Header = ({ isCollapsed, setIsMobileOpen }) => {
    const {
        currentUser,
        logout,
        theme,
        toggleTheme,
        notifications,
        markNotificationAsRead,
        clearAllNotifications
    } = useAcademy();

    const location = useLocation();

    // UI states
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

    const profileRef = useRef(null);
    const notifRef = useRef(null);

    // Close dropdowns on outside clicks
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    if (!currentUser) return null;

    // Derive page title from path
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.startsWith('/students/')) return 'Student Profile';
        switch (path) {
            case '/dashboard': return 'Dashboard Overview';
            case '/students': return 'Student Directory';
            case '/attendance': return 'Attendance Registry';
            case '/fees': return 'Fee & Invoicing Ledger';
            case '/classes': return 'Scheduled Classes';
            case '/teachers': return 'Academy Instructor Core';
            case '/reports': return 'Analytics & Reports';
            case '/notifications': return 'System Notifications';
            default: return 'Academy Management';
        }
    };

    const unreadNotifs = notifications.filter((n) => !n.read);

    // Format datestring relative-like
    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">

            {/* Title & Hamburger */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer shrink-0"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-150 tracking-tight leading-none my-0">
                    {getPageTitle()}
                </h1>
            </div>

            {/* Quick Search, Notifications, Theme & Profile */}
            <div className="flex items-center gap-2 md:gap-4">

                {/* Search Input Bar removed per request */}

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors cursor-pointer shrink-0"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notifications Dropdown */}
                <div className="relative shrink-0" ref={notifRef}>
                    <button
                        onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                        className={`p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors cursor-pointer relative ${notifDropdownOpen ? 'bg-slate-50 dark:bg-slate-850' : ''
                            }`}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadNotifs.length > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping"></span>
                        )}
                    </button>

                    {/* Notifications Panel overlay */}
                    {notifDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-80 max-h-[480px] flex flex-col rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 z-50 animate-slide-in">
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                    Notifications ({unreadNotifs.length})
                                </span>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAllNotifications}
                                        className="text-xs font-semibold text-rose-550 hover:text-rose-600 dark:text-rose-455 hover:underline cursor-pointer"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="flex-1 overflow-y-auto max-h-[300px] divide-y divide-slate-100 dark:divide-slate-750">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-8 text-center">
                                        <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                                        <p className="text-xs text-slate-450 dark:text-slate-500 font-semibold">
                                            Your inbox is clean
                                        </p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`p-4 transition-colors flex gap-3 items-start ${notif.read ? 'opacity-70' : 'bg-indigo-50/20 dark:bg-indigo-950/10'
                                                }`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                    {notif.title}
                                                </p>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug break-words">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[9px] text-slate-400 mt-2 font-semibold flex items-center">
                                                    {formatTime(notif.date)}
                                                </p>
                                            </div>

                                            {/* Tick to Read */}
                                            {!notif.read && (
                                                <button
                                                    onClick={() => markNotificationAsRead(notif.id)}
                                                    className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 cursor-pointer"
                                                    title="Mark as read"
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer View All Link */}
                            <div className="p-3 text-center border-t border-slate-100 dark:border-slate-700">
                                <Link
                                    to="/notifications"
                                    onClick={() => setNotifDropdownOpen(false)}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    View All Notifications
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Vertical divider line */}
                <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 shrink-0"></div>

                {/* User Account Dropdown */}
                <div className="relative shrink-0" ref={profileRef}>
                    <button
                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-105 dark:hover:bg-slate-850 hover:shadow-2xs transition-all pointer-events-auto cursor-pointer"
                    >
                        <img
                            src={currentUser.avatarUrl || '/default-avatar.png'}
                            alt={currentUser.name}
                            className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/10"
                        />
                        <div className="hidden sm:block text-left max-w-[100px]">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none">
                                {currentUser.name}
                            </p>
                            <span className="text-[9px] text-slate-500 dark:text-slate-450 font-semibold truncate block mt-0.5">
                                {currentUser.role}
                            </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-455 hover:text-slate-600 shrink-0" />
                    </button>

                    {/* Profile Dropdown Panel */}
                    {profileDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 z-50 py-2 animate-slide-in">
                            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                                <p className="text-xs font-bold text-slate-850 dark:text-slate-200 truncate">
                                    Signed in as:
                                </p>
                                <p className="text-[10px] text-slate-455 dark:text-slate-400 font-semibold truncate mt-0.5">
                                    {currentUser.email}
                                </p>
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                            <button
                                onClick={() => {
                                    setProfileDropdownOpen(false);
                                    logout();
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 w-full text-left transition-colors cursor-pointer"
                            >
                                <LogOut className="w-4 h-4 text-rose-500" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
