import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { getDb } from './_lib/mongodb.js';
import {
    createSessionToken,
    getAdminCredentials,
    getSession,
    hashPassword,
    verifyPassword
} from './_lib/auth.js';

const developmentOtpSecret = 'academy-local-development-auth-secret-change-before-production';

const normalizeEmail = (email) => {
    if (typeof email !== 'string') return null;
    const normalized = email.trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? normalized : null;
};

const normalizeUsername = (username) =>
    typeof username === 'string' ? username.trim().toLowerCase() : '';

const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);

const getOtpSecret = () => {
    const secret = process.env.AUTH_SECRET || (process.env.NODE_ENV !== 'production' ? developmentOtpSecret : '');
    if (!secret || secret.length < 32 || secret.startsWith('replace-with-')) {
        const error = new Error('AUTH_SECRET must be configured with at least 32 characters.');
        error.statusCode = 503;
        throw error;
    }
    return secret;
};

const digest = (value) =>
    createHmac('sha256', getOtpSecret()).update(value).digest('hex');

const equalSecrets = (left, right) => {
    const leftBytes = Buffer.from(left);
    const rightBytes = Buffer.from(right);
    return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
};

const findTeacherByEmail = async (db, email) => {
    const teachers = await db.collection('teachers').find({}).toArray();
    return teachers.find((teacher) => normalizeEmail(teacher.email) === email) || null;
};

const sendOtpEmail = async (email, otp, teacherName) => {
    const { RESEND_API_KEY, EMAIL_FROM } = process.env;
    if (!RESEND_API_KEY && !EMAIL_FROM && process.env.NODE_ENV !== 'production') {
        console.info(`[teacher-activation] Development OTP for ${teacherName} <${email}>: ${otp}`);
        return 'development';
    }
    if (!RESEND_API_KEY || !EMAIL_FROM) {
        const error = new Error('Email delivery is not configured. Set RESEND_API_KEY and EMAIL_FROM on the server.');
        error.statusCode = 503;
        throw error;
    }

    let response;
    try {
        response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: EMAIL_FROM,
                to: [email],
                subject: 'Ratnapura Chess Academy teacher verification code',
                text: `Hello ${teacherName}, your teacher account verification code is ${otp}. It expires in 10 minutes.`,
                html: `<p>Hello ${escapeHtml(teacherName)},</p><p>Your teacher account verification code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`
            }),
            signal: AbortSignal.timeout(10_000)
        });
    } catch (cause) {
        const error = new Error('Email service could not be reached to deliver the activation code.');
        error.statusCode = 502;
        error.cause = cause;
        throw error;
    }

    if (!response.ok) {
        const details = await response.text();
        console.error(`Teacher OTP email delivery failed (${response.status}): ${details}`);
        const error = new Error('Email service could not deliver the activation code. Check the Resend credentials and sender address.');
        error.statusCode = 502;
        throw error;
    }
    return 'email';
};

const login = async (req, res, body) => {
    if (typeof body.username !== 'string' || typeof body.password !== 'string' || body.password.length > 128 ||
        !['Administrator', 'Teacher', 'Student'].includes(body.role)) {
        return res.status(400).json({ message: 'Enter your username and password.' });
    }

    if (body.role === 'Student') {
        const username = normalizeUsername(body.username);
        const db = await getDb();
        const account = await db.collection('users').findOne({ username, role: 'Student' });
        if (!account || account.status !== 'active' || !verifyPassword(body.password, account.passwordHash)) {
            return res.status(401).json({ message: 'Username or password is incorrect, or the student account has not been set up.' });
        }

        const student = await db.collection('students').findOne({ id: account.studentId });
        if (!student || student.status !== 'Active') {
            return res.status(403).json({ message: 'This student account is unavailable. Contact the academy administrator.' });
        }

        const user = {
            id: student.id,
            username: account.username,
            name: student.name,
            role: 'Student'
        };
        return res.status(200).json({ user, token: createSessionToken(user) });
    }

    if (body.role === 'Teacher') {
        const username = normalizeUsername(body.username);
        const db = await getDb();
        const account = await db.collection('users').findOne({ username, role: 'Teacher' });
        if (!account || account.status !== 'active' || !verifyPassword(body.password, account.passwordHash)) {
            return res.status(401).json({ message: 'Username or password is incorrect, or the account has not been activated.' });
        }

        const teacher = await db.collection('teachers').findOne({ id: account.teacherId });
        if (!teacher || teacher.status === 'Inactive') {
            return res.status(403).json({ message: 'This teacher account is unavailable. Contact the academy administrator.' });
        }

        const user = {
            id: account.teacherId,
            teacherId: account.teacherId,
            name: teacher.name,
            email: account.email,
            username: account.username,
            avatarUrl: teacher.profileImage || '',
            role: 'Teacher'
        };
        return res.status(200).json({ user, token: createSessionToken(user) });
    }

    const { username, password } = getAdminCredentials();
    if (!equalSecrets(body.username, username) || !equalSecrets(body.password, password)) {
        return res.status(401).json({ message: 'Username or password is incorrect.' });
    }

    const user = {
        id: 'academy-admin',
        username,
        name: 'Principal Admin',
        email: '',
        role: 'Administrator'
    };
    return res.status(200).json({ user, token: createSessionToken(user) });
};

