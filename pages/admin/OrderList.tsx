import React, { useEffect, useState, useMemo } from 'react';
import { adminSupabase as supabase } from '../../supabaseClient';
import {
    Eye, CheckCircle, XCircle, Clock, Truck, Trash2,
    ChevronDown, ChevronUp, Package, Calendar,
    CreditCard, MapPin, Phone, User, Loader2,
    CheckCircle2, AlertTriangle, X, Search, Filter,
    Printer, Download, ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react';

interface OrderItem {
    id: string;
    product_name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    customer_name: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    status: string;
    payment_method: string;
    created_at: string;
    items?: OrderItem[];
    note?: string;
}

interface Notification {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning';
}

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notification>({ show: false, message: '', type: 'success' });
    const [deleteModal, setDeleteModal] = useState<{ show: boolean, orderId: string | null }>({ show: false, orderId: null });

    // Filters & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchOrders();
    }, []);

    const showNotify = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedData = data?.map(order => ({
                ...order,
                items: order.order_items
            })) || [];

            setOrders(formattedData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            showNotify('Lỗi tải danh sách đơn hàng', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase.from('orders').update({ status }).eq('id', id);
            if (error) throw error;
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
            showNotify(`Đã cập nhật trạng thái đơn hàng`);
        } catch (error) {
            showNotify('Lỗi cập nhật trạng thái', 'error');
        }
    };

    const deleteOrder = async (id: string) => {
        try {
            const { error } = await supabase.from('orders').delete().eq('id', id);
            if (error) throw error;
            setOrders(orders.filter(o => o.id !== id));
            showNotify('Đã xóa đơn hàng thành công', 'warning');
            setDeleteModal({ show: false, orderId: null });
        } catch (error) {
            showNotify('Lỗi khi xóa đơn hàng', 'error');
        }
    };

    const handlePrintInvoice = (order: Order) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Hóa đơn #${order.id.slice(0, 8)}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
                    <style>
                        body { font-family: 'Outfit', sans-serif; padding: 40px; background: #fff; color: #1e293b; line-height: 1.5; font-size: 14px; }
                        * { box-sizing: border-box; }
                        .container { max-width: 800px; margin: 0 auto; }
                        
                        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; padding-bottom: 30px; border-bottom: 2px solid #f1f5f9; }
                        .logo { font-weight: 900; font-size: 28px; text-transform: uppercase; color: #000; letter-spacing: -1px; }
                        .logo span { color: #3b82f6; }
                        .invoice-tag { text-align: right; }
                        .invoice-title { font-size: 42px; font-weight: 900; color: #0f172a; line-height: 1; letter-spacing: -2px; margin-bottom: 5px; opacity: 0.1; text-transform: uppercase; }
                        .invoice-no { font-size: 16px; font-weight: 800; color: #3b82f6; }
                        
                        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                        .info-group h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin: 0 0 10px 0; font-weight: 800; }
                        .info-content { font-weight: 600; color: #334155; }
                        
                        table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 40px; }
                        th { text-align: left; padding: 15px 10px; border-bottom: 2px solid #e2e8f0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 800; }
                        td { padding: 20px 10px; border-bottom: 1px solid #f1f5f9; font-weight: 500; color: #334155; vertical-align: middle; }
                        tr:last-child td { border-bottom: none; }
                        
                        .total-section { display: flex; justify-content: flex-end; margin-top: 20px; }
                        .total-box { background: #f8fafc; padding: 30px; border-radius: 20px; width: 300px; }
                        .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 500; }
                        .total-row.final { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #0f172a; font-size: 18px; font-weight: 800; margin-bottom: 0; }
                        
                        .footer { margin-top: 80px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 40px; }
                        .thank-you { font-weight: 600; color: #3b82f6; margin-bottom: 10px; font-size: 14px; }
                        
                        @media print {
                            body { padding: 0; }
                            .total-box { background: #f1f5f9 !important; -webkit-print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">KIEN<span>DRONE</span></div>
                            <div class="invoice-tag">
                                <div class="invoice-title">INVOICE</div>
                                <div class="invoice-no">#${order.id.slice(0, 8).toUpperCase()}</div>
                                <div style="color: #64748b; font-size: 12px; font-weight: 600; margin-top: 5px;">${new Date(order.created_at).toLocaleDateString('vi-VN')}</div>
                            </div>
                        </div>

                        <div class="info-grid">
                            <div class="info-group">
                                <h3>Thông tin khách hàng</h3>
                                <div class="info-content">
                                    <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 5px;">${order.customer_name}</div>
                                    <div>${order.phone}</div>
                                    <div style="margin-top: 5px; color: #64748b;">${order.address}</div>
                                </div>
                            </div>
                            <div class="info-group" style="text-align: right;">
                                <h3>Đơn vị bán hàng</h3>
                                <div class="info-content">
                                    <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 5px;">KIEN DRONE SHOP</div>
                                    <div>0394.300.132</div>
                                    <div style="margin-top: 5px; color: #64748b;">Hà Nội, Việt Nam</div>
                                </div>
                            </div>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 50%;">Sản phẩm</th>
                                    <th style="width: 15%; text-align: center;">SL</th>
                                    <th style="width: 20%; text-align: right;">Đơn giá</th>
                                    <th style="width: 15%; text-align: right;">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.items?.map(item => `
                                    <tr>
                                        <td>
                                            <div style="font-weight: 700; color: #0f172a;">${item.product_name}</div>
                                        </td>
                                        <td style="text-align: center;">${item.quantity}</td>
                                        <td style="text-align: right;">${item.price.toLocaleString('vi-VN')}đ</td>
                                        <td style="text-align: right; font-weight: 700;">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>

                        <div class="total-section">
                            <div class="total-box">
                                <div class="total-row">
                                    <span>Tạm tính</span>
                                    <span>${Number(order.total).toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div class="total-row">
                                    <span>Phí vận chuyển</span>
                                    <span>0đ</span>
                                </div>
                                <div class="total-row final">
                                    <span>TỔNG CỘNG</span>
                                    <span style="color: #3b82f6;">${Number(order.total).toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>
                        </div>

                        <div class="footer">
                            <div class="thank-you">Cảm ơn bạn đã lựa chọn Kiên Drone!</div>
                            <div>Mọi thắc mắc xin vui lòng liên hệ hotline 0394.300.132</div>
                            <div style="margin-top: 5px; font-size: 10px;">hóa đơn điện tử được tạo tự động • kiendrone.com</div>
                        </div>
                    </div>
                    <script>
                        window.onload = function() { window.print(); }
                    </script>
                </body>
                </html>
            `;
            printWindow.document.write(htmlContent);
            printWindow.document.close();
        }
    };

    const handleExportCSV = () => {
        const headers = ["ID", "Khách hàng", "SĐT", "Ngày đặt", "Tổng tiền", "Trạng thái"];
        const rows = orders.map(o => [
            o.id,
            o.customer_name,
            o.phone,
            new Date(o.created_at).toLocaleDateString(),
            o.total,
            o.status
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filter Logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.phone.includes(searchTerm);

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <span className="status-badge status-success bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-2 w-fit font-bold text-[10px] uppercase tracking-widest"><CheckCircle size={14} /> Hoàn thành</span>;
            case 'cancelled': return <span className="status-badge status-danger bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1.5 rounded-xl flex items-center gap-2 w-fit font-bold text-[10px] uppercase tracking-widest"><XCircle size={14} /> Đã hủy</span>;
            case 'processing': return <span className="status-badge status-info bg-sky-50 text-sky-600 border border-sky-100 px-3 py-1.5 rounded-xl flex items-center gap-2 w-fit font-bold text-[10px] uppercase tracking-widest"><Truck size={14} /> Đang giao</span>;
            default: return <span className="status-badge status-warning bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1.5 rounded-xl flex items-center gap-2 w-fit font-bold text-[10px] uppercase tracking-widest"><Clock size={14} /> Chờ xử lý</span>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            {/* NOTIFICATION TOAST */}
            {notification.show && (
                <div className="fixed top-24 right-8 z-[1000] animate-toast-in">
                    <div className={`flex items-center gap-4 p-4 rounded-2xl shadow-2xl border bg-white ${notification.type === 'success' ? 'border-emerald-100' : notification.type === 'error' ? 'border-rose-100' : 'border-amber-100'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-600' : notification.type === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                            {notification.type === 'success' && <CheckCircle2 size={24} />}
                            {notification.type === 'error' && <XCircle size={24} />}
                            {notification.type === 'warning' && <AlertTriangle size={24} />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Thông báo</p>
                            <p className="text-[12px] font-bold text-slate-900 leading-tight">{notification.message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setDeleteModal({ show: false, orderId: null })} />
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 border border-slate-100">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Xóa đơn hàng?</h3>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed px-4">
                                Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex flex-col gap-3 pt-6">
                                <button onClick={() => deleteOrder(deleteModal.orderId!)} className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-600/20 hover:bg-rose-700 active:scale-95 transition-all">Xác nhận xóa</button>
                                <button onClick={() => setDeleteModal({ show: false, orderId: null })} className="w-full py-4 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 rounded-2xl transition-all">Hủy bỏ</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng đơn</p>
                        <p className="text-2xl font-black text-slate-900">{orders.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Package size={20} /></div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chờ xử lý</p>
                        <p className="text-2xl font-black text-amber-600">{orders.filter(o => o.status === 'pending').length}</p>
                    </div>
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><Clock size={20} /></div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Doanh thu</p>
                        <p className="text-xl font-black text-emerald-600">{orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0).toLocaleString('vi-VN')}đ</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle size={20} /></div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors" onClick={handleExportCSV}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center"><Download size={20} /></div>
                        <p className="text-xs font-bold text-slate-600">Xuất Excel</p>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <Search size={16} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm tên, SĐT, mã đơn..."
                        className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
                        {['all', 'pending', 'processing', 'completed', 'cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${statusFilter === status ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {status === 'all' ? 'Tất cả' : status === 'pending' ? 'Mới' : status === 'processing' ? 'Đang giao' : status === 'completed' ? 'Xong' : 'Hủy'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="w-10 text-center">#</th>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Thanh toán</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="py-24">
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="animate-spin text-blue-600" size={32} />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : paginatedOrders.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-24 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <Package className="text-slate-200" size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Không tìm thấy đơn hàng</p>
                                </td>
                            </tr>
                        ) : (
                            paginatedOrders.map((order) => (
                                <React.Fragment key={order.id}>
                                    <tr className={`group transition-colors border-b border-slate-50 hover:bg-slate-50/50 ${expandedOrderId === order.id ? 'bg-blue-50/30' : ''}`}>
                                        <td className="text-center w-10">
                                            <button
                                                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                                className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${expandedOrderId === order.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 rotate-180' : 'text-slate-300 hover:bg-slate-100'}`}
                                            >
                                                <ChevronDown size={14} />
                                            </button>
                                        </td>
                                        <td className="py-4">
                                            <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">#{order.payment_method?.split('_')[1] || order.id.slice(0, 6)}</span>
                                        </td>
                                        <td className="py-4">
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 line-clamp-1">{order.customer_name}</p>
                                                <p className="text-[10px] font-medium text-slate-400">{order.phone}</p>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="text-[10px] font-medium text-slate-500">
                                                <p>{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                                                <p className="text-slate-400">{new Date(order.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{order.payment_method?.split('_')[0] === 'cod' ? 'COD' : order.payment_method?.split('_')[0] === 'bank' ? 'CK' : 'MOMO'}</span>
                                        </td>
                                        <td className="py-4">
                                            <span className="text-xs font-black text-blue-600">{Number(order.total).toLocaleString('vi-VN')}đ</span>
                                        </td>
                                        <td className="py-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <select
                                                    className="bg-transparent text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer hover:text-blue-600 transition-colors"
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                                >
                                                    <option value="pending">Mới</option>
                                                    <option value="processing">Giao</option>
                                                    <option value="completed">Xong</option>
                                                    <option value="cancelled">Hủy</option>
                                                </select>
                                                <div className="h-4 w-px bg-slate-200"></div>
                                                <button onClick={() => handlePrintInvoice(order)} className="text-slate-400 hover:text-blue-600 transition-colors" title="In hóa đơn"><Printer size={14} /></button>
                                                <button onClick={() => setDeleteModal({ show: true, orderId: order.id })} className="text-slate-400 hover:text-rose-600 transition-colors" title="Xóa"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Detail View */}
                                    {expandedOrderId === order.id && (
                                        <tr className="bg-blue-50/20">
                                            <td colSpan={8} className="p-0 border-b border-blue-100/50">
                                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="space-y-4">
                                                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2"><MapPin size={12} /> Giao hàng</h5>
                                                        <div className="bg-white p-4 rounded-2xl border border-slate-100 text-xs">
                                                            <p><strong>Địa chỉ:</strong> {order.address}</p>
                                                            <p className="mt-2 text-slate-500"><strong>Ghi chú:</strong> {order.note || 'Không có ghi chú'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2"><Package size={12} /> Sản phẩm</h5>
                                                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                                                            {order.items?.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between items-center p-3 border-b border-slate-50 last:border-0 text-xs hover:bg-slate-50">
                                                                    <div className="font-medium text-slate-700">{item.product_name} <span className="text-slate-400">x{item.quantity}</span></div>
                                                                    <div className="font-bold text-slate-900">{(item.price * item.quantity).toLocaleString()}đ</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-4">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs font-bold text-slate-500">Trang {currentPage} / {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderList;
