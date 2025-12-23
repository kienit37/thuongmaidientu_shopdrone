
import React, { useEffect, useState } from 'react';
import { adminSupabase as supabase } from '../../supabaseClient';
import { User, Mail, Phone, MapPin, Calendar, Trash2, ShieldCheck, Search, Loader2, Shield, UserCog, CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';

interface Profile {
    id: string;
    full_name: string;
    phone: string;
    address: string;
    created_at: string;
    avatar_url: string;
    role: string;
}

interface Notification {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning';
}

interface ModalState {
    show: boolean;
    type: 'delete' | 'role' | null;
    userData: Profile | null;
}

const UserList = () => {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notification>({ show: false, message: '', type: 'success' });
    const [modal, setModal] = useState<ModalState>({ show: false, type: null, userData: null });

    useEffect(() => {
        fetchUsers();
    }, []);

    const showNotify = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            showNotify('Lỗi tải danh sách người dùng', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAction = async () => {
        if (!modal.userData || !modal.type) return;

        const user = modal.userData;
        setUpdatingId(user.id);
        const actionType = modal.type;
        setModal({ ...modal, show: false });

        try {
            if (actionType === 'role') {
                const newRole = user.role === 'admin' ? 'user' : 'admin';
                const { error } = await supabase
                    .from('profiles')
                    .update({ role: newRole })
                    .eq('id', user.id);

                if (error) throw error;
                setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
                showNotify(`Đã chuyển ${user.full_name} thành ${newRole.toUpperCase()}`);
            } else if (actionType === 'delete') {
                const { error } = await supabase.rpc('delete_user_by_id', { user_id: user.id });

                if (error) throw error;
                setUsers(users.filter(u => u.id !== user.id));
                showNotify('Đã xóa vĩnh viễn tài khoản và hồ sơ người dùng', 'warning');
            }
        } catch (error) {
            showNotify('Thao tác thất bại. Vui lòng thử lại.', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const openModal = (type: 'delete' | 'role', user: Profile) => {
        setModal({ show: true, type, userData: user });
    };

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            {/* PREMIUN NOTIFICATION TOAST */}
            {notification.show && (
                <div className="fixed top-24 right-8 z-[1000] animate-toast-in">
                    <div className={`flex items-center gap-4 p-4 rounded-2xl shadow-2xl border ${notification.type === 'success' ? 'bg-white border-emerald-100' :
                        notification.type === 'error' ? 'bg-white border-rose-100' :
                            'bg-white border-amber-100'
                        }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                            notification.type === 'error' ? 'bg-rose-50 text-rose-600' :
                                'bg-amber-50 text-amber-600'
                            }`}>
                            {notification.type === 'success' && <CheckCircle2 size={24} />}
                            {notification.type === 'error' && <XCircle size={24} />}
                            {notification.type === 'warning' && <AlertTriangle size={24} />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hệ thống</p>
                            <p className="text-[12px] font-bold text-slate-900 leading-tight">{notification.message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* CUSTOM PREMIUM CONFIRM MODAL */}
            {modal.show && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setModal({ ...modal, show: false })} />
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 border border-slate-100">
                        <button
                            onClick={() => setModal({ ...modal, show: false })}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center space-y-4">
                            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 ${modal.type === 'delete' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                {modal.type === 'delete' ? <Trash2 size={40} /> : <UserCog size={40} />}
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                                {modal.type === 'delete' ? 'Xác nhận xóa?' : 'Đổi quyền hạn?'}
                            </h3>

                            <p className="text-sm font-medium text-slate-500 leading-relaxed px-4">
                                {modal.type === 'delete'
                                    ? `Bạn có chắc chắn muốn xóa vĩnh viễn hồ sơ của khách hàng ${modal.userData?.full_name}? Hành động này không thể hoàn tác.`
                                    : `Bạn muốn chuyển ${modal.userData?.full_name} sang quyền ${modal.userData?.role === 'admin' ? 'USER' : 'ADMIN'}?`}
                            </p>

                            <div className="flex flex-col gap-3 pt-6">
                                <button
                                    onClick={handleConfirmAction}
                                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl ${modal.type === 'delete'
                                        ? 'bg-red-600 text-white shadow-red-600/20 hover:bg-red-700'
                                        : 'bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700'
                                        }`}
                                >
                                    Xác nhận thực hiện
                                </button>
                                <button
                                    onClick={() => setModal({ ...modal, show: false })}
                                    className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-50 transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3 max-w-2xl">
                    <Shield className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                        <p className="text-[11px] font-bold text-amber-900 uppercase tracking-tight">Lưu ý bảo mật</p>
                        <p className="text-[10px] text-amber-700 font-medium leading-relaxed mt-1">
                            Mật khẩu người dùng luôn được mã hóa. Bạn chỉ có thể quản lý quyền hạn (Role) và thông tin hồ sơ tại đây.
                        </p>
                    </div>
                </div>
                <div className="relative group self-end">
                    <input
                        type="text"
                        placeholder="Tìm theo tên, sđt..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input pl-12 pr-4 w-full md:w-80"
                    />
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
                    </div>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Khách hàng</th>
                                <th>Quyền hạn</th>
                                <th>Liên hệ</th>
                                <th>Địa chỉ</th>
                                <th>Ngày tham gia</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u.id}>
                                    <td>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100/50 flex-shrink-0">
                                                {u.avatar_url ? (
                                                    <img src={u.avatar_url} className="w-full h-full rounded-2xl object-cover" />
                                                ) : (
                                                    <User size={18} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{u.full_name || 'Chưa cập nhật'}</p>
                                                <p className="text-[9px] text-slate-400 font-bold font-mono">ID: {u.id.substring(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center">
                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.role === 'admin'
                                                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                }`}>
                                                {u.role || 'user'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="space-y-1">
                                            {u.phone && <p className="text-[11px] font-bold text-slate-700 flex items-center gap-2"><Phone size={12} className="text-blue-500" /> {u.phone}</p>}
                                            <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-2"><Mail size={12} /> Tài khoản hệ thống</p>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="text-[11px] font-bold text-slate-600 max-w-[150px] truncate">
                                            <MapPin size={12} className="inline mr-1.5 text-slate-400" />
                                            {u.address || 'Chưa cung cấp'}
                                        </p>
                                    </td>
                                    <td>
                                        <p className="text-[11px] font-bold text-slate-500 flex items-center gap-2">
                                            <Calendar size={12} className="text-slate-400" />
                                            {new Date(u.created_at).toLocaleDateString('vi-VN')}
                                        </p>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openModal('role', u)}
                                                disabled={updatingId === u.id}
                                                title="Đổi quyền hạn"
                                                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                                            >
                                                {updatingId === u.id ? <Loader2 size={16} className="animate-spin" /> : <UserCog size={16} />}
                                            </button>
                                            <button
                                                onClick={() => openModal('delete', u)}
                                                className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="py-24 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <Search className="text-slate-200" size={24} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Không tìm thấy khách hàng nào</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserList;