const sendTeacherOtp = async (req, res, body, adminInitiated = false) => {
    const session = getSession(req);
    if (adminInitiated && (!session || session.role !== 'Administrator')) {
        return res.status(401).json({ message: 'Administrator sign-in is required to invite staff.' });
    }

    const email = normalizeEmail(adminInitiated ? body.teacher?.email : body.email);
    if (!email) {
        return res.status(400).json({ message: 'Enter a valid email address.' });
    }

    const db = await getDb();
    const teacher = await findTeacherByEmail(db, email);
    if (!teacher || teacher.status === 'Inactive') {
        if (adminInitiated) {
            return res.status(400).json({ message: 'A registered, active teacher with this email address could not be found.' });
        }
        return res.status(200).json({
            message: 'If this email belongs to an active registered teacher, a verification code will be sent. Check the API terminal during local development.'
        });
    }

    const users = db.collection('users');
    const existingAccount = await users.findOne({ teacherId: teacher.id, role: 'Teacher' });
    if (existingAccount?.status === 'active') {
        if (adminInitiated) {
            return res.status(409).json({ message: 'This teacher account has already been activated.' });
        }
        return res.status(200).json({
            message: 'If this email belongs to an active registered teacher, a verification code will be sent. Check the API terminal during local development.'
        });
    }
    if (existingAccount?.sentAt && Date.now() - new Date(existingAccount.sentAt).getTime() < 60_000) {
        return res.status(429).json({ message: 'Please wait one minute before requesting another activation code.' });
    }

    const otp = String(randomInt(0, 1_000_000)).padStart(6, '0');
    const delivery = await sendOtpEmail(email, otp, teacher.name);
    const now = new Date();
    await users.updateOne(
        { teacherId: teacher.id, role: 'Teacher' },
        {
            $set: {
                email,
                username: null,
                teacherId: teacher.id,
                role: 'Teacher',
                status: 'pending',
                otpHash: digest(`${email}:${otp}`),
                otpExpiresAt: new Date(now.getTime() + 10 * 60_000),
                verificationTokenHash: null,
                verificationTokenExpiresAt: null,
                sentAt: now,
                attempts: 0
            }
        },
        { upsert: true }
    );

    const message = delivery === 'development'
        ? 'Verification code generated. Check the API terminal; the code is not sent to the browser.'
        : `Verification code sent to ${email}. It expires in 10 minutes.`;
    return res.status(200).json({ message });
};

const verifyTeacherOtp = async (req, res, body) => {
    const email = normalizeEmail(body.email);
    const otp = typeof body.otp === 'string' ? body.otp.trim() : '';
    if (!email || !/^\d{6}$/.test(otp)) {
        return res.status(400).json({ message: 'Enter a valid email address and six-digit verification code.' });
    }

    const db = await getDb();
    const users = db.collection('users');
    const account = await users.findOne({ email, role: 'Teacher' });
    if (!account || account.status !== 'pending') {
        return res.status(400).json({ message: 'No pending teacher activation was found for this email. Ask the administrator to register an active teacher with this address.' });
    }
    if (account.otpExpiresAt && new Date(account.otpExpiresAt).getTime() <= Date.now()) {
        return res.status(400).json({ message: 'This verification code has expired. Request a new one.' });
    }
    if ((account.attempts || 0) >= 5) {
        return res.status(429).json({ message: 'Too many incorrect attempts. Request a new code after one minute.' });
    }

    if (!equalSecrets(account.otpHash || '', digest(`${email}:${otp}`))) {
        await users.updateOne({ email, role: 'Teacher' }, { $set: { attempts: (account.attempts || 0) + 1 } });
        return res.status(400).json({ message: 'The verification code is incorrect.' });
    }

    const activationToken = randomBytes(32).toString('hex');
    await users.updateOne(
        { email, role: 'Teacher' },
        {
            $set: {
                otpHash: null,
                otpExpiresAt: null,
                verificationTokenHash: digest(activationToken),
                verificationTokenExpiresAt: new Date(Date.now() + 10 * 60_000),
                attempts: 0
            }
        }
    );
    return res.status(200).json({
        activationToken,
        message: 'Email verified. Create your username and password to finish setting up your account.'
    });
};

