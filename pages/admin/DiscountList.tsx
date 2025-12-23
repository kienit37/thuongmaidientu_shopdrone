
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminSupabase as supabase } from '../../supabaseClient';
import { Percent, Edit, Trash, Search, Eye, TrendingDown } from 'lucide-react';

const DiscountList = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDiscountedProducts();
    }, []);

    const fetchDiscountedProducts = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('is_on_sale', true)
            .order('updated_at', { ascending: false });
        setProducts(data || []);
        setLoading(false);
    };

    const removeSale = async (id: string) => {
        if (confirm('Bạn muốn gỡ trạng thái giảm giá của sản phẩm này?')) {
            const { error } = await supabase
                .from('products')
                .update({ is_on_sale: false, discount_price: 0 })
                .eq('id', id);

            if (!error) {
                setProducts(products.filter(p => p.id !== id));
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Quản lý Khuyến mãi</h1>
                    <p className="text-slate-500 text-sm mt-1">Danh sách các sản phẩm đang được áp dụng giảm giá</p>
                </div>
                <Link to="/admin/products/new" className="btn-primary">
                    <Percent size={20} strokeWidth={3} />
                    <span>Tạo giảm giá mới</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="admin-card bg-gradient-to-br from-rose-500 to-rose-600 text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Đang giảm giá</p>
                    <div className="flex items-end justify-between mt-2">
                        <h2 className="text-4xl font-black">{products.length}</h2>
                        <TrendingDown size={32} className="opacity-40" />
                    </div>
                    <p className="text-[10px] font-bold mt-4 uppercase tracking-tighter">Sản phẩm chiến dịch</p>
                </div>

                <div className="md:col-span-2 admin-card flex items-center justify-between p-8">
                    <div className="flex-grow max-w-md relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm trong danh sách giảm giá..."
                            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-rose-500 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="admin-card overflow-hidden p-0 border-rose-100 shadow-xl shadow-rose-500/5">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: 80 }}>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá gốc</th>
                                <th>Giá đã giảm</th>
                                <th>% Giảm</th>
                                <th className="text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-24">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto"></div>
                                </td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-24">
                                    <TrendingDown size={48} className="text-slate-100 mx-auto mb-4" />
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Chưa có sản phẩm nào đang giảm giá</p>
                                </td></tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const percent = Math.round(((product.price - product.discount_price) / product.price) * 100);
                                    return (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                                                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-bold text-slate-800">{product.name}</div>
                                                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{product.brand}</div>
                                            </td>
                                            <td className="text-slate-400 line-through font-bold">
                                                {Number(product.price).toLocaleString('vi-VN')}đ
                                            </td>
                                            <td className="font-black text-rose-600 text-lg">
                                                {Number(product.discount_price).toLocaleString('vi-VN')}đ
                                            </td>
                                            <td>
                                                <span className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl font-black text-[10px] border border-rose-100">
                                                    -{percent}%
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-2 pr-4">
                                                    <Link to={`/admin/products/edit/${product.id}`} className="p-2.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all">
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => removeSale(product.id)}
                                                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                        title="Hủy giảm giá"
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DiscountList;
