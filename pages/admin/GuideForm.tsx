
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminSupabase as supabase } from '../../supabaseClient';
import { Save, ArrowLeft, Loader2, BookOpen, Image as ImageIcon, Video, FileText, Clock, Layers, CheckCircle2 } from 'lucide-react';

const GuideForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        image: '',
        category: 'Cơ bản',
        read_time: '15 phút',
        video_url: ''
    });

    useEffect(() => {
        if (isEdit) fetchGuide();
    }, [id]);

    const fetchGuide = async () => {
        const { data } = await supabase.from('guides').select('*').eq('id', id).single();
        if (data) setFormData(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                await supabase.from('guides').update(formData).eq('id', id);
            } else {
                await supabase.from('guides').insert([formData]);
            }
            navigate('/admin/guides');
        } catch (error) {
            console.error('Error saving guide:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/admin/guides')}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm border border-slate-100 transition-all active:scale-90"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-1">Cẩm nang & Kỹ năng</p>
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                            {isEdit ? 'Chỉnh sửa hướng dẫn' : 'Thêm hướng dẫn mới'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/guides')}
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
                        {isEdit ? 'Lưu thay đổi' : 'Đăng hướng dẫn'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Content Section */}
                    <div className="admin-card">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><BookOpen size={20} /></div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Nội dung hướng dẫn</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="form-label">Tiêu đề hướng dẫn</label>
                                <input
                                    className="form-input text-lg font-black"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Ví dụ: Cách bay Flycam an toàn cho người mới..."
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Mô tả ngắn gọn</label>
                                <textarea
                                    className="form-input min-h-[100px]"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Tóm tắt về các kỹ năng sẽ đạt được sau bài hướng dẫn này..."
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Nội dung chi tiết (Markdown/HTML)</label>
                                <textarea
                                    className="form-input min-h-[450px] font-mono text-sm leading-relaxed"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Hướng dẫn chi tiết từng bước..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Media & Thumbnail */}
                    <div className="admin-card">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><ImageIcon size={20} /></div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Ảnh minh họa</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="form-label">URL Ảnh nền</label>
                                <input
                                    className="form-input"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="relative aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 overflow-hidden flex items-center justify-center">
                                {formData.image ? (
                                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <div className="text-center p-6 text-slate-300">
                                        <ImageIcon size={32} className="mx-auto mb-2" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Chưa có ảnh</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Video Connection */}
                    <div className="admin-card">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center"><Video size={20} /></div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Video bài giảng</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="form-label">Link YouTube (Tùy chọn)</label>
                                <input
                                    className="form-input"
                                    value={formData.video_url}
                                    onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>
                            {formData.video_url && (
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-rose-600 text-white rounded-lg flex items-center justify-center"><Video size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-900 uppercase leading-none">Video khả dụng</p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-1 truncate max-w-[150px]">{formData.video_url}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="admin-card">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><Layers size={20} /></div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Cấu hình</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="form-label">Danh mục đào tạo</label>
                                <select className="form-input appearance-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option>Cơ bản</option>
                                    <option>Kỹ năng</option>
                                    <option>Quay phim</option>
                                    <option>Bảo trì</option>
                                    <option>Kỹ thuật</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label flex items-center gap-2"><Clock size={14} /> Thời lượng học</label>
                                <input
                                    className="form-input"
                                    value={formData.read_time}
                                    onChange={e => setFormData({ ...formData, read_time: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default GuideForm;
