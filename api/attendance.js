import { getDb } from './_lib/mongodb.js';

const collectionName = 'attendance';

export default async function handler(req, res) {
    try {
        const db = await getDb();
        const attendance = db.collection(collectionName);

        if (req.method === 'GET') {
            const items = await attendance.find({}).sort({ date: -1, createdAt: -1 }).toArray();
            return res.status(200).json(items);
        }

        if (req.method === 'POST') {
            const payload = {
                ...req.body,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await attendance.insertOne(payload);
            return res.status(201).json({ _id: result.insertedId, ...payload });
        }

        if (req.method === 'PUT') {
            const items = Array.isArray(req.body) ? req.body : req.body.items;
            const normalizedItems = Array.isArray(items) ? items : [];

            await attendance.deleteMany({});

            if (normalizedItems.length > 0) {
                const docs = normalizedItems.map((item) => ({
                    ...item,
                    updatedAt: new Date(),
                    createdAt: item.createdAt || new Date()
                }));
                await attendance.insertMany(docs);
            }

            return res.status(200).json({ ok: true, count: normalizedItems.length });
        }

        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
