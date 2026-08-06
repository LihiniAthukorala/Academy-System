import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAcademy } from '../context/AcademyContext';
import { ArrowLeft, Phone, Mail, MapPin, GraduationCap, Users, ClipboardList } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export const TeacherProfile = () => {
    const { id } = useParams();
    const { teachers, classes } = useAcademy();

    const teacher = teachers.find((t) => t.id === id);

    if (!teacher) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Teacher Not Found</h2>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    The requested teacher record does not exist or may have been removed.
                </p>
                <Link
                    to="/teachers"
                    className="inline-flex items-center gap-2 mt-6 rounded-full border border-indigo-600 bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Teachers
                </Link>
            </div>
        );
    }

    const assignedClasses = classes.filter((c) => c.teacherId === teacher.id);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">{teacher.name}</h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Instructor profile and class assignment details for the Ratnapura Chess Academy faculty.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={teacher.status} />
                    <Link
                        to="/teachers"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Directory
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_0.75fr]">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-slate-900 text-white shadow-lg">
                                {teacher.profileImage ? (
                                    <img src={teacher.profileImage} alt={teacher.name} className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-black text-[#F6D778]">{teacher.name?.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Instructor</p>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{teacher.name}</h2>
                            </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                            Teacher ID: {teacher.id}
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Contact</p>
                            <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{teacher.phone || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span>{teacher.email || 'Not provided'}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-0.5" />
                                    <span>{teacher.address || 'No address logged'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Qualifications</p>
                            <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
                                <p>{teacher.qualifications || 'No qualifications listed'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-slate-400">
                            <GraduationCap className="w-4 h-4" />
                            Assigned Classes
                        </div>
                        {assignedClasses.length === 0 ? (
                            <p className="mt-4 text-sm text-slate-500">No classes are currently assigned to this instructor.</p>
                        ) : (
                            <div className="mt-4 grid gap-3">
                                {assignedClasses.map((cls) => {
                                    const scheduleText = cls.schedule
                                        ? cls.schedule
                                        : `${cls.day || 'Schedule'} ${cls.startTime || ''}${cls.endTime ? ` - ${cls.endTime}` : ''}`.trim();
                                    const classroomText = cls.classroom ? ` • ${cls.classroom}` : '';

                                    return (
                                        <div key={cls.id} className="rounded-2xl border border-slate-300 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-950">
                                            <div className="font-semibold text-slate-900 dark:text-slate-100">{cls.name}</div>
                                            <div className="text-slate-500 dark:text-slate-400">
                                                {scheduleText}{classroomText}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                <aside className="space-y-4">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-indigo-600" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Teacher Overview</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Current faculty profile</p>
                            </div>
                        </div>
                        <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">Total Assigned Classes</span>
                                <span>{assignedClasses.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">Status</span>
                                <StatusBadge status={teacher.status} small />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <div className="flex items-center gap-3">
                            <ClipboardList className="w-5 h-5 text-emerald-500" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Notes</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Instructor Summary</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-300">
                            {teacher.bio || 'No additional biography has been provided for this instructor.'}
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default TeacherProfile;
