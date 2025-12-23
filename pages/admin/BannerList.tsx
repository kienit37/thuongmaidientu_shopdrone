
import React, { useEffect, useState } from 'react';
import { adminSupabase as supabase } from '../../supabaseClient';
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, EyeOff, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const BannerList = () => {
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        const { data } = await supabase.from('banners').select('*').order('display_order', { ascending: true });
        setBanners(data || []);
        setLoading(false);
    };

    const deleteBanner = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
        const { error } = await supabase.from('banners').delete().eq('id', id);
        if (!error) fetchBanners();
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        await supabase.from('banners').update({ is_active: !currentStatus }).eq('id', id);
        fetchBanners();
    };

    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Quản lý Banners / Slide</h1>
                    <p className="text-slate-500 text-sm mt-1">Cài đặt hình ảnh hiển thị trên trang chủ</p>
                </div>
                <Link to="/admin/banners/new" className="btn-primary">
                    <Plus size={20} strokeWidth={3} />
                    <span>Thêm Banner mới</span>
                </Link>
            </div>

            <div className="admin-card p-0 overflow-hidden">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Hình ảnh</th>
                            <th>Tiêu đề & Mô tả</th>
                            <th>Thứ tự</th>
                            <th>Thời gian</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-24">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            </td></tr>
                        ) : banners.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-24 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Chưa có banner nào. Hãy thêm mới!</td></tr>
                        ) : (
                            banners.map((banner) => (
                                <tr key={banner.id}>
                                    <td className="w-32">
                                        <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                            {banner.image_url ? (
                                                <img src={banner.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={20} /></div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-bold text-slate-800">{banner.title}</div>
                                        <div className="text-xs text-slate-500 line-clamp-1">{banner.description}</div>
                                    </td>
                                    <td className="font-mono">{banner.display_order}</td>
                                    <td>
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 w-fit">
                                            <Clock size={12} /> {((banner.duration || 5000) / 1000).toFixed(1)}s
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => toggleStatus(banner.id, banner.is_active)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide border transition-all ${banner.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/10' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                                        >
                                            {banner.is_active ? <><Eye size={12} /> Hiển thị</> : <><EyeOff size={12} /> Đang ẩn</>}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Link to={`/admin/banners/edit/${banner.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                <Edit size={18} />
                                            </Link>
                                            <button onClick={() => deleteBanner(banner.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BannerList;
