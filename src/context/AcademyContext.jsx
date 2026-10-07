import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, generateId } from '../utils/storage';
import {
    apiHealth,
    fetchPublicCoaches,
    fetchCollection,
    fetchTeacherWorkspace,
    inviteTeacherRequest,
    loginRequest,
    replaceCollection
} from '../utils/api';
import {
    SAMPLE_STUDENTS,
    SAMPLE_TEACHERS,
    SAMPLE_CLASSES,
    SAMPLE_PAYMENTS,
    SAMPLE_ATTENDANCE,
    SAMPLE_NOTIFICATIONS,
    DEFAULT_SETTINGS
} from '../utils/sampleData';

const AcademyContext = createContext();

export const AcademyProvider = ({ children }) => {
    // Theme state
    const [theme, setTheme] = useState(() => getStorageItem('academy_theme', 'light'));

    // Auth state
    const [currentUser, setCurrentUser] = useState(() =>
        localStorage.getItem('academy_token') ? getStorageItem('academy_user', null) : null
    );

    // Entities state loaded from LocalStorage or Fallback Mock Data
    const [students, setStudents] = useState(() => currentUser?.role === 'Administrator' ? getStorageItem('academy_students', SAMPLE_STUDENTS) : []);
    const [teachers, setTeachers] = useState(() => currentUser?.role === 'Administrator' ? getStorageItem('academy_teachers', SAMPLE_TEACHERS) : []);
    const [classes, setClasses] = useState(() => currentUser?.role === 'Administrator' ? getStorageItem('academy_classes', SAMPLE_CLASSES) : []);
    const [payments, setPayments] = useState(() => currentUser?.role === 'Administrator' ? getStorageItem('academy_payments', SAMPLE_PAYMENTS) : []);
    const [attendance, setAttendance] = useState(() => currentUser?.role === 'Administrator' ? getStorageItem('academy_attendance', SAMPLE_ATTENDANCE) : []);
    const [notifications, setNotifications] = useState(() => currentUser?.role === 'Administrator' ? getStorageItem('academy_notifications', SAMPLE_NOTIFICATIONS) : []);
    const [settings, setSettings] = useState(() => currentUser?.role === 'Administrator' ? getStorageItem('academy_settings', DEFAULT_SETTINGS) : DEFAULT_SETTINGS);
    const [isBackendReady, setIsBackendReady] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Toasts notifications queue
    const [toasts, setToasts] = useState([]);

    // Apply theme class to HTML node
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        setStorageItem('academy_theme', theme);
    }, [theme]);

    // Sync state data to LocalStorage on updates
    useEffect(() => {
        if (currentUser?.role !== 'Administrator') return;
        setStorageItem('academy_students', students);
    }, [students, currentUser]);

    useEffect(() => {
        if (currentUser?.role !== 'Administrator') return;
        setStorageItem('academy_teachers', teachers);
    }, [teachers, currentUser]);

    useEffect(() => {
        if (currentUser?.role !== 'Administrator') return;
        setStorageItem('academy_classes', classes);
    }, [classes, currentUser]);

    useEffect(() => {
        if (currentUser?.role !== 'Administrator') return;
        setStorageItem('academy_payments', payments);
    }, [payments, currentUser]);

    useEffect(() => {
        if (currentUser?.role !== 'Administrator') return;
        setStorageItem('academy_attendance', attendance);
    }, [attendance, currentUser]);

    useEffect(() => {
        if (currentUser?.role !== 'Administrator') return;
        setStorageItem('academy_notifications', notifications);
    }, [notifications, currentUser]);

    useEffect(() => {
        if (currentUser?.role !== 'Administrator') return;
        setStorageItem('academy_settings', settings);
    }, [settings, currentUser]);

    useEffect(() => {
        const cleanupFlag = 'academy_seed_cleanup_v2';
        const alreadyCleaned = window.localStorage.getItem(cleanupFlag) === 'true';

        if (!alreadyCleaned) {
            window.localStorage.removeItem('academy_students');
            window.localStorage.removeItem('academy_teachers');
            window.localStorage.removeItem('academy_classes');
            window.localStorage.removeItem('academy_payments');
            window.localStorage.removeItem('academy_attendance');
            window.localStorage.setItem(cleanupFlag, 'true');
        }
    }, []);

    useEffect(() => {
        if (!localStorage.getItem('academy_token')) {
            setCurrentUser(null);
            localStorage.removeItem('academy_user');
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        if (!currentUser) {
            fetchPublicCoaches()
                .then((coaches) => {
                    if (!cancelled) setTeachers(coaches);
                })
                .catch((error) => {
                    if (!cancelled) console.error('Could not load public coach profiles:', error);
                })
                .finally(() => {
                    if (!cancelled) setIsHydrated(true);
                });
            return () => {
                cancelled = true;
            };
        }

        if (!localStorage.getItem('academy_token')) {
            setCurrentUser(null);
            setIsHydrated(true);
            return () => {
                cancelled = true;
            };
        }

        const hydrateFromBackend = async () => {
            try {
                if (currentUser.role === 'Teacher') {
                    const workspace = await fetchTeacherWorkspace();
                    if (cancelled) return;
                    setStudents(workspace.students);
                    setClasses(workspace.classes);
                    setTeachers([workspace.teacher]);
                    setAttendance([]);
                    setPayments([]);
                    setNotifications([]);
                    return;
                }

                const health = await apiHealth();
                if (health.storage !== 'mongodb') {
                    showToast(
                        'MongoDB is not configured',
                        'The API is saving to local JSON files. Set MONGODB_URI in .env to use MongoDB Atlas.',
                        'error'
                    );
                }

                const [remoteStudents, remoteTeachers, remoteClasses, remoteAttendance, remotePayments] = await Promise.all([
                    fetchCollection('students'),
                    fetchCollection('teachers'),
                    fetchCollection('classes'),
                    fetchCollection('attendance'),
                    fetchCollection('payments')
                ]);

                if (cancelled) return;

                if (Array.isArray(remoteStudents)) {
                    setStudents(remoteStudents);
                }

                if (Array.isArray(remoteTeachers)) {
                    setTeachers(remoteTeachers.map((t) => ({
                        ...t,
                        classes: Array.isArray(t.classes) ? t.classes : []
                    })));
                }

                if (Array.isArray(remoteClasses)) {
                    setClasses(remoteClasses);
                }

                if (Array.isArray(remoteAttendance)) {
                    setAttendance(remoteAttendance);
                }

                if (Array.isArray(remotePayments)) {
                    setPayments(remotePayments);
                }

                setIsBackendReady(true);
            } catch (error) {
                if (!cancelled) {
                    setIsBackendReady(false);
                    console.error('Could not load academy data from the API:', error);
                    if (error.statusCode === 401 || error.statusCode === 403) {
                        localStorage.removeItem('academy_token');
                        localStorage.removeItem('academy_user');
                        for (const key of [
                            'academy_students',
                            'academy_teachers',
                            'academy_classes',
                            'academy_payments',
                            'academy_attendance',
                            'academy_notifications',
                            'academy_settings'
                        ]) {
                            localStorage.removeItem(key);
                        }
                        setCurrentUser(null);
                        setStudents([]);
                        setTeachers([]);
                        setClasses([]);
                        setPayments([]);
                        setAttendance([]);
                        setNotifications([]);
                        setSettings(DEFAULT_SETTINGS);
                    }
                    const message = /bad auth|authentication failed/i.test(error.message)
                        ? 'MongoDB rejected the configured credentials. Update the Atlas username/password in .env, then restart the API.'
                        : 'Changes are only being kept in this browser until the API connection is restored.';
                    showToast(
                        'Data API unavailable',
                        message,
                        'error'
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsHydrated(true);
                }
            }
        };

        hydrateFromBackend();

        return () => {
            cancelled = true;
        };
    }, [currentUser]);

    useEffect(() => {
        if (!isHydrated || !isBackendReady || currentUser?.role !== 'Administrator') return;
        replaceCollection('students', students).catch((error) => {
            console.error('Could not save students:', error);
            showToast('Save failed', 'Student data could not be saved to the configured database.', 'error');
        });
    }, [students, isBackendReady, isHydrated, currentUser]);

    useEffect(() => {
        if (!isHydrated || !isBackendReady || currentUser?.role !== 'Administrator') return;
        replaceCollection('teachers', teachers).catch((error) => {
            console.error('Could not save teachers:', error);
            showToast('Save failed', 'Teacher data could not be saved to the configured database.', 'error');
        });
    }, [teachers, isBackendReady, isHydrated, currentUser]);

    useEffect(() => {
        if (!isHydrated || !isBackendReady || currentUser?.role !== 'Administrator') return;
        replaceCollection('classes', classes).catch((error) => {
            console.error('Could not save classes:', error);
            showToast('Save failed', 'Class data could not be saved to the configured database.', 'error');
        });
    }, [classes, isBackendReady, isHydrated, currentUser]);

    useEffect(() => {
        if (!isHydrated || !isBackendReady || currentUser?.role !== 'Administrator') return;
        replaceCollection('attendance', attendance).catch((error) => {
            console.error('Could not save attendance:', error);
            showToast('Save failed', 'Attendance data could not be saved to the configured database.', 'error');
        });
    }, [attendance, isBackendReady, isHydrated, currentUser]);

    useEffect(() => {
        if (!isHydrated || !isBackendReady || currentUser?.role !== 'Administrator') return;
        replaceCollection('payments', payments).catch((error) => {
            console.error('Could not save payments:', error);
            showToast('Save failed', 'Payment data could not be saved to the configured database.', 'error');
        });
    }, [payments, isBackendReady, isHydrated, currentUser]);

    // --- Auth Utilities ---
    const login = async (username, password, role) => {
        const { user, token } = await loginRequest(username, password, role);
        localStorage.setItem('academy_token', token);
        if (user.role === 'Teacher') {
            for (const key of [
                'academy_students',
                'academy_teachers',
                'academy_classes',
                'academy_payments',
                'academy_attendance',
                'academy_notifications',
                'academy_settings'
            ]) {
                localStorage.removeItem(key);
            }
            setStudents([]);
            setTeachers([]);
            setClasses([]);
            setPayments([]);
            setAttendance([]);
            setNotifications([]);
            setSettings(DEFAULT_SETTINGS);
            setIsBackendReady(false);
        }
        setCurrentUser(user);
        setStorageItem('academy_user', user);
        showToast('Success', `Successfully logged in as ${user.role}`, 'success');
        return true;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('academy_token');
        localStorage.removeItem('academy_user');
        for (const key of [
            'academy_students',
            'academy_teachers',
            'academy_classes',
            'academy_payments',
            'academy_attendance',
            'academy_notifications',
            'academy_settings'
        ]) {
            localStorage.removeItem(key);
        }
        setStudents([]);
        setTeachers([]);
        setClasses([]);
        setPayments([]);
        setAttendance([]);
        setNotifications([]);
        setSettings(DEFAULT_SETTINGS);
        setIsBackendReady(false);
        showToast('Info', 'Successfully logged out', 'info');
    };

    // --- Toast Utilities ---
    const showToast = (title, message, type = 'info') => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, title, message, type }]);

        // Auto-remove toast after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    // --- Notification Utilities ---
    const addNotification = (title, message, type = 'info', severity = 'info') => {
        const newNotif = {
            id: generateId('NOT'),
            title,
            message,
            type,
            date: new Date().toISOString(),
            read: false,
            severity
        };
        setNotifications((prev) => [newNotif, ...prev]);
    };

    const markNotificationAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        showToast('Success', 'Cleared all notifications', 'success');
    };

    // --- Student CRUD ---
    const addStudent = (studentData) => {
        // Auto-generate fresh unique Student ID
        let newId = generateId('STD');
        while (students.some((s) => s.id === newId)) {
            newId = generateId('STD');
        }

        const newStudent = {
            ...studentData,
            id: newId,
            nameInitials: studentData.nameInitials || studentData.name,
            joinedDate: studentData.joinedDate || new Date().toISOString().split('T')[0],
            status: studentData.status || 'Active',
            profileImage: studentData.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(studentData.name)}`
        };

        setStudents((prev) => [newStudent, ...prev]);
        showToast('Student Added', `${studentData.name} has been enrolled.`, 'success');
        addNotification('New Student Enrolled', `${studentData.name} joined. Assigned to ${studentData.grade}.`, 'registration', 'info');
        return newStudent;
    };

    const updateStudent = (id, updatedData) => {
        setStudents((prev) =>
            prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
        );
        showToast('Student Updated', 'Student profile details updated successfully.', 'success');
    };

    const deleteStudent = (id) => {
        const student = students.find((s) => s.id === id);
        setStudents((prev) => prev.filter((s) => s.id !== id));
        // Also remove related payment logs or mark as inactives, for now let's just clear
        showToast('Student Removed', `${student ? student.name : 'Student'} has been deleted.`, 'success');
    };

    // --- Teacher CRUD ---
    const addTeacher = (teacherData) => {
        let newId = generateId('TCH');
        while (teachers.some((t) => t.id === newId)) {
            newId = generateId('TCH');
        }

        const { subject: _ignoredSubject, ...teacherPayload } = teacherData;

        const newTeacher = {
            ...teacherPayload,
            phone: (teacherPayload.phone || '').replace(/[\s()-]/g, ''),
            id: newId,
            joinedDate: teacherPayload.joinedDate || new Date().toISOString().split('T')[0],
            status: teacherPayload.status || 'Active',
            profileImage: teacherPayload.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(teacherPayload.name)}`,
            classes: []
        };

        setTeachers((prev) => [newTeacher, ...prev]);
        showToast('Teacher Added', `${teacherPayload.name} has been registered.`, 'success');
        return newTeacher;
    };

    const updateTeacher = (id, updatedData) => {
        const { subject: _ignoredSubject, ...teacherPayload } = updatedData;
        setTeachers((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...teacherPayload } : t))
        );
        showToast('Teacher Updated', 'Teacher details updated.', 'success');
    };

    const deleteTeacher = (id) => {
        const teacher = teachers.find((t) => t.id === id);
        setTeachers((prev) => prev.filter((t) => t.id !== id));
        showToast('Teacher Removed', `${teacher ? teacher.name : 'Teacher'} deleted.`, 'success');
    };

    // --- Class CRUD ---
    const addClass = (classData) => {
        // Generate class ID
        let newId = generateId('CLS');
        while (classes.some((c) => c.id === newId)) {
            newId = generateId('CLS');
        }

        // Resolve teacher name
        const teacher = teachers.find((t) => t.id === classData.teacherId);
        const teacherName = teacher ? teacher.name : 'Unassigned';

        const newClass = {
            ...classData,
            id: newId,
            teacherName,
            status: classData.status || 'Active'
        };

        setClasses((prev) => [...prev, newClass]);

        // Update teacher assigned classes
        if (classData.teacherId) {
            setTeachers((prev) =>
                prev.map((t) =>
                    t.id === classData.teacherId
                        ? {
                            ...t,
                            classes: [...new Set([...(Array.isArray(t.classes) ? t.classes : []), newId])]
                        }
                        : t
                )
            );
        }

        showToast('Class Created', `${classData.name} created successfully.`, 'success');
        return newClass;
    };

    const updateClass = (id, updatedData) => {
        const teacher = teachers.find((t) => t.id === updatedData.teacherId);
        const teacherName = teacher ? teacher.name : 'Unassigned';

        setClasses((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...updatedData, teacherName } : c))
        );
        showToast('Class Updated', 'Class details updated successfully.', 'success');
    };

    const deleteClass = (id) => {
        setClasses((prev) => prev.filter((c) => c.id !== id));
        // Remove class reference from teachers
        setTeachers((prev) =>
            prev.map((t) => ({
                ...t,
                classes: Array.isArray(t.classes) ? t.classes.filter((cId) => cId !== id) : []
            }))
        );
        showToast('Class Deleted', 'Class removed.', 'success');
    };

    // --- Fee Payment CRUD ---
    const addPayment = (paymentData) => {
        let newId = generateId('REC');
        while (payments.some((p) => p.id === newId)) {
            newId = generateId('REC');
        }

        const student = students.find((s) => s.id === paymentData.studentId);
        const studentName = student ? student.name : 'Unknown Student';

        const totalAmount =
            Number(paymentData.monthlyFee || 0) +
            Number(paymentData.registrationFee || 0) +
            Number(paymentData.additionalCharges || 0) -
            Number(paymentData.discount || 0);

        const balance = totalAmount - Number(paymentData.paidAmount || 0);

        // Automatically match statuses
        let status = 'Pending';
        if (balance <= 0) status = 'Paid';
        else if (paymentData.paidAmount > 0) status = 'Partially Paid';
        else if (paymentData.status) status = paymentData.status;

        const newPayment = {
            ...paymentData,
            id: newId,
            studentName,
            totalAmount,
            balance,
            status,
            paymentDate: paymentData.paidAmount > 0 ? (paymentData.paymentDate || new Date().toISOString().split('T')[0]) : ''
        };

        setPayments((prev) => [newPayment, ...prev]);
        showToast('Payment Added', `Receipt ${newId} created.`, 'success');

        // Add alert notification if balance remains unpaid
        if (status === 'Overdue') {
            addNotification('Overdue Payment Alert', `${studentName} outstanding balance of LKR ${balance} is registry overdue.`, 'fee', 'error');
        }

        return newPayment;
    };

    const updatePayment = (id, updatedData) => {
        setPayments((prev) =>
            prev.map((p) => {
                if (p.id !== id) return p;

                const monthlyFee = Number(updatedData.monthlyFee !== undefined ? updatedData.monthlyFee : p.monthlyFee);
                const registrationFee = Number(updatedData.registrationFee !== undefined ? updatedData.registrationFee : p.registrationFee);
                const additionalCharges = Number(updatedData.additionalCharges !== undefined ? updatedData.additionalCharges : p.additionalCharges);
                const discount = Number(updatedData.discount !== undefined ? updatedData.discount : p.discount);
                const paidAmount = Number(updatedData.paidAmount !== undefined ? updatedData.paidAmount : p.paidAmount);

                const totalAmount = monthlyFee + registrationFee + additionalCharges - discount;
                const balance = totalAmount - paidAmount;

                let status = updatedData.status || p.status;
                if (balance <= 0) status = 'Paid';
                else if (paidAmount > 0) status = 'Partially Paid';

                return {
                    ...p,
                    ...updatedData,
                    totalAmount,
                    balance,
                    status
                };
            })
        );
        showToast('Record Updated', 'Fee payment details updated.', 'success');
    };

    const deletePayment = (id) => {
        setPayments((prev) => prev.filter((p) => p.id !== id));
        showToast('Receipt Deleted', `Receipt record ${id} removed.`, 'success');
    };

    // --- Attendance Record Management ---
    const saveAttendance = (classId, date, recordsInput) => {
        if (!classId || !date) {
            showToast('Error', 'Class and Date must be selected.', 'error');
            return false;
        }

        // Get the class name for this attendance log
        const cls = classes.find((c) => c.id === classId);
        const className = cls ? cls.name : 'Unknown Class';

        setAttendance((prev) => {
            // Check if entry already exists for class + date
            const exists = prev.some((log) => log.classId === classId && log.date === date);

            if (exists) {
                return prev.map((log) =>
                    log.classId === classId && log.date === date ? { ...log, records: recordsInput } : log
                );
            } else {
                // Generate unique ID for this attendance log
                let newId = generateId('ATT');
                while (prev.some((log) => log.id === newId)) {
                    newId = generateId('ATT');
                }
                return [{ id: newId, classId, className, date, records: recordsInput }, ...prev];
            }
        });

        // Auto calculate if low attendance notification is needed
        // Loop through this batch to inspect if student has low attendance
        const presents = recordsInput.filter((r) => r.status === 'Present').length;
        const total = recordsInput.length;
        const attendancePercentage = total > 0 ? Math.round((presents / total) * 100) : 100;

        if (attendancePercentage < 75 && total > 0) {
            const cls = classes.find((c) => c.id === classId);
            addNotification(
                'Low Class Attendance Alert',
                `Class "${cls ? cls.name : classId}" experienced low attendance (${attendancePercentage}% present) on ${date}.`,
                'attendance',
                'warning'
            );
        }

        showToast('Success', 'Attendance saved successfully.', 'success');
        return true;
    };

    const deleteAttendanceLog = (logId) => {
        setAttendance((prev) => prev.filter((log) => log.id !== logId));
        showToast('Record Deleted', `Attendance log ${logId} removed.`, 'success');
    };

    // Helper values
    const getAttendanceSummaryByStudent = (studentId) => {
        let totalClasses = 0;
        let presentCount = 0;
        let absentCount = 0;
        let lateCount = 0;
        let excusedCount = 0;

        const history = [];

        // Filter all logs that cover this student
        attendance.forEach((log) => {
            const record = log.records.find((r) => r.studentId === studentId);
            if (record) {
                totalClasses++;
                const clsName = classes.find((c) => c.id === log.classId)?.name || 'Unknown Class';

                if (record.status === 'Present') presentCount++;
                else if (record.status === 'Absent') absentCount++;
                else if (record.status === 'Late') lateCount++;
                else if (record.status === 'Excused') excusedCount++;

                history.push({
                    date: log.date,
                    classId: log.classId,
                    className: clsName,
                    status: record.status,
                    notes: record.notes || ''
                });
            }
        });

        const percentage = totalClasses > 0
            ? Math.round(((presentCount + lateCount) / totalClasses) * 100)
            : 100;

        return {
            percentage,
            presentCount,
            absentCount,
            lateCount,
            excusedCount,
            totalClasses,
            history: history.sort((a, b) => new Date(b.date) - new Date(a.date))
        };
    };

    const getStudentOverviewStats = (studentId) => {
        // Payment summary
        const studentPayments = payments.filter((p) => p.studentId === studentId);
        const totalPaid = studentPayments.reduce((sum, p) => sum + Number(p.paidAmount || 0), 0);
        const totalOutstanding = studentPayments.reduce((sum, p) => sum + Number(p.balance || 0), 0);
        const pendingInvoices = studentPayments.filter((p) => p.status === 'Pending' || p.status === 'Overdue');
        const paymentStatus = pendingInvoices.length > 0 ? 'Pending' : 'No Outstanding';

        // Attendance summary
        const attState = getAttendanceSummaryByStudent(studentId);

        return {
            totalPaid,
            totalOutstanding,
            paymentStatus,
            attendancePercentage: attState.percentage,
            attendanceLogsCount: attState.totalClasses
        };
    };

    return (
        <AcademyContext.Provider
            value={{
                theme,
                setTheme,
                toggleTheme: () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),

                currentUser,
                isHydrated,
                login,
                inviteTeacher: inviteTeacherRequest,
                logout,

                toasts,
                showToast,
                removeToast,
                triggerToast: (message, type = 'info') => showToast('Notification', message, type),

                students,
                addStudent,
                updateStudent,
                deleteStudent,

                teachers,
                addTeacher,
                updateTeacher,
                deleteTeacher,

                classes,
                addClass,
                updateClass,
                deleteClass,

                payments,
                addPayment,
                updatePayment,
                deletePayment,

                attendance,
                saveAttendance,
                deleteAttendanceLog,
                getAttendanceSummaryByStudent,
                getStudentOverviewStats,

                notifications,
                addNotification,
                markNotificationAsRead,
                clearAllNotifications,

                settings,
                updateSettings: (newSettings) => {
                    setSettings((prev) => ({ ...prev, ...newSettings }));
                    showToast('Settings Saved', 'System configurations updated successfully.', 'success');
                },

                backendReady: isBackendReady
            }}
        >
            {children}
        </AcademyContext.Provider>
    );
};

export const useAcademy = () => {
    const context = useContext(AcademyContext);
    if (!context) {
        throw new Error('useAcademy must be used within an AcademyProvider');
    }
    return context;
};
