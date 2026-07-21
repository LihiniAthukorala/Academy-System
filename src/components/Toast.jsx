import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const ToastContainer = () => {
    const { toasts, removeToast } = useAcademy();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 md:px-0">
            {toasts.map((toast) => {
                let bgColor = 'bg-white dark:bg-slate-800';
                let borderLeftColor = 'border-blue-500';
                let Icon = Info;
                let iconColor = 'text-blue-500';

                switch (toast.type) {
                    case 'success':
                        borderLeftColor = 'border-emerald-500';
                        iconColor = 'text-emerald-500';
                        Icon = CheckCircle;
                        break;
                    case 'warning':
                        borderLeftColor = 'border-amber-500';
                        iconColor = 'text-amber-500';
                        Icon = AlertTriangle;
                        break;
                    case 'error':
                        borderLeftColor = 'border-rose-500';
                        iconColor = 'text-rose-500';
                        Icon = AlertCircle;
                        break;
                    default:
                        borderLeftColor = 'border-indigo-500';
                        iconColor = 'text-indigo-500';
                        Icon = Info;
                }

                return (
                    <div
                        key={toast.id}
                        className={`flex items-start p-4 rounded-xl shadow-lg border-l-4 border-slate-200 ${borderLeftColor} ${bgColor} border dark:border-slate-700 animate-slide-in transition-all duration-300`}
                        role="alert"
                    >
                        <div className="flex-shrink-0 mr-3">
                            <Icon className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                                {toast.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {toast.message}
                            </p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="flex-shrink-0 ml-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default ToastContainer;