const completeTeacherActivation = async (req, res, body) => {
    const email = normalizeEmail(body.email);
    const activationToken = typeof body.activationToken === 'string' ? body.activationToken : '';
    const username = normalizeUsername(body.username);
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !/^[a-f0-9]{64}$/i.test(activationToken) ||
        !/^[a-z0-9._-]{3,32}$/.test(username) || password.length < 12 || password.length > 128) {
        return res.status(400).json({ message: 'Enter a valid username (3-32 letters, numbers, dots, underscores, or hyphens) and a password of at least 12 characters.' });
    }

    const db = await getDb();
    const users = db.collection('users');
    const account = await users.findOne({ email, role: 'Teacher' });
    if (!account || account.status !== 'pending' || !account.verificationTokenHash ||
        !account.verificationTokenExpiresAt ||
        new Date(account.verificationTokenExpiresAt).getTime() <= Date.now() ||
        !equalSecrets(account.verificationTokenHash, digest(activationToken))) {
        return res.status(400).json({ message: 'Email verification expired or is invalid. Request and verify a new code.' });
    }

    const accounts = await users.find({ role: 'Teacher' }).toArray();
    if (accounts.some((item) => normalizeUsername(item.username) === username)) {
        return res.status(409).json({ message: 'That username is already taken. Choose another one.' });
    }

    await users.updateOne(
        { email, role: 'Teacher' },
        {
            $set: {
                username,
                status: 'active',
                passwordHash: hashPassword(password),
                activatedAt: new Date(),
                verificationTokenHash: null,
                verificationTokenExpiresAt: null,
                otpHash: null,
                otpExpiresAt: null,
                attempts: 0
            }
        }
    );
    return res.status(200).json({ message: 'Teacher account created. You can now sign in with your username and password.' });
};

const teacherWorkspace = async (req, res) => {
    const session = getSession(req);
    if (!session || session.role !== 'Teacher' || !session.teacherId) {
        return res.status(401).json({ message: 'A valid teacher session is required.' });
    }

    const db = await getDb();
    const account = await db.collection('users').findOne({
        username: session.username,
        teacherId: session.teacherId,
        role: 'Teacher',
        status: 'active'
    });
    if (!account) {
        return res.status(403).json({ message: 'This teacher account is no longer active.' });
    }
    const classes = await db.collection('classes').find({ teacherId: session.teacherId }).toArray();
    const classIds = new Set(classes.map((item) => item.id));
    const assignedStudents = (await db.collection('students').find({}).toArray())
        .filter((student) => classIds.has(student.classId));
    const assignedStudentIds = new Set(assignedStudents.map((student) => student.id));
    const payments = (await db.collection('payments').find({}).toArray())
        .filter((payment) => assignedStudentIds.has(payment.studentId));
    const paymentsByStudentId = new Map();
    for (const payment of payments) {
        const studentPayments = paymentsByStudentId.get(payment.studentId) || [];
        studentPayments.push(payment);
        paymentsByStudentId.set(payment.studentId, studentPayments);
    }
    const students = assignedStudents.map((student) => {
        const studentPayments = paymentsByStudentId.get(student.id) || [];
        const paymentStatus = studentPayments.some((payment) => payment.status === 'Overdue')
            ? 'Overdue'
            : studentPayments.some((payment) => payment.status === 'Pending')
                ? 'Pending'
                : studentPayments.some((payment) => payment.status === 'Partially Paid')
                    ? 'Partially Paid'
                    : studentPayments.length
                        ? 'Paid'
                        : 'No payment record';
        return { ...student, paymentStatus };
    });

    return res.status(200).json({
        teacher: {
            id: session.teacherId,
            name: session.name,
            email: session.email,
            username: session.username,
            avatarUrl: session.avatarUrl
        },
        classes,
        students
    });
};

