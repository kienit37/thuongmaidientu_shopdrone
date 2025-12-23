
import React, { useEffect, useState } from 'react';
import { adminSupabase as supabase } from '../../supabaseClient';
import { Eye, Edit, Save, Loader2 } from 'lucide-react';

const PageList = () => {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeEdit, setActiveEdit] = useState<string | null>(null);
    const [editContent, setEditContent] = useState<string>('');

    // Pre-define pages we want to support editing for now
    const supportedPages = [
        { slug: 'about', name: 'Giới thiệu (About Us)' },
        { slug: 'terms', name: 'Điều khoản sử dụng' },
        { slug: 'policy', name: 'Chính sách bảo mật' }
    ];

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        const { data } = await supabase.from('pages').select('*');
        // Merge with supported pages to ensure they show up even if not in DB yet
        const merged = supportedPages.map(sp => {
            const found = data?.find(d => d.slug === sp.slug);
            return found || { ...sp, id: null, content: {} };
        });
        setPages(merged);
        setLoading(false);
    };

    const handleEdit = (page: any) => {
        setActiveEdit(page.slug);
        // If content is jsonb, we need to decide how to edit it. For simplicity, let's treat it as a raw JSON string or just text for generic pages. 
        // For 'about', we might want specific fields. 
        // For now, let's just make it a simple text editor for the 'content' field assuming it is a text field in this simple admin view,
        // or we just stringify the JSON if we want to be raw.
        // Let's assume simpler text content for terms/policy, and maybe just a placeholder for About.
        setEditContent(typeof page.content === 'object' ? JSON.stringify(page.content, null, 2) : page.content || '');
    };

    const handleSave = async (slug: string) => {
        let contentToSave: any = editContent;
        try {
            // Try parsing as JSON if it looks like JSON
            if (editContent.trim().startsWith('{')) {
                contentToSave = JSON.parse(editContent);
            }
        } catch (e) {
            // keep as string
        }

        const existing = pages.find(p => p.slug === slug);

        if (existing?.id) {
            await supabase.from('pages').update({ content: contentToSave }).eq('slug', slug);
        } else {
            await supabase.from('pages').insert([{ slug, title: supportedPages.find(s => s.slug === slug)?.name, content: contentToSave }]);
        }

        setActiveEdit(null);
        fetchPages();
    };

    return (
        <div>
            <div className="admin-header">
                <h1 className="admin-title">Quản lý Trang Tĩnh</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pages.map(page => (
                    <div key={page.slug} className="admin-card">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{page.name || page.title}</h3>
                                <p className="text-xs text-slate-500 font-mono mt-1">/{page.slug}</p>
                            </div>
                            {activeEdit === page.slug ? (
                                <div className="flex gap-2">
                                    <button onClick={() => setActiveEdit(null)} className="p-2 bg-slate-100 rounded text-xs font-bold">Hủy</button>
                                    <button onClick={() => handleSave(page.slug)} className="p-2 bg-blue-600 text-white rounded text-xs font-bold flex items-center gap-1"><Save size={14} /> Lưu</button>
                                </div>
                            ) : (
                                <button onClick={() => handleEdit(page)} className="p-2 hover:bg-slate-50 text-blue-600 rounded"><Edit size={18} /></button>
                            )}
                        </div>

                        {activeEdit === page.slug ? (
                            <div>
                                <p className="text-xs text-slate-400 mb-2">Chỉnh sửa nội dung (JSON hoặc Text):</p>
                                <textarea
                                    className="input-field font-mono text-xs h-64 w-full"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                            </div>
                        ) : (
                            <div className="bg-slate-50 p-4 rounded-xl h-32 overflow-hidden text-xs text-slate-500 relative">
                                {typeof page.content === 'object' ? JSON.stringify(page.content) : page.content || 'Chưa có nội dung.'}
                                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-50 to-transparent"></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PageList;
