import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { fetchPublicArticles } from '../utils/api';

export default function ArticleReader() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    useEffect(() => { fetchPublicArticles().then((items) => setArticle(items.find((item) => item.id === id) || null)).catch(() => setArticle(null)); }, [id]);
    if (!article) return <main className="grid min-h-screen place-items-center bg-[#07111f] p-6 text-center text-white"><div><BookOpen className="mx-auto h-10 w-10 text-amber-300" /><h1 className="mt-4 text-2xl font-bold">Article not found</h1><Link to="/home" className="mt-4 inline-block text-sm text-amber-300">Return home</Link></div></main>;
    return <main className="min-h-screen bg-[#07111f] px-5 py-10 text-white sm:px-8"><article className="mx-auto max-w-3xl"><Link to="/home" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300"><ArrowLeft className="h-4 w-4" /> Back to academy</Link><p className="mt-12 text-xs font-bold uppercase tracking-[0.3em] text-amber-300">{article.category}</p><h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">{article.title}</h1><p className="mt-6 text-lg leading-8 text-slate-300">{article.excerpt}</p>{article.imageUrl && <img src={article.imageUrl} alt="" className="mt-10 max-h-[420px] w-full rounded-3xl object-cover" />}<div className="mt-10 whitespace-pre-line text-base leading-8 text-slate-300">{article.content}</div></article></main>;
}