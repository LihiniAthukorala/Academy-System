import React from 'react';

export const StatusBadge = ({ status }) => {
    let bgStyles = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350';

    const cleanStatus = status?.trim();

    switch (cleanStatus) {
        // Payment Statuses
        case 'Paid':
            bgStyles = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
            break;
        case 'Partially Paid':
            bgStyles = 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
            break;
        case 'Pending':
            bgStyles = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
            break;
        case 'Overdue':
            bgStyles = 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300';
            break;

        // Student / Teacher / Class Attendance & General Statuses
        case 'Active':
        case 'Present':
            bgStyles = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
            break;
        case 'Inactive':
        case 'Absent':
            bgStyles = 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300';
            break;
        case 'Late':
            bgStyles = 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
            break;
        case 'Excused':
            bgStyles = 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
            break;
        default:
            break;
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${bgStyles}`}>
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-75"></span>
            {cleanStatus}
        </span>
    );
};

export default StatusBadge;
