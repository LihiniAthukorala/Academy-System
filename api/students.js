import { getDb } from './_lib/mongodb.js';

const collectionName = 'students';

export default async function handler(req, res) {
    try {
        const db = await getDb();
        const students = db.collection(collectionName);

        if (req.method === 'GET') {
            const items = await students.find({}).sort({ joinedDate: -1, createdAt: -1 }).toArray();
            return res.status(200).json(items);
        }

        if (req.method === 'POST') {
            const payload = {
                ...req.body,
                joinedDate: req.body.joinedDate || new Date().toISOString().split('T')[0],
                status: req.body.status || 'Active',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await students.insertOne(payload);
            return res.status(201).json({ _id: result.insertedId, ...payload });
        }

        if (req.method === 'PUT') {
            const items = Array.isArray(req.body) ? req.body : req.body.items;
            const normalizedItems = Array.isArray(items) ? items : [];

            await students.deleteMany({});

            if (normalizedItems.length > 0) {
                const docs = normalizedItems.map((item) => ({
                    ...item,
                    updatedAt: new Date(),
                    createdAt: item.createdAt || new Date()
                }));
                await students.insertMany(docs);
            }

            return res.status(200).json({ ok: true, count: normalizedItems.length });
        }

        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
