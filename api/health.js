import { getDb } from './_lib/mongodb.js';

export default async function handler(req, res) {
    try {
        const db = await getDb();
        await db.command({ ping: 1 });

        return res.status(200).json({
            ok: true,
            db: db.databaseName,
            storage: process.env.MONGODB_URI ? 'mongodb' : 'local-json'
        });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
}
