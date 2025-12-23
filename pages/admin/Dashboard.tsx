import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminSupabase as supabase } from '../../supabaseClient';
import { Package, ShoppingCart, DollarSign, TrendingUp, User, Globe, Clock, MousePointer2, ChevronRight, Activity } from 'lucide-react';
import { SessionTracker } from '../../utils/SessionTracker';

const Dashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        revenue: 0,
        aov: 0,
        pending: 0,
        completed: 0
    });
    const [chartData, setChartData] = useState<{ day: string, value: number, height: number }[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [bestSellers, setBestSellers] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([
        { id: 1, text: 'Khách hàng vừa xem Flycam DJI Mini 4', time: 'Vừa xong', type: 'view' },
        { id: 2, text: 'Đơn hàng mới #12859 từ Nguyễn Văn A', time: '2 phút trước', type: 'order' },
    ]);

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Real-time Activity Feed
    useEffect(() => {
        // 1. Fetch initial logs
        const fetchLogs = async () => {
            const { data } = await supabase
                .from('activity_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (data) {
                const mapped = data.map(log => ({
                    id: log.id,
                    text: log.details || log.action,
                    time: new Date(log.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    type: 'view'
                }));
                setNotifications(mapped);
            }
        };
        fetchLogs();

        // 2. Subscribe to new logs
        const channel = supabase
            .channel('realtime_activity')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, (payload) => {
                const newLog = payload.new;
                const notif = {
                    id: newLog.id,
                    text: newLog.details || newLog.action,
                    time: new Date(newLog.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    type: 'view'
                };
                setNotifications(prev => [notif, ...prev.slice(0, 4)]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Fetch Stats Data
    useEffect(() => {
        const fetchData = async () => {
            // 1. Products Count
            const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

            // Fetch all orders for comprehensive stats
            const { data: allOrders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });

            if (allOrders) {
                const revenue = allOrders.reduce((acc, order) => acc + (Number(order.total) || 0), 0);
                const orderCount = allOrders.length;
                // Count statuses
                const pendingCount = allOrders.filter(o => o.status === 'pending').length;
                const completedCount = allOrders.filter(o => o.status === 'completed' || o.status === 'shipped').length;
                // Average Order Value
                const aov = orderCount > 0 ? revenue / orderCount : 0;

                setStats({
                    products: productCount || 0,
                    orders: orderCount,
                    revenue,
                    aov,
                    pending: pendingCount,
                    completed: completedCount
                });

                // 2. Prepare Chart Data (Last 7 Days)
                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return d.toISOString().split('T')[0]; // YYYY-MM-DD
                });

                const revenueByDay = last7Days.map(date => {
                    const dayRevenue = allOrders
                        .filter(o => o.created_at.startsWith(date))
                        .reduce((acc, o) => acc + (Number(o.total) || 0), 0);
                    return { date, value: dayRevenue };
                });

                // Calculate heights relative to max value (min 1M to avoid div by zero issues visually)
                const maxVal = Math.max(...revenueByDay.map(d => d.value), 1000000);
                const chart = revenueByDay.map(d => ({
                    day: new Date(d.date).toLocaleDateString('vi-VN', { weekday: 'short' }),
                    value: d.value,
                    height: Math.round((d.value / maxVal) * 100) // Percentage 0-100
                }));
                setChartData(chart);

                // 3. Recent Orders
                setRecentOrders(allOrders.slice(0, 5));
            }

            // 4. Best Sellers (Aggregate)
            const { data: items } = await supabase.from('order_items').select('product_name, quantity, price');
            if (items) {
                const productStats: Record<string, { qty: number, revenue: number }> = {};
                items.forEach(item => {
                    if (!productStats[item.product_name]) productStats[item.product_name] = { qty: 0, revenue: 0 };
                    productStats[item.product_name].qty += item.quantity || 1;
                    productStats[item.product_name].revenue += (item.price || 0) * (item.quantity || 1);
                });

                // Get max qty for progress bar calculation
                const maxQty = Math.max(...Object.values(productStats).map(s => s.qty));

                const sortedProducts = Object.entries(productStats)
                    .map(([name, stat]) => ({ name, ...stat, percent: (stat.qty / maxQty) * 100 }))
                    .sort((a, b) => b.qty - a.qty)
                    .slice(0, 5);

                setBestSellers(sortedProducts);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Tổng quan</h1>
                    <p className="text-slate-500 font-medium">Cập nhật tình hình kinh doanh thời gian thực</p>
                </div>
                <div className="text-right bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <Activity size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-blue-600 tracking-tighter tabular-nums leading-none">
                            {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid - Premium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <DollarSign size={24} />
                        </div>
                        <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Doanh thu</p>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{stats.revenue.toLocaleString('vi-VN')}đ</h3>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)] transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                            <ShoppingCart size={24} />
                        </div>
                        <span className="flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{stats.products} SP</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">TC Đơn hàng</p>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{stats.orders}</h3>
                    </div>
                </div>

                {/* Pending Orders Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(245,158,11,0.1)] transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang xử lý</p>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{stats.pending} <span className="text-sm font-medium text-slate-400">Đơn</span></h3>
                    </div>
                    <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: `${stats.orders > 0 ? (stats.pending / stats.orders) * 100 : 0}%` }}></div>
                    </div>
                </div>

                {/* AOV Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(168,85,247,0.1)] transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">TB Giá trị đơn</p>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{Math.round(stats.aov).toLocaleString('vi-VN')}đ</h3>
                    </div>
                </div>
            </div>

            {/* Middle Section: Chart and Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Biểu đồ doanh thu</h3>
                            <p className="text-xs text-slate-500 font-bold mt-1">7 ngày gần nhất</p>
                        </div>
                        <button className="text-[10px] font-bold bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                            Chi tiết
                        </button>
                    </div>

                    <div className="flex items-end justify-between h-[200px] gap-2 md:gap-4">
                        {chartData.length > 0 ? chartData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-default">
                                <div className="relative w-full flex items-end justify-center h-full">
                                    <div
                                        className="w-full max-w-[40px] bg-blue-100 rounded-t-xl group-hover:bg-blue-500 transition-all duration-500 relative"
                                        style={{ height: `${d.height}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg transform translate-y-2 group-hover:translate-y-0 duration-300">
                                            {d.value.toLocaleString()}đ
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase group-hover:text-blue-500 transition-colors">{d.day}</span>
                            </div>
                        )) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm font-bold animate-pulse">
                                Đang tải dữ liệu biểu đồ...
                            </div>
                        )}
                    </div>
                </div>

                {/* Real-time Feed */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl shadow-blue-900/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <Globe className="text-blue-400 animate-pulse" /> Live View
                            </h3>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                        </div>
                        <div className="space-y-4">
                            {notifications.map(notif => (
                                <div key={notif.id} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0 animate-in slide-in-from-right duration-500">
                                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                        <User size={14} className="text-blue-300" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-200 leading-relaxed opacity-90">{notif.text}</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">{notif.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Recent & Best Selling */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders Table */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Đơn hàng mới nhất</h3>
                        <Link to="/admin/orders" className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                            Xem tất cả <ChevronRight size={12} />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.map(order => (
                            <div key={order.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black transition-colors ${order.status === 'pending' ? 'bg-amber-100 text-amber-600 group-hover:bg-amber-200' : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200'
                                        }`}>
                                        {order.status === 'pending' ? 'P' : 'C'}
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            #{order.payment_method?.split('_')[1] || order.id.slice(0, 6).toUpperCase()}
                                        </h5>
                                        <p className="text-[11px] text-slate-500 font-medium">{order.customer_name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-slate-900">{Number(order.total).toLocaleString('vi-VN')}đ</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{new Date(order.created_at).toLocaleDateString('vi-VN')}</div>
                                </div>
                            </div>
                        ))}
                        {recentOrders.length === 0 && (
                            <div className="text-center py-8 text-slate-400 text-xs font-medium italic">
                                Chưa có đơn hàng nào
                            </div>
                        )}
                    </div>
                </div>

                {/* Best Sellers */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Top sản phẩm</h3>
                        <div className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase">
                            Bán chạy
                        </div>
                    </div>
                    <div className="space-y-6">
                        {bestSellers.map((item, idx) => (
                            <div key={idx} className="relative group">
                                <div className="flex items-center justify-between mb-2 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-colors ${idx === 0 ? 'bg-yellow-100 text-yellow-600' :
                                            idx === 1 ? 'bg-slate-200 text-slate-600' :
                                                idx === 2 ? 'bg-orange-100 text-orange-600' :
                                                    'bg-slate-50 text-slate-400'
                                            }`}>
                                            {idx + 1}
                                        </span>
                                        <h5 className="text-sm font-bold text-slate-700 line-clamp-1 max-w-[200px] group-hover:text-blue-600 transition-colors">{item.name}</h5>
                                    </div>
                                    <span className="text-xs font-black text-slate-900">{item.qty} <span className="text-[10px] font-medium text-slate-400">đã bán</span></span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${idx === 0 ? 'bg-yellow-400' : 'bg-blue-500'
                                            }`}
                                        style={{ width: `${item.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {bestSellers.length === 0 && <p className="text-center text-slate-300 font-bold py-8">Chưa có dữ liệu</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
