import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useForm } from 'react-hook-form';
import {
    Settings as SettingsIcon,
    Save,
    Trash2,
    Lock,
    Building,
    DollarSign,
    User,
    RefreshCw,
    X
} from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

export const Settings = () => {
    const {
        settings,
        updateSettings,
        resetSystemData,
        currentUser,
        updateAdminProfile,
        triggerToast
    } = useAcademy();

    // Reset modal state
    const [resetModalOpen, setResetModalOpen] = useState(false);

    // Profile Form setup
    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
        reset: resetProfile
    } = useForm({
        defaultValues: {
            name: currentUser?.name || 'Administrator',
            email: currentUser?.email || 'admin@excelacademy.com',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    // Settings Configuration Form setup
    const {
        register: registerSettings,
        handleSubmit: handleSettingsSubmit,
        formState: { errors: settingsErrors }
    } = useForm({
        defaultValues: {
            academyName: settings.academyName,
            address: settings.address,
            phone: settings.phone,
            email: settings.email,
            currency: settings.currency || 'USD',
            receiptFooter: settings.receiptFooter
        }
    });

    const onSettingsSave = (data) => {
        updateSettings(data);
        triggerToast('Academy configurations updated successfully.', 'success');
    };

    const onProfileSave = (data) => {
        // Validate password changes if provided
        if (data.newPassword || data.currentPassword || data.confirmPassword) {
            if (!data.currentPassword) {
                triggerToast('Please provide your current password to authorize changes.', 'error');
                return;
            }
            if (data.newPassword !== data.confirmPassword) {
                triggerToast('New password credentials do not match.', 'error');
                return;
            }
            if (data.newPassword.length < 6) {
                triggerToast('New password must match at least 6 characters.', 'warning');
                return;
            }
        }

        const payload = {
            name: data.name,
            email: data.email
        };
        if (data.newPassword) {
            payload.password = data.newPassword;
        }

        updateAdminProfile(payload);
        resetProfile({
            name: data.name,
            email: data.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleSystemReset = () => {
        resetSystemData();
        setResetModalOpen(false);
        window.location.reload(); // Hard reload to re-read localStorage initial states
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-extrabold text-slate-805 dark:text-slate-105 my-0">
                    Academy Configurations & Security
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-455 font-semibold mt-0.5">
                    Configure global institute profiles, default invoice cycles, and administrator logins.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Column 1: Institute Settings (gold-accented) */}
                <div className="bg-white/5 dark:bg-slate-900/40 rounded-3xl border border-[rgba(212,175,55,0.12)] shadow-xs p-6 md:p-8 space-y-6 backdrop-blur-sm">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 pb-2 border-b border-slate-50 dark:border-slate-820">
                        <Building className="w-4 h-4 text-indigo-505 shrink-0" />
                        Academy Profile Configuration
                    </h3>

                    <form onSubmit={handleSettingsSubmit(onSettingsSave)} className="space-y-4">

                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                Academy Name *
                            </label>
                            <input
                                {...registerSettings('academyName', { required: 'Name is required' })}
                                type="text"
                                className="px-3.5 py-2.5 w-full rounded-xl border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                            />
                            {settingsErrors.academyName && <p className="text-rose-550 text-[10px] font-semibold">{settingsErrors.academyName.message}</p>}
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">Contact Email *</label>
                                    <input
                                        {...registerSettings('email', { required: 'Required' })}
                                        type="email"
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                                />
                            </div>

                            <div className="space-y-1 font-mono">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Telephone *</label>
                                    <input
                                        {...registerSettings('phone', { required: 'Required' })}
                                        type="text"
                                        className="px-3.5 py-2.5 w-full rounded-xl border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-705 dark:text-slate-300">Headquarters Address *</label>
                            <input
                                {...registerSettings('address', { required: 'Required' })}
                                type="text"
                                className="px-3.5 py-2.5 w-full rounded-xl border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                            />
                        </div>

                        {/* Currency Option */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-707 dark:text-slate-300">Accounting Currency Display</label>
                            <select
                                {...registerSettings('currency')}
                                className="px-3.5 py-2.5 w-full rounded-xl border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="LKR">LKR (Rs.)</option>
                            </select>
                        </div>

                        {/* Receipt Footer Message */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-707 dark:text-slate-300">Invoice Note Receipt Footer</label>
                            <textarea
                                {...registerSettings('receiptFooter')}
                                rows="3"
                                className="p-3 w-full rounded-xl border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                            ></textarea>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 shadow-md cursor-pointer transition-all active:scale-98"
                            >
                                <Save className="w-3.5 h-3.5" />
                                Commit Academy Profiles
                            </button>
                        </div>

                    </form>
                </div>

                {/* Column 2: Security & Storage Admin config */}
                <div className="space-y-6">

                    {/* Admin Profile Details */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs p-6 md:p-8 space-y-6">
                        <h3 className="text-sm font-bold text-slate-808 dark:text-slate-100 flex items-center gap-1.5 pb-2 border-b border-slate-50 dark:border-slate-820">
                            <User className="w-4 h-4 text-emerald-505 shrink-0" />
                            Administrator Credentials Profile
                        </h3>

                        <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-4">
                            {/* Name */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-305">Display Name *</label>
                                <input
                                    {...registerProfile('name', { required: 'Name is required' })}
                                    type="text"
                                    className="px-3.5 py-2.5 w-full rounded-xl border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-705 dark:text-slate-305 font-mono">Email Address *</label>
                                <input
                                    {...registerProfile('email', { required: 'Email coordinates are required' })}
                                    type="email"
                                    className="px-3.5 py-2.5 w-full rounded-xl border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                                />
                            </div>

                            {/* Password blocks */}
                            <div className="bg-slate-50/50 dark:bg-slate-850/40 p-4 rounded-xl border border-slate-102 dark:border-slate-800 space-y-3">
                                <span className="text-[10px] font-bold text-[#F6D778] uppercase tracking-widest flex items-center gap-1.5">
                                    <Lock className="w-3 h-3 text-[#F6D778]" />
                                    Credentials Lock Override
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-[#F8FAFC]">Current Password</label>
                                        <input
                                            {...registerProfile('currentPassword')}
                                            type="password"
                                            placeholder="••••••"
                                            className="px-2.5 py-2 w-full rounded-lg border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-[#F8FAFC]">New Password</label>
                                        <input
                                            {...registerProfile('newPassword')}
                                            type="password"
                                            placeholder="••••••"
                                            className="px-2.5 py-2 w-full rounded-lg border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-[#F8FAFC]">Confirm Password</label>
                                        <input
                                            {...registerProfile('confirmPassword')}
                                            type="password"
                                            placeholder="••••••"
                                            className="px-2.5 py-2 w-full rounded-lg border border-[#2D3A56] bg-[#0B1020]/60 text-[#F8FAFC] placeholder:text-[#A69A6A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-650 hover:bg-emerald-700 shadow-md cursor-pointer transition-all active:scale-98"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    Save Admin credentials
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* Database management reset */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs p-6 md:p-8 space-y-4">
                        <h3 className="text-sm font-bold text-rose-650 flex items-center gap-1.5 pb-2 border-b border-slate-50 dark:border-slate-820">
                            <Trash2 className="w-4 h-4 text-rose-505 shrink-0 animate-bounce" />
                            Danger Operations workspace
                        </h3>

                        <p className="text-xs font-semibold text-slate-550 dark:text-slate-455 leading-relaxed">
                            Caution: Resetting the academy system clears all registered students, attendance history, transaction records, and restores sample database mocks in LocalStorage (`academy_*` keys).
                        </p>

                        <button
                            onClick={() => setResetModalOpen(true)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[rgba(212,175,55,0.06)] hover:bg-[rgba(212,175,55,0.10)] text-[#D4AF37] border border-[rgba(212,175,55,0.12)] text-xs font-bold rounded-xl cursor-pointer shadow-sm active:translate-y-0.5 transition-all"
                        >
                            <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                            Reset Local Storage Database
                        </button>
                    </div>

                </div>

            </div>

            {/* Confirmation modal for reset */}
            <ConfirmationModal
                isOpen={resetModalOpen}
                title="Flush Local Storage Registers"
                message="Are you sure you want to flush all records? All current students, invoice collections, class logs, and teacher specialties will be destroyed and reset to initial sample templates."
                confirmText="Reset Database"
                type="danger"
                onConfirm={handleSystemReset}
                onCancel={() => setResetModalOpen(false)}
            />
        </div>
    );
};

export default Settings;
