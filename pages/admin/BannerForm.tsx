
import React, { useState, useEffect } from 'react';
import { adminSupabase as supabase } from '../../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon, Loader2, Link as LinkIcon, Hash, CheckCircle2, Monitor, Clock } from 'lucide-react';

const BannerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        link_url: '',
        display_order: 0,
        is_active: true,
        duration: 5000
    });

    useEffect(() => {
        if (id) {
            const fetchBanner = async () => {
                const { data } = await supabase.from('banners').select('*').eq('id', id).single();
                if (data) setFormData(data);
            };
            fetchBanner();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                await supabase.from('banners').update(formData).eq('id', id);
            } else {
                await supabase.from('banners').insert([formData]);
            }
            navigate('/admin/banners');
        } catch (error) {
            console.error('Error saving banner:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/admin/banners')}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm border border-slate-100 transition-all active:scale-90"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-1">Slide Trang chủ</p>
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                            {id ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/banners')}
                        className="px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {id ? 'Lưu Banner' : 'Tạo Banner'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="admin-card">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Monitor size={20} /></div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Nội dung hiển thị</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="form-label">Tiêu đề Banner (Main Title)</label>
                                <input
                                    className="form-input font-black"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="VD: SIÊU PHẨM DJI MAVIC 3 PRO"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Mô tả phụ</label>
                                <textarea
                                    className="form-input min-h-[100px]"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Đoạn mô tả ngắn bên dưới tiêu đề..."
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label flex items-center gap-2"><LinkIcon size={14} /> Đường dẫn liên kết</label>
                                <input
                                    className="form-input"
                                    value={formData.link_url}
                                    onChange={e => setFormData({ ...formData, link_url: e.target.value })}
                                    placeholder="/product/mavic-3-pro"
                                />
                                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Banner sẽ chuyển hướng đến link này khi người dùng click</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Image Preview */}
                    <div className="admin-card">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><ImageIcon size={20} /></div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Hình ảnh Banner</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="form-label">URL Ảnh Banner (Kích thước khuyên dùng: 1920x800px)</label>
                                <input
                                    className="form-input"
                                    required
                                    value={formData.image_url}
                                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="relative aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 overflow-hidden group">
                                {formData.image_url ? (
                                    <img
                                        src={formData.image_url}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                                        alt="Preview"
                                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/800x450?text=Loi+Link+Anh")}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                                        <ImageIcon size={48} className="mb-4 opacity-50" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Xem trước Banner</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Configuration */}
                    <div className="admin-card">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><Hash size={20} /></div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Cấu hình hiển thị</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label">Thứ tự hiển thị số</label>
                                <input
                                    type="number"
                                    className="form-input font-black"
                                    value={formData.display_order}
                                    onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label flex items-center gap-2 underline decoration-amber-500/30">
                                    <Clock size={14} className="text-amber-500" /> Thời gian chuyển (ms)
                                </label>
                                <input
                                    type="number"
                                    step="500"
                                    className="form-input font-black text-amber-600 bg-amber-50/30 border-amber-100"
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 5000 })}
                                />
                                <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Mặc định: 5000 (5 giây)</p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-end pb-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={formData.is_active}
                                        onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                    <div className={`w-12 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_active ? 'translate-x-6 shadow-md' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Kích hoạt hiển thị</span>
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BannerForm;
