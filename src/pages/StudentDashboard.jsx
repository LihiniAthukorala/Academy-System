import React, { useEffect, useState } from 'react';
import { BookOpen, CalendarCheck2, CircleDollarSign, GraduationCap } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { fetchStudentWorkspace } from '../utils/api';
import { formatLKR } from '../utils/currency';

export const StudentDashboard = () => {
    const { currentUser } = useAcademy();
    const [workspace, setWorkspace] = useState(null);
    const [loadError, setLoadError] = useState('');
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setWorkspace(null);
        setLoadError('');

        fetchStudentWorkspace()
            .then((data) => {
                if (!data?.student || !Array.isArray(data.attendance) || !Array.isArray(data.payments)) {
                    throw new Error('The student dashboard returned invalid data.');
                }
                if (!cancelled) setWorkspace(data);
            })
            .catch((error) => {
                if (!cancelled) setLoadError(error.message);
            });

        return () => {
            cancelled = true;
        };
    }, [currentUser?.id, retryCount]);

    if (loadError) {
        return (
            <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-700 dark:text-rose-200">
                <p>Could not load your student dashboard: {loadError}</p>
                <button
                    type="button"
                    onClick={() => setRetryCount((count) => count + 1)}
                    className="mt-3 rounded-xl border border-rose-500/30 px-4 py-2 font-semibold hover:bg-rose-500/10"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (!workspace) {
        return <p role="status" className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">Loading your student dashboard…</p>;
    }

    const { student, class: studentClass, attendance, payments } = workspace;
    const presentCount = attendance.filter((record) => record.status === 'Present').length;
    const attendancePercentage = attendance.length
        ? Math.round((presentCount / attendance.length) * 100)
        : 0;
    const outstandingBalance = payments.reduce((total, payment) => total + Number(payment.balance || 0), 0);
    const summaryCards = [
        { label: 'Enrolled class', value: studentClass?.name || 'Not assigned', icon: BookOpen, color: 'text-indigo-500' },
        { label: 'Attendance', value: `${attendancePercentage}%`, icon: CalendarCheck2, color: 'text-emerald-500' },
        { label: 'Outstanding fees', value: formatLKR(outstandingBalance), icon: CircleDollarSign, color: 'text-amber-500' }
    ];

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 dark:border-indigo-900/60 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">Student workspace</p>
                <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                    Welcome, {student.name}
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Here is your class, attendance, and fee summary.
                </p>
                <p className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-200">
                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                    Student ID: {student.id}{student.grade ? ` · ${student.grade}` : ''}
                </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {summaryCards.map(({ label, value, icon: Icon, color }) => (
                    <article key={label} className="flex min-w-0 items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <Icon className={`h-6 w-6 shrink-0 ${color}`} />
                        <div className="min-w-0">
                            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                            <p className="mt-1 truncate text-lg font-bold text-slate-900 dark:text-white">{value}</p>
                        </div>
                    </article>
                ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        <BookOpen className="h-5 w-5 text-indigo-500" /> Your class
                    </h2>
                    {studentClass ? (
                        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                            {[
                                ['Class', studentClass.name],
                                ['Subject', studentClass.subject],
                                ['Schedule', [studentClass.day, studentClass.startTime, studentClass.endTime].filter(Boolean).join(' · ')],
                                ['Classroom', studentClass.classroom],
                                ['Teacher', studentClass.teacherName]
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
                                    <dd className="mt-1 text-slate-800 dark:text-slate-200">{value || '—'}</dd>
                                </div>
                            ))}
                        </dl>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">You are not currently assigned to a class. Please contact the academy.</p>
                    )}
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="font-bold text-slate-900 dark:text-white">Recent attendance</h2>
                    {attendance.length ? (
                        <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                            {attendance.slice(0, 6).map((record, index) => (
                                <li key={`${record.date}-${index}`} className="flex items-center justify-between gap-3 py-3 text-sm">
                                    <span className="min-w-0 truncate text-slate-600 dark:text-slate-300">{record.date} · {record.className || 'Class'}</span>
                                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${record.status === 'Present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                                        {record.status || '—'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No attendance has been recorded yet.</p>
                    )}
                </article>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-100 p-5 dark:border-slate-800">
                    <h2 className="font-bold text-slate-900 dark:text-white">Fee payment history</h2>
                </div>
                {payments.length ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Billing period</th>
                                    <th className="px-5 py-3 font-semibold">Paid</th>
                                    <th className="px-5 py-3 font-semibold">Balance</th>
                                    <th className="px-5 py-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {payments.map((payment, index) => (
                                    <tr key={`${payment.year}-${payment.month}-${index}`}>
                                        <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{[payment.month, payment.year].filter(Boolean).join(' ') || payment.paymentDate || '—'}</td>
                                        <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{formatLKR(payment.paidAmount)}</td>
                                        <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{formatLKR(payment.balance)}</td>
                                        <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{payment.status || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="p-5 text-sm text-slate-500 dark:text-slate-400">No fee payments have been recorded yet.</p>
                )}
            </section>
        </div>
    );
};

export default StudentDashboard;
