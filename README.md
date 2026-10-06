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
