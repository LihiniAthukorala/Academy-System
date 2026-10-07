import { getDb } from './_lib/mongodb.js';
import { requireAdministrator } from './_lib/authorization.js';

const collectionName = 'payments';

export default async function handler(req, res) {
    if (!requireAdministrator(req, res)) return;
    try {
        const db = await getDb();
        const payments = db.collection(collectionName);

        if (req.method === 'GET') {
            const items = await payments.find({}).sort({ paymentDate: -1, createdAt: -1 }).toArray();
            return res.status(200).json(items);
        }

        if (req.method === 'POST') {
            const payload = {
                ...req.body,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await payments.insertOne(payload);
            return res.status(201).json({ _id: result.insertedId, ...payload });
        }

        if (req.method === 'PUT') {
            const items = Array.isArray(req.body) ? req.body : req.body.items;
            const normalizedItems = Array.isArray(items) ? items : [];

            await payments.deleteMany({});

            if (normalizedItems.length > 0) {
                const docs = normalizedItems.map((item) => ({
                    ...item,
                    updatedAt: new Date(),
                    createdAt: item.createdAt || new Date()
                }));
                await payments.insertMany(docs);
            }

            return res.status(200).json({ ok: true, count: normalizedItems.length });
        }

        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
