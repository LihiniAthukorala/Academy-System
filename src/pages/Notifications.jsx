import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
    Bell,
    Trash2,
    CheckCircle,
    Inbox,
    AlertTriangle,
    Info,
    DollarSign,
    UserCheck
} from 'lucide-react';

export const Notifications = () => {
    const {
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        triggerToast
    } = useAcademy();

    const [activeFilter, setActiveFilter] = useState('All');

    const filteredNotifs = notifications.filter((n) => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Read') return n.read;
        if (activeFilter === 'Unread') return !n.read;
        if (activeFilter === 'Alert') return n.title.toLowerCase().includes('fee') || n.title.toLowerCase().includes('attendance');
        return true;
    });

    const getIcon = (title) => {
        const lowercaseTitle = title.toLowerCase();
        if (lowercaseTitle.includes('fee') || lowercaseTitle.includes('payment') || lowercaseTitle.includes('invoice')) {
            return <DollarSign className="w-4 h-4 text-emerald-500" />;
        }
        if (lowercaseTitle.includes('attendance') || lowercaseTitle.includes('absent')) {
            return <UserCheck className="w-4 h-4 text-indigo-500" />;
        }
        if (lowercaseTitle.includes('limit') || lowercaseTitle.includes('danger') || lowercaseTitle.includes('alert')) {
            return <AlertTriangle className="w-4 h-4 text-rose-500" />;
        }
        return <Info className="w-4 h-4 text-blue-500" />;
    };

    const handleMarkRead = (id) => {
        markNotificationAsRead(id);
        triggerToast('Notification marked as read.', 'success');
    };

    const handleClear = () => {
        clearAllNotifications();
        triggerToast('All notifications cleared.', 'info');
    };

    const formatDateTime = (dateStr) => {
        const d = new Date(dateStr);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-805 dark:text-slate-105 my-0">
                        System Alerts & Messages
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-455 font-semibold mt-0.5">
                        Audit automatic warning alerts regarding overdue student invoice balances, low classroom attendance rates, and enrollment events.
                    </p>
                </div>
                {notifications.length > 0 && (
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-100 rounded-xl cursor-pointer shadow-2xs transition-all active:scale-98 shrink-0"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear All Logs
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-max">
                {['All', 'Unread', 'Read', 'Alert'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveFilter(tab)}
                        className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${activeFilter === tab
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Notifications list */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
                {filteredNotifs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <Inbox className="w-10 h-10 text-slate-350 dark:text-slate-655 mb-2" />
                        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Inbox Clean</h3>
                        <p className="text-xs text-slate-450 dark:text-slate-500 mt-2 max-w-xs mx-auto">
                            No alert logs match your tab query. The academy is running smoothly.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredNotifs.map((n) => (
                            <div
                                key={n.id}
                                className={`py-4 first:pt-0 last:pb-0 transition-colors flex gap-4 items-start ${n.read ? 'opacity-65' : ''
                                    }`}
                            >
                                {/* Visual Icon indicator */}
                                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 shrink-0 border border-slate-100 dark:border-none">
                                    {getIcon(n.title)}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row gap-1 sm:items-center justify-between">
                                        <h4 className="font-extrabold text-slate-900 dark:text-slate-201 text-sm leading-snug">
                                            {n.title}
                                        </h4>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold font-mono">
                                            {formatDateTime(n.date)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                                        {n.message}
                                    </p>
                                </div>

                                {/* Operations */}
                                {!n.read && (
                                    <button
                                        onClick={() => handleMarkRead(n.id)}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-205 dark:border-slate-750 text-[10px] font-bold text-slate-600 hover:text-indigo-650 hover:bg-indigo-50 dark:hover:bg-slate-800 cursor-pointer shadow-3xs"
                                        title="Mark as Read"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Acknowledge
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Notifications;
