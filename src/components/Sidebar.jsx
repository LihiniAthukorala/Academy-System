import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAcademy } from '../context/AcademyContext';
import {
    LayoutDashboard,
    Users,
    CheckSquare,
    DollarSign,
    BookOpen,
    GraduationCap,
    BarChart3,
    Bell,
    LogOut,
    ChevronLeft,
    ChevronRight,
    BookOpenCheck
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const { currentUser, logout, notifications } = useAcademy();

    if (!currentUser) return null;

    const unreadNotifCount = notifications.filter((n) => !n.read).length;

    const menuItems = [
        {
            path: '/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            roles: ['Administrator', 'Teacher']
        },
        {
            path: '/students',
            label: 'Students',
            icon: Users,
            roles: ['Administrator']
        },
        {
            path: '/attendance',
            label: 'Attendance',
            icon: CheckSquare,
            roles: ['Administrator', 'Teacher']
        },
        {
            path: '/fees',
            label: 'Fee Payments',
            icon: DollarSign,
            roles: ['Administrator']
        },
        {
            path: '/classes',
            label: 'Classes',
            icon: BookOpen,
            roles: ['Administrator', 'Teacher']
        },
        {
            path: '/teachers',
            label: 'Teachers',
            icon: GraduationCap,
            roles: ['Administrator']
        },
        {
            path: '/reports',
            label: 'Reports',
            icon: BarChart3,
            roles: ['Administrator', 'Teacher']
        },
        {
            path: '/notifications',
            label: 'Notifications',
            icon: Bell,
            roles: ['Administrator', 'Teacher'],
            badge: unreadNotifCount > 0 ? unreadNotifCount : null
        }
    ];

    // Filter items according to active user's roles
    const filteredMenuItems = menuItems.filter(
        (item) => item.roles.includes(currentUser.role)
    );

    const sidebarWidthStyles = isCollapsed ? 'w-20' : 'w-64';

    const sidebarContent = (
        <div className="flex flex-col h-full bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-sm">
            {/* Brand Header */}
            <div className="flex items-center justify-between h-20 px-5 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/95">
                <div className="flex items-center gap-3 overflow-hidden">
                    <img src="/ratnapura-logo.jpeg" alt="Ratnapura Chess Academy logo" className="w-12 h-12 rounded-2xl bg-slate-900 object-cover shadow-lg shadow-slate-200/10" />
                    {!isCollapsed && (
                        <span className="text-base font-semibold tracking-wide text-slate-900 dark:text-white">
                            Ratnapura Chess Academy
                        </span>
                    )}
                </div>
                {!isMobileOpen && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex items-center justify-center w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-200 shrink-0 cursor-pointer"
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
                {filteredMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-3xl text-sm font-semibold transition-all duration-200 group relative ${isActive
                                    ? 'bg-violet-100/90 text-violet-700 shadow-[0_10px_30px_-20px_rgba(79,70,229,0.45)] border-l-4 border-violet-500'
                                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-slate-100'
                                }`
                            }
                        >
                            <Icon className="w-5 h-5 shrink-0 text-slate-500 dark:text-slate-400 transition-transform group-hover:scale-110" />
                            {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}

                            {/* Badge count */}
                            {item.badge && !isCollapsed && (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full shrink-0 min-w-5">
                                    {item.badge}
                                </span>
                            )}

                            {/* Collapsed Tooltip */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs font-semibold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 whitespace-nowrap shadow-md">
                                    {item.label}
                                    {item.badge && ` (${item.badge})`}
                                </div>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logged in User Profile Info (only when not collapsed) */}
            {!isCollapsed && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                        <img
                            src={currentUser.avatarUrl || 'https://via.placeholder.com/150'}
                            alt={currentUser.name}
                            className="w-9 h-9 rounded-full object-cover shadow-sm bg-slate-200 ring-2 ring-white dark:ring-slate-700"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none">
                                {currentUser.name}
                            </p>
                            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold truncate mt-1">
                                {currentUser.role}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout button */}
            <div className="px-3 pb-4 pt-2 shrink-0">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 w-full transition-all duration-200 group relative cursor-pointer"
                >
                    <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    {!isCollapsed && <span>Logout</span>}
                    {isCollapsed && (
                        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs font-semibold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 w-max shadow-md">
                            Logout
                        </div>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`hidden md:block h-screen fixed top-0 left-0 z-20 transition-all duration-300 ${sidebarWidthStyles}`}>
                {sidebarContent}
            </aside>

            {/* Mobile Drawer Slide-out Menu */}
            <div
                className={`fixed inset-0 z-40 md:hidden bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMobileOpen(false)}
            >
                <aside
                    className={`h-screen w-64 bg-white dark:bg-slate-900 transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {sidebarContent}
                </aside>
            </div>
        </>
    );
};

export default Sidebar;
