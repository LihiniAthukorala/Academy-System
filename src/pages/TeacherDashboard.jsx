import React, { useEffect, useState } from 'react';
import { BookOpen, GraduationCap, Users } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { fetchTeacherWorkspace } from '../utils/api';
import { formatLKR } from '../utils/currency';

export const TeacherDashboard = () => {
    const { currentUser } = useAcademy();
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [retryCount, setRetryCount] = useState(0);
    const [expandedClassId, setExpandedClassId] = useState(null);
    const [expandedStudentId, setExpandedStudentId] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setLoadError('');

        fetchTeacherWorkspace()
            .then((workspace) => {
                if (!Array.isArray(workspace.classes) || !Array.isArray(workspace.students)) {
                    throw new Error('The teacher workspace returned invalid class or student data.');
                }
                if (!cancelled) {
                    setClasses(workspace.classes);
                    setStudents(workspace.students);
                }
            })
            .catch((error) => {
                if (!cancelled) setLoadError(error.message);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [currentUser?.teacherId, retryCount]);

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">Teacher workspace</p>
                <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                    Welcome, {currentUser?.name}
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Your assigned classes and their students are listed below.
                </p>
                {loadError && (
                    <div role="alert" className="mt-4 flex flex-col gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between">
                        <p>Could not load your classes and students: {loadError}</p>
                        <button
                            type="button"
                            onClick={() => setRetryCount((count) => count + 1)}
                            className="shrink-0 rounded-xl border border-rose-500/30 px-4 py-2 font-semibold transition hover:bg-rose-500/10"
                        >
                            Try again
                        </button>
                    </div>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <BookOpen className="h-6 w-6 text-indigo-500" />
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Your classes</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{isLoading ? '…' : classes.length}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <Users className="h-6 w-6 text-emerald-500" />
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Students in your classes</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{isLoading ? '…' : students.length}</p>
                    </div>
                </div>
            </div>

            <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                    <GraduationCap className="h-5 w-5 text-indigo-500" /> Assigned classes
                </h2>
                {isLoading ? (
                    <p role="status" className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        Loading your assigned classes…
                    </p>
                ) : loadError ? null : classes.length ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {classes.map((academyClass) => (
                            <article key={academyClass.id} className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                                <h3 className="font-bold text-slate-900 dark:text-white">{academyClass.name}</h3>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    {[academyClass.day, academyClass.startTime, academyClass.endTime].filter(Boolean).join(' · ')}
                                </p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {academyClass.classroom || 'Room not specified'}
                                </p>
                                <button
                                    type="button"
                                    aria-expanded={expandedClassId === academyClass.id}
                                    onClick={() => setExpandedClassId((currentId) => currentId === academyClass.id ? null : academyClass.id)}
                                    className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
                                >
                                    {expandedClassId === academyClass.id ? 'Hide class details' : 'View class details'}
                                </button>
                                {expandedClassId === academyClass.id && (
                                    <dl className="mt-4 grid gap-3 border-t border-slate-100 pt-4 text-sm dark:border-slate-800 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</dt>
                                            <dd className="mt-1 text-slate-800 dark:text-slate-200">{academyClass.status || '—'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Capacity</dt>
                                            <dd className="mt-1 text-slate-800 dark:text-slate-200">{academyClass.capacity ?? '—'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Monthly fee</dt>
                                            <dd className="mt-1 text-slate-800 dark:text-slate-200">{formatLKR(academyClass.monthlyFee)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Schedule</dt>
                                            <dd className="mt-1 text-slate-800 dark:text-slate-200">
                                                {[academyClass.day, academyClass.startTime, academyClass.endTime].filter(Boolean).join(' · ') || '—'}
                                            </dd>
                                        </div>
                                    </dl>
                                )}
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        No classes have been assigned to your account yet.
                    </p>
                )}
            </section>

            <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                    <Users className="h-5 w-5 text-emerald-500" /> Your students
                </h2>
                <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800">
                            <tr>
                                <th className="px-5 py-4">Student</th>
                                <th className="px-5 py-4">Grade</th>
                                <th className="px-5 py-4">Class</th>
                                <th className="px-5 py-4">Payment status</th>
                                <th className="px-5 py-4">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">
                                        Loading your students…
                                    </td>
                                </tr>
                            ) : loadError ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">
                                        Student details are unavailable until the workspace can be loaded.
                                    </td>
                                </tr>
                            ) : students.map((student) => (
                                <React.Fragment key={student.id}>
                                    <tr>
                                        <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{student.name}</td>
                                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{student.grade || '—'}</td>
                                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                                            {classes.find((academyClass) => academyClass.id === student.classId)?.name || '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                student.paymentStatus === 'Overdue'
                                                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                                                    : student.paymentStatus === 'Pending'
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                                        : student.paymentStatus === 'Partially Paid'
                                                            ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                                                            : student.paymentStatus === 'Paid'
                                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                            }`}>
                                                {student.paymentStatus || 'No payment record'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                aria-expanded={expandedStudentId === student.id}
                                                onClick={() => setExpandedStudentId((currentId) => currentId === student.id ? null : student.id)}
                                                className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
                                            >
                                                {expandedStudentId === student.id ? 'Hide details' : 'View details'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedStudentId === student.id && (
                                        <tr>
                                            <td colSpan={5} className="bg-slate-50/70 px-5 py-5 dark:bg-slate-950/30">
                                                <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                                                    <div>
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Payment status</dt>
                                                        <dd className="mt-1 text-slate-800 dark:text-slate-200">{student.paymentStatus || 'No payment record'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Student ID</dt>
                                                        <dd className="mt-1 text-slate-800 dark:text-slate-200">{student.id || '—'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Name with initials</dt>
                                                        <dd className="mt-1 text-slate-800 dark:text-slate-200">{student.nameInitials || '—'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Date of birth</dt>
                                                        <dd className="mt-1 text-slate-800 dark:text-slate-200">{student.dob || '—'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Gender</dt>
                                                        <dd className="mt-1 text-slate-800 dark:text-slate-200">{student.gender || '—'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">School</dt>
                                                        <dd className="mt-1 text-slate-800 dark:text-slate-200">{student.school || '—'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</dt>
                                                        <dd className="mt-1 text-slate-800 dark:text-slate-200">{student.status || '—'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</dt>
                                                        <dd className="mt-1 text-slate-800 dark:text-slate-200">{student.phone || '—'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</dt>
                                                        <dd className="mt-1 break-all text-slate-800 dark:text-slate-200">{student.email || '—'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Enrolled</dt>
                                                        <dd className="mt-1 text-slate-800 dark:text-slate-200">{student.joinedDate || '—'}</dd>
                                                    </div>
                                                    <div className="sm:col-span-2 lg:col-span-3">
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Address</dt>
                                                        <dd className="mt-1 text-slate-800 dark:text-slate-200">{student.address || '—'}</dd>
                                                    </div>
                                                    {student.notes && (
                                                        <div className="sm:col-span-2 lg:col-span-3">
                                                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</dt>
                                                            <dd className="mt-1 whitespace-pre-wrap text-slate-800 dark:text-slate-200">{student.notes}</dd>
                                                        </div>
                                                    )}
                                                </dl>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {!isLoading && !loadError && !students.length && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">
                                        No students are assigned to your classes yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};
