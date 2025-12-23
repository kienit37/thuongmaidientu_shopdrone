
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSupabase as supabase } from '../../supabaseClient';
import { Lock, Mail, Loader2, ShieldCheck, ChevronRight } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message === 'Invalid login credentials' ? 'Email hoặc mật khẩu không chính xác' : authError.message);
            setLoading(false);
            return;
        }

        if (user) {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profileError || profile?.role !== 'admin') {
                await supabase.auth.signOut();
                setError('Tài khoản không có quyền truy cập quản trị.');
                setLoading(false);
                return;
            }

            navigate('/admin');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Abstract Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-[480px] z-10 animate-in fade-in zoom-in-95 duration-700">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-600/40 mb-8 border border-white/10">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-3">
                        Kiên Drone <span className="text-blue-500">Admin</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Hệ thống quản trị trung tâm</p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative">
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-[11px] font-bold mb-8 flex items-center gap-3 animate-in slide-in-from-top-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tài khoản Admin</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white/10 transition-all placeholder:text-slate-600"
                                    placeholder="admin@kiendrone.vn"
                                />
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mật khẩu bảo mật</label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white/10 transition-all placeholder:text-slate-600"
                                    placeholder="••••••••"
                                />
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 group disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    Truy cập hệ thống
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Secure Access • KIEN DRONE Dashboard</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