const studentAccount = async (req, res, body) => {
    const session = getSession(req);
    if (!session || session.role !== 'Administrator') {
        return res.status(401).json({ message: 'Administrator sign-in is required to manage student accounts.' });
    }
    if (typeof body.studentId !== 'string' || !body.studentId.trim()) {
        return res.status(400).json({ message: 'A student ID is required.' });
    }

    const db = await getDb();
    const student = await db.collection('students').findOne({ id: body.studentId });
    if (!student) {
        return res.status(404).json({ message: 'Student could not be found.' });
    }

    const users = db.collection('users');
    if (body.action === 'studentAccountStatus') {
        const account = await users.findOne({ studentId: student.id, role: 'Student' });
        return res.status(200).json({
            configured: account?.status === 'active',
            username: account?.status === 'active' ? account.username : ''
        });
    }

    if (student.status !== 'Active') {
        return res.status(400).json({ message: 'Only active students can have login accounts.' });
    }

    const username = normalizeUsername(body.username);
    const password = typeof body.password === 'string' ? body.password : '';
    if (!/^[a-z0-9._-]{3,32}$/.test(username) || password.length < 12 || password.length > 128) {
        return res.status(400).json({ message: 'Use a username of 3-32 letters, numbers, dots, underscores, or hyphens and a password of at least 12 characters.' });
    }

    const adminCredentials = getAdminCredentials();
    const existingAccounts = await users.find({}).toArray();
    if (username === normalizeUsername(adminCredentials.username) ||
        existingAccounts.some((account) =>
            normalizeUsername(account.username) === username && account.studentId !== student.id
        )) {
        return res.status(409).json({ message: 'That username is already in use. Choose another one.' });
    }

    await users.updateOne(
        { studentId: student.id, role: 'Student' },
        {
            $set: {
                studentId: student.id,
                username,
                role: 'Student',
                status: 'active',
                passwordHash: hashPassword(password),
                updatedAt: new Date()
            },
            $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
    );
    return res.status(200).json({
        configured: true,
        username,
        message: 'Student login credentials saved. Share the username and initial password securely with the student.'
    });
};

const studentWorkspace = async (req, res) => {
    const session = getSession(req);
    if (!session || session.role !== 'Student' || !session.id || !session.username) {
        return res.status(401).json({ message: 'A valid student session is required.' });
    }

    const db = await getDb();
    const account = await db.collection('users').findOne({
        studentId: session.id,
        username: session.username,
        role: 'Student',
        status: 'active'
    });
    const student = account
        ? await db.collection('students').findOne({ id: session.id, status: 'Active' })
        : null;
    if (!student) {
        return res.status(403).json({ message: 'This student account is no longer active.' });
    }

    const studentClass = student.classId
        ? await db.collection('classes').findOne({ id: student.classId })
        : null;
    const attendanceLogs = await db.collection('attendance').find({}).toArray();
    const attendance = attendanceLogs.flatMap((log) => {
        const record = Array.isArray(log.records)
            ? log.records.find((item) => item.studentId === student.id)
            : null;
        return record ? [{ date: log.date, className: log.className, status: record.status }] : [];
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
    const payments = await db.collection('payments').find({ studentId: student.id }).toArray();

    return res.status(200).json({
        student: {
            id: student.id,
            name: student.name,
            grade: student.grade,
            school: student.school,
            joinedDate: student.joinedDate
        },
        class: studentClass ? {
            name: studentClass.name,
            subject: studentClass.subject,
            day: studentClass.day,
            startTime: studentClass.startTime,
            endTime: studentClass.endTime,
            classroom: studentClass.classroom,
            teacherName: studentClass.teacherName,
            monthlyFee: studentClass.monthlyFee
        } : null,
        attendance,
        payments: payments.map((payment) => ({
            month: payment.month,
            year: payment.year,
            totalAmount: payment.totalAmount,
            paidAmount: payment.paidAmount,
            balance: payment.balance,
            status: payment.status,
            paymentDate: payment.paymentDate
        }))
    });
};

export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method not allowed' });
        }

        const body = req.body || {};
        if (body.action === 'login') return await login(req, res, body);
        if (body.action === 'studentAccountStatus' || body.action === 'configureStudentAccount') {
            return await studentAccount(req, res, body);
        }
        if (body.action === 'studentWorkspace') return await studentWorkspace(req, res);
        if (body.action === 'publicCoaches') {
            const db = await getDb();
            const teachers = await db.collection('teachers').find({}).toArray();
            const coaches = teachers
                .filter((teacher) => teacher.status !== 'Inactive')
                .map(({ id, name, qualifications, profileImage }) => ({ id, name, qualifications, profileImage }));
            return res.status(200).json(coaches);
        }
        if (body.action === 'inviteTeacher') return await sendTeacherOtp(req, res, body, true);
        if (body.action === 'requestTeacherOtp') return await sendTeacherOtp(req, res, body);
        if (body.action === 'verifyTeacherOtp') return await verifyTeacherOtp(req, res, body);
        if (body.action === 'completeTeacherActivation') return await completeTeacherActivation(req, res, body);
        if (body.action === 'teacherWorkspace') return await teacherWorkspace(req, res);

        return res.status(400).json({ message: 'Unknown authentication action.' });
    } catch (error) {
        console.error('Authentication request failed:', error);
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : 'The authentication request could not be completed.'
        });
    }
}
