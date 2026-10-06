import React from 'react';
import { BookOpen, GraduationCap, Users } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const TeacherDashboard = () => {
    const { classes, students, currentUser } = useAcademy();

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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <BookOpen className="h-6 w-6 text-indigo-500" />
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Your classes</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{classes.length}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <Users className="h-6 w-6 text-emerald-500" />
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Students in your classes</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{students.length}</p>
                    </div>
                </div>
            </div>

            <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                    <GraduationCap className="h-5 w-5 text-indigo-500" /> Assigned classes
                </h2>
                {classes.length ? (
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{student.name}</td>
                                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{student.grade || '—'}</td>
                                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                                        {classes.find((academyClass) => academyClass.id === student.classId)?.name || '—'}
                                    </td>
                                </tr>
                            ))}
                            {!students.length && (
                                <tr>
                                    <td colSpan={3} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">
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
