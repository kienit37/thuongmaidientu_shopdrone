
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminSupabase as supabase } from '../../supabaseClient';
import { Plus, Edit, Trash, Search, BookOpen } from 'lucide-react';

const GuideList = () => {
    const [guides, setGuides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchGuides(); }, []);

    const fetchGuides = async () => {
        const { data } = await supabase.from('guides').select('*').order('created_at', { ascending: false });
        setGuides(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Xóa hướng dẫn này?')) {
            const { error } = await supabase.from('guides').delete().eq('id', id);
            if (!error) setGuides(guides.filter(g => g.id !== id));
        }
    };

    const filtered = guides.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <div className="admin-header">
                <h1 className="admin-title">Quản lý Hướng Dẫn</h1>
                <Link to="/admin/guides/new" className="btn-primary">
                    <Plus size={20} strokeWidth={3} />
                    <span>Thêm hướng dẫn mới</span>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="search-input-group">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Tìm hướng dẫn..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Tổng số: <span className="text-blue-600 font-black">{filtered.length}</span>
                    </div>
                </div>
            </div>

            <div className="admin-card overflow-hidden p-0">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: 80 }}>Ảnh</th>
                                <th>Tiêu đề</th>
                                <th>Danh mục</th>
                                <th>Video</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (<tr><td colSpan={5} className="text-center py-8">Đang tải...</td></tr>) :
                                filtered.length === 0 ? (<tr><td colSpan={5} className="text-center py-8">Không có dữ liệu.</td></tr>) :
                                    filtered.map(guide => (
                                        <tr key={guide.id}>
                                            <td>
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border">
                                                    <img src={guide.image} className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td><div className="font-bold text-slate-800 line-clamp-2">{guide.title}</div></td>
                                            <td><span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">{guide.category}</span></td>
                                            <td>{guide.video_url ? 'Có video' : '-'}</td>
                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link to={`/admin/guides/edit/${guide.id}`} className="p-2 hover:bg-slate-100 rounded-lg"><Edit size={18} className="text-blue-600" /></Link>
                                                    <button onClick={() => handleDelete(guide.id)} className="p-2 hover:bg-slate-100 rounded-lg"><Trash size={18} className="text-red-500" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GuideList;
