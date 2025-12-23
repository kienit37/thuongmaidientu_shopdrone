
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminSupabase as supabase } from '../../supabaseClient';
import { Save, ArrowLeft, Loader2, Newspaper, Image as ImageIcon, FileText, Tag, Clock, User, CheckCircle2 } from 'lucide-react';

const BlogForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        category: 'Đánh giá',
        author: 'Admin',
        read_time: '12 phút',
        tags: ''
    });

    useEffect(() => {
        if (isEdit) fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        const { data } = await supabase.from('blogs').select('*').eq('id', id).single();
        if (data) {
            setFormData({
                ...data,
                tags: data.tags ? data.tags.join(', ') : ''
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim())
        };

        if (isEdit) {
            await supabase.from('blogs').update(payload).eq('id', id);
        } else {
            await supabase.from('blogs').insert([payload]);
        }
        setLoading(false);
        navigate('/admin/blogs');
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/admin/blogs')}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm border border-slate-100 transition-all active:scale-90"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">Kiến thức & Tin tức</p>
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                            {isEdit ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/blogs')}
                        className="px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        {isEdit ? 'Lưu thay đổi' : 'Xuất bản bài viết'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Content Card */}
                    <div className="admin-card">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Newspaper size={20} /></div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Nội dung chính</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="form-label">Tiêu đề bài viết</label>
                                <input
                                    className="form-input text-lg font-black font-serif"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Nhập tiêu đề hấp dẫn..."
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tóm tắt ngắn (Excerpt)</label>
                                <textarea
                                    className="form-input min-h-[100px] text-slate-500 font-medium italic"
                                    value={formData.excerpt}
                                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Đoạn mô tả ngắn xuất hiện ngoài danh sách bài viết..."
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Nội dung bài viết (Hỗ trợ HTML)</label>
                                <textarea
                                    className="form-input min-h-[500px] font-mono text-sm leading-relaxed"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Nhập nội dung chi tiết hoặc dán mã HTML bài viết tại đây..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Cover Image Card */}
                    <div className="admin-card">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><ImageIcon size={20} /></div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Ảnh bìa (Thumbnail)</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="form-label">URL Ảnh bìa</label>
                                <input
                                    className="form-input"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="relative aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 overflow-hidden flex items-center justify-center group">
                                {formData.image ? (
                                    <img src={formData.image} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="Thumbnail Preview" />
                                ) : (
                                    <div className="text-center p-6">
                                        <ImageIcon size={32} className="text-slate-200 mx-auto mb-2" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Meta Info Card */}
                    <div className="admin-card">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><FileText size={20} /></div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Phân loại & SEO</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="form-label">Danh mục bài viết</label>
                                <select className="form-input appearance-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option>Đánh giá</option>
                                    <option>Hướng dẫn</option>
                                    <option>Tin tức</option>
                                    <option>So sánh</option>
                                    <option>Kiến thức</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="form-group">
                                    <label className="form-label font-bold flex items-center gap-2"><Clock size={12} /> Thời gian đọc</label>
                                    <input className="form-input" value={formData.read_time} onChange={e => setFormData({ ...formData, read_time: e.target.value })} placeholder="vídụ: 10 phút" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label font-bold flex items-center gap-2"><User size={12} /> Tác giả</label>
                                    <input className="form-input" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label font-bold flex items-center gap-2"><Tag size={12} /> Thẻ (Tags)</label>
                                <input
                                    className="form-input"
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="Flycam, DJI, Mavic 3..."
                                />
                                <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Mỗi thẻ cách nhau bằng dấu phẩy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BlogForm;
