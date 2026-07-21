import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmationModal = ({
    isOpen,
    title = 'Confirmation Required',
    message = 'Are you sure you want to perform this action? This operation might be irreversible.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning', // 'warning' | 'danger' | 'info'
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    const btnColors = {
        danger: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white',
        warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white',
        info: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
            ></div>

            {/* Modal Content container */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-2xl border border-slate-100 dark:border-slate-700 transition-all">
                {/* Close Button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 dark:hover:text-slate-205 cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20 mr-4">
                        <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" aria-hidden="true" />
                    </div>
                    <div className="mt-0 text-left">
                        <h3 className="text-lg font-bold leading-6 text-slate-900 dark:text-slate-100 mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-xl border border-slate-250 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none cursor-pointer"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`inline-flex justify-center rounded-xl px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${btnColors[type] || btnColors.warning}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
