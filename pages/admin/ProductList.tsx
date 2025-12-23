
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminSupabase as supabase } from '../../supabaseClient';
import { Plus, Edit, Trash, Search, Eye } from 'lucide-react';

const ProductList = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        setProducts(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (!error) {
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert('Lỗi khi xóa: ' + error.message);
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="admin-header">
                <h1 className="admin-title">Sản phẩm</h1>
                <Link to="/admin/products/new" className="btn-primary">
                    <Plus size={20} strokeWidth={3} />
                    <span>Thêm sản phẩm mới</span>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="search-input-group">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm nhanh..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Tổng số: <span className="text-blue-600 font-black">{filteredProducts.length}</span>
                    </div>
                </div>
            </div>

            <div className="admin-card overflow-hidden p-0">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: 80 }}>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Danh mục</th>
                                <th>Giá</th>
                                <th>Kho</th>
                                <th className="text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8">Đang tải...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8">Không tìm thấy sản phẩm nào.</td></tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                                                <img src={product.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-bold text-slate-800">{product.name}</div>
                                            <div className="text-xs text-slate-400">{product.brand}</div>
                                        </td>
                                        <td>
                                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="font-bold text-blue-600">
                                            {Number(product.price).toLocaleString('vi-VN')}đ
                                        </td>
                                        <td>
                                            <span className={`status-badge ${product.stock > 0 ? 'status-success' : 'status-danger'}`}>
                                                {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/product/${product.id}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link to={`/admin/products/edit/${product.id}`} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                                                    <Edit size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash size={18} />
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
        </div>
    );
};

export default ProductList;
