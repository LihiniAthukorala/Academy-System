# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## MongoDB setup

1. In MongoDB Atlas, rotate the database user's password because the previous connection URI was shared in chat. Ensure the Atlas Network Access list allows the machine running the API.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` to the rotated connection string. Keep `.env` private; it is ignored by Git. URL-encode special characters in the username or password.
3. Keep `MONGODB_DB=academy_system`, or change it to the database name you want.
4. In separate terminals, run `npm.cmd run api` and `npm.cmd run dev` (use `npm` instead of `npm.cmd` in Command Prompt).

The API stores teachers, classes, students, attendance, and payments in separate MongoDB collections. The browser loads these collections when the API starts and saves changes back to the API. The API health endpoint reports `storage: "mongodb"` when Atlas is configured; without `MONGODB_URI`, it uses local JSON files instead.

## Teacher Gmail activation

Teachers activate their accounts using the Gmail address registered by the administrator. They verify a one-time code, then choose a username and password.

1. For local development, the API accepts the existing demo credentials `admin` and `password123` when `ADMIN_USERNAME` and `ADMIN_PASSWORD` are not set. You can also set them in `.env`. In production, set both variables to private, strong values; the development credentials are disabled there.
2. Set `AUTH_SECRET` to a private, random value of at least 32 characters. For example, run `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` and put the output in `.env`.
3. During local development, if `RESEND_API_KEY` and `EMAIL_FROM` are both unset, the API prints each teacher activation code to the API terminal. The OTP is never returned to the browser. This fallback is disabled in production.
4. To send real email, configure `RESEND_API_KEY` and `EMAIL_FROM` in the server environment. Create a Resend account and verify the sender domain/address first.
5. Restart `npm.cmd run api` after changing `.env`.
6. Sign in as the administrator and register a teacher with the Gmail address they will use to activate. From the login screen, the teacher selects **Teacher** → **Activate your account**, enters that registered email, and requests a code. They enter the code, then create a unique username and password of at least 12 characters.
7. The teacher signs in with the chosen username and password. The teacher dashboard only loads classes assigned to that teacher and students enrolled in those classes. Other API collections require an administrator session.

Without Resend configured, staff can still activate locally by reading the OTP from the API terminal. Production requires Resend configuration and never logs or returns OTPs. The existing demo admin credentials are retained for local development and never require OTP. Keep `.env` out of source control and configure strong, private credentials and a signing secret before production use.

## Student portal

Administrators can create student login credentials from an individual student profile:

1. Sign in as an administrator and open **Students**.
2. Open a student profile and use the **Student login account** section.
3. Create a username and a strong initial password of at least 12 characters, then share them securely with the student.
4. Students select **Student** on the login screen and sign in with those credentials.

The student dashboard only exposes the signed-in student's class, attendance records, and fee history. Student accounts are disabled automatically when the associated student record is inactive.
