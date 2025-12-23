
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminSupabase as supabase } from '../../supabaseClient';
import { Plus, Edit, Trash, Search, Eye } from 'lucide-react';

const BlogList = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchBlogs(); }, []);

    const fetchBlogs = async () => {
        const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
        setBlogs(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bạn chắc chắn muốn xóa bài viết này?')) {
            const { error } = await supabase.from('blogs').delete().eq('id', id);
            if (!error) setBlogs(blogs.filter(b => b.id !== id));
        }
    };

    const filtered = blogs.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <div className="admin-header">
                <h1 className="admin-title">Quản lý Blog</h1>
                <Link to="/admin/blogs/new" className="btn-primary">
                    <Plus size={20} strokeWidth={3} />
                    <span>Viết bài mới</span>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="search-input-group">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Tìm bài viết..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Tổng cộng: <span className="text-blue-600 font-black">{filtered.length}</span>
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
                                <th>Tác giả</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (<tr><td colSpan={5} className="text-center py-8">Đang tải...</td></tr>) :
                                filtered.length === 0 ? (<tr><td colSpan={5} className="text-center py-8">Không có bài viết nào.</td></tr>) :
                                    filtered.map(blog => (
                                        <tr key={blog.id}>
                                            <td>
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border">
                                                    <img src={blog.image} className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td><div className="font-bold text-slate-800 line-clamp-2">{blog.title}</div></td>
                                            <td><span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">{blog.category}</span></td>
                                            <td className="text-sm text-slate-500">{blog.author}</td>
                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link to={`/admin/blogs/edit/${blog.id}`} className="p-2 hover:bg-slate-100 rounded-lg"><Edit size={18} className="text-blue-600" /></Link>
                                                    <button onClick={() => handleDelete(blog.id)} className="p-2 hover:bg-slate-100 rounded-lg"><Trash size={18} className="text-red-500" /></button>
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

export default BlogList;
