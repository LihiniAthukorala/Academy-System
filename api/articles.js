import { randomUUID } from 'node:crypto';
import { getDb } from './_lib/mongodb.js';
import { requireAdministrator } from './_lib/authorization.js';
import { getSession } from './_lib/auth.js';

const cleanArticle = (body = {}, existing = {}) => ({
    id: existing.id || body.id || randomUUID(),
    title: String(body.title || existing.title || '').trim(),
    excerpt: String(body.excerpt || existing.excerpt || '').trim(),
    content: String(body.content || existing.content || '').trim(),
    category: String(body.category || existing.category || 'Chess Strategy').trim(),
    imageUrl: String(body.imageUrl || existing.imageUrl || '').trim(),
    published: body.published !== undefined ? Boolean(body.published) : existing.published !== false,
    createdAt: existing.createdAt || new Date(),
    updatedAt: new Date()
});

export default async function handler(req, res) {
    try {
        const db = await getDb();
        const articles = db.collection('articles');
        const session = getSession(req);

        if (req.method === 'GET') {
            if (session?.role === 'Administrator') {
                return res.status(200).json(await articles.find({}).sort({ updatedAt: -1 }).toArray());
            }
            return res.status(200).json(await articles.find({ published: true }).sort({ createdAt: -1 }).toArray());
        }

        if (!requireAdministrator(req, res)) return;

        if (req.method === 'POST') {
            const article = cleanArticle(req.body);
            if (!article.title || !article.excerpt || !article.content) {
                return res.status(400).json({ message: 'Title, excerpt, and article content are required.' });
            }
            await articles.insertOne(article);
            return res.status(201).json(article);
        }

        if (req.method === 'PUT') {
            const article = cleanArticle(req.body, req.body);
            if (!article.id || !article.title || !article.excerpt || !article.content) {
                return res.status(400).json({ message: 'Title, excerpt, and article content are required.' });
            }
            const result = await articles.replaceOne({ id: article.id }, article);
            if (!result.matchedCount) return res.status(404).json({ message: 'Article not found.' });
            return res.status(200).json(article);
        }

        if (req.method === 'DELETE') {
            const id = String(req.body?.id || req.query?.id || '');
            if (!id) return res.status(400).json({ message: 'Article id is required.' });
            const result = await articles.deleteOne({ id });
            if (!result.deletedCount) return res.status(404).json({ message: 'Article not found.' });
            return res.status(204).json(null);
        }

        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}