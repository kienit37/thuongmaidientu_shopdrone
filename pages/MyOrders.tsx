
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Calendar, MapPin, ChevronRight, LogOut, User, DollarSign } from 'lucide-react';

const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            navigate('/login');
            return;
        }
        setUser(user);
        fetchOrders(user.id);
    };

    const fetchOrders = async (userId: string) => {
        const { data } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        // Also fetch by email for legacy matching if needed, but strict ID match is better for security
        // For now sticking to user_id match. But since we just added user_id, 
        // old orders won't show up unless we backfill. Future orders will.
        setOrders(data || []);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-32 space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Tài khoản của tôi</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                        <User size={14} /> {user?.user_metadata?.full_name || user?.email}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
                >
                    <LogOut size={14} /> Đăng xuất
                </button>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <Package size={24} className="text-blue-600" /> Đơn hàng của bạn
                </h2>

                {loading ? (
                    <div className="text-center py-12 text-slate-400 font-bold">Đang tải dữ liệu...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                        <Package size={48} className="mx-auto text-slate-300" />
                        <p className="text-slate-500 font-bold">Bạn chưa có đơn hàng nào.</p>
                        <Link to="/" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-blue-700">Mua sắm ngay</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-slate-50">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">#{order.id.slice(0, 8)}</span>
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                                        'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                {order.status === 'pending' ? 'Chờ xử lý' :
                                                    order.status === 'processing' ? 'Đang giao' :
                                                        order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 pt-2">
                                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                                            <span className="flex items-center gap-1.5"><DollarSign size={14} /> {order.payment_method === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản / MoMo'}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Tổng cộng</p>
                                        <p className="text-2xl font-black text-slate-900 tracking-tighter">{Number(order.total).toLocaleString('vi-VN')}đ</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                                    <MapPin size={18} className="mt-0.5 text-blue-600 flex-shrink-0" />
                                    <span>{order.address}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
