
import React, { useEffect, useState } from 'react';
import { adminSupabase as supabase } from '../../supabaseClient';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut,
    Menu, BookOpen, Newspaper, FileText, Image as ImageIcon, Loader2, ShieldCheck,
    Bell, Search, User as UserIcon, ChevronDown, Github, Tag as TagIcon, Percent
} from 'lucide-react';
import '../../admin.css';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const checkAdmin = async (currentSession: any) => {
            if (!currentSession) {
                setLoading(false);
                navigate('/admin/login');
                return;
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', currentSession.user.id)
                .single();

            if (error || profile?.role !== 'admin') {
                console.error("Access denied: Not an admin", error);
                await supabase.auth.signOut();
                navigate('/admin/login');
            } else {
                setIsAdmin(true);
            }
            setLoading(false);
        };

        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            setSession(currentSession);
            checkAdmin(currentSession);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            setSession(currentSession);
            if (!currentSession) {
                navigate('/admin/login');
            } else {
                checkAdmin(currentSession);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a]">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/30 mb-8 animate-bounce">
                <ShieldCheck className="text-white" size={32} />
            </div>
            <p className="text-white font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Đang bảo mật hệ thống...</p>
        </div>
    );

    if (!session || !isAdmin) return null;

    const navItems = [
        { name: 'Tổng quan', path: '/admin', icon: LayoutDashboard },
        { name: 'Sản phẩm', path: '/admin/products', icon: Package },
        { name: 'Khuyến mãi', path: '/admin/discounts', icon: Percent },
        { name: 'Đơn hàng', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Phân quyền', path: '/admin/users', icon: ShieldCheck },
        { divider: true },
        { name: 'Bài viết (Blog)', path: '/admin/blogs', icon: Newspaper },
        { name: 'Hướng dẫn', path: '/admin/guides', icon: BookOpen },
        { divider: true },
        { name: 'Giao diện (Slide)', path: '/admin/banners', icon: ImageIcon },
        { name: 'Trang tĩnh', path: '/admin/pages', icon: FileText },
    ];

    const currentRouteName = navItems.find(s => s.path === location.pathname)?.name || 'Quản lý';

    return (
        <div className="admin-container">
            {/* Sidebar with CSS Class Logic */}
            <aside className={`admin-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
                <div className={`admin-logo transition-all duration-300 ${!isSidebarOpen ? 'p-6 flex justify-center' : 'p-10'}`}>
                    <span className="text-xl">ADMIN</span>
                    {isSidebarOpen && <span className="text-white ml-2">PRO</span>}
                </div>

                <div className={`px-8 mb-6 transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0 pointer-events-none'}`}>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Hệ thống</p>
                </div>

                <nav className="admin-nav">
                    {navItems.map((item, idx) => (
                        item.divider ? (
                            <div key={`div-${idx}`} className={`my-4 border-t border-white/5 mx-4 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} />
                        ) : (
                            <Link
                                key={item.path}
                                to={item.path}
                                data-tooltip={item.name}
                                className={`admin-nav-item ${location.pathname === item.path || (location.pathname.startsWith(item.path + '/') && item.path !== '/admin') ? 'active' : ''} ${!isSidebarOpen ? 'justify-center p-4' : ''}`}
                            >
                                <item.icon size={20} />
                                {isSidebarOpen && <span className="animate-in fade-in duration-300 text-sm whitespace-nowrap">{item.name}</span>}
                            </Link>
                        )
                    ))}
                </nav>

                <div className={`p-8 border-t border-white/5 mt-auto transition-all ${!isSidebarOpen ? 'flex justify-center p-6' : ''}`}>
                    <button onClick={handleLogout} data-tooltip="Thoát hệ thống" className={`admin-nav-item w-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 ${!isSidebarOpen ? 'p-0 justify-center bg-transparent border-none' : ''}`}>
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Thoát hệ thống</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content with CSS Class Logic */}
            <main className={`admin-main ${!isSidebarOpen ? 'collapsed' : ''}`}>
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm border border-slate-100 transition-all active:scale-95 ${!isSidebarOpen ? 'ring-2 ring-blue-100' : ''}`}
                        >
                            <Menu size={20} />
                        </button>
                        <div className="admin-title-group">
                            <p>Dashboard Center</p>
                            <h1>{currentRouteName}</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center bg-white rounded-2xl border border-slate-100 px-4 py-2.5 shadow-sm group focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                            <Search size={18} className="text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                            <input type="text" placeholder="Tìm kiếm hệ thống..." className="bg-transparent border-none outline-none ml-3 text-xs font-bold text-slate-600 w-40" />
                        </div>

                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm border border-slate-100 relative cursor-pointer active:scale-95 transition-all">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                        </div>

                        <div className="hidden sm:flex items-center gap-4 pl-4 border-l border-slate-200">
                            <div className="flex flex-col items-end">
                                <p className="text-[11px] font-black text-slate-900 leading-none">{session.user.email?.split('@')[0].toUpperCase()}</p>
                                <p className="text-[9px] font-bold text-emerald-500 leading-none mt-1 uppercase tracking-widest">Master Admin</p>
                            </div>
                            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-blue-600/20 border-2 border-white">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-content-wrapper animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Outlet />
                </div>

                <footer className="mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2025 KIÊN DRONE • All rights reserved</p>
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest">Về trang chủ</Link>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Version 2.0.4 Premium</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default AdminLayout;
