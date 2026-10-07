import React, { useEffect, useState } from 'react';
import { BookOpen, Edit3, Eye, EyeOff, Plus, Trash2, X } from 'lucide-react';
import { createArticle, deleteArticle, fetchCollection, updateArticle } from '../utils/api';
import { useAcademy } from '../context/AcademyContext';

const emptyArticle = { title: '', excerpt: '', content: '', category: 'Chess Strategy', imageUrl: '', published: true };

export default function Articles() {
    const { triggerToast } = useAcademy();
    const [articles, setArticles] = useState([]);
    const [form, setForm] = useState(emptyArticle);
    const [editingId, setEditingId] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadArticles = async () => {
        try {
            setArticles(await fetchCollection('articles'));
        } catch (error) {
            triggerToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadArticles(); }, []);

    const updateField = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    };

    const openEditor = (article = emptyArticle) => {
        setEditingId(article.id || null);
        setForm({ ...emptyArticle, ...article });
        setIsOpen(true);
    };

    const saveArticle = async (event) => {
        event.preventDefault();
        try {
            const saved = editingId ? await updateArticle({ ...form, id: editingId }) : await createArticle(form);
            setArticles((current) => editingId ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
            setIsOpen(false);
            triggerToast(editingId ? 'Article updated.' : 'Article created.', 'success');
        } catch (error) {
            triggerToast(error.message, 'error');
        }
    };

    const removeArticle = async (id) => {
        if (!window.confirm('Delete this article?')) return;
        try {
            await deleteArticle(id);
            setArticles((current) => current.filter((article) => article.id !== id));
            triggerToast('Article deleted.', 'success');
        } catch (error) {
            triggerToast(error.message, 'error');
        }
    };

    return (
        <div className="space-y-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-500">Content studio</p>
                    <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">Academy Articles</h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Publish lessons, chess insights, and academy updates to the public website.</p>
                </div>
                <button onClick={() => openEditor()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-200">
                    <Plus className="h-4 w-4" /> New article
                </button>
            </div>

            {loading ? <p className="rounded-2xl bg-white p-8 text-sm text-slate-500 dark:bg-slate-900">Loading articles...</p> : (
                <div className="grid gap-5 lg:grid-cols-2">
                    {articles.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700"><BookOpen className="mx-auto h-8 w-8 text-amber-500" /><p className="mt-3 font-semibold text-slate-700 dark:text-slate-200">No articles yet</p><p className="mt-1 text-sm text-slate-500">Create the first article for your academy website.</p></div> : articles.map((article) => (
                        <article key={article.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-start justify-between gap-4">
                                <div><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">{article.category}</span><h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{article.title}</h2></div>
                                {article.published ? <Eye className="h-5 w-5 text-emerald-500" /> : <EyeOff className="h-5 w-5 text-slate-400" />}
                            </div>
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{article.excerpt}</p>
                            <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                                <button onClick={() => openEditor(article)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><Edit3 className="h-3.5 w-3.5" /> Edit</button>
                                <button onClick={() => removeArticle(article.id)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {isOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4">
                <form onSubmit={saveArticle} className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
                    <div className="flex items-center justify-between"><h2 className="text-xl font-black text-slate-900 dark:text-white">{editingId ? 'Edit article' : 'New article'}</h2><button type="button" onClick={() => setIsOpen(false)}><X /></button></div>
                    <div className="mt-6 space-y-4">
                        <input name="title" value={form.title} onChange={updateField} required placeholder="Article title" className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700 dark:text-white" />
                        <div className="grid gap-4 sm:grid-cols-2"><input name="category" value={form.category} onChange={updateField} placeholder="Category" className="rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700 dark:text-white" /><input name="imageUrl" value={form.imageUrl} onChange={updateField} placeholder="Image URL (optional)" className="rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700 dark:text-white" /></div>
                        <textarea name="excerpt" value={form.excerpt} onChange={updateField} required rows="3" placeholder="Short summary shown on the homepage" className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700 dark:text-white" />
                        <textarea name="content" value={form.content} onChange={updateField} required rows="10" placeholder="Write the article content..." className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700 dark:text-white" />
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><input type="checkbox" name="published" checked={form.published} onChange={updateField} className="h-4 w-4 accent-amber-400" /> Publish on public website</label>
                    </div>
                    <button className="mt-6 w-full rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-200">Save article</button>
                </form>
            </div>}
        </div>
    );
}