
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Mail, Lock, Loader2, ArrowLeft, User } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            let userFriendlyMsg = error.message;
            if (error.message.includes('Invalid login credentials')) {
                userFriendlyMsg = 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.';
            } else if (error.message.includes('Email not confirmed')) {
                userFriendlyMsg = 'Vui lòng xác nhận email của bạn trước khi đăng nhập.';
            }
            setError(userFriendlyMsg);
            setLoading(false);
        } else {
            const redirect = searchParams.get('redirect');
            navigate(redirect === 'checkout' ? '/checkout' : '/');
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-12 flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-6 font-bold text-[10px] uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} /> Quay lại trang chủ
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Đăng nhập</h1>
                    <p className="text-slate-500 font-medium text-xs">Chào mừng bạn quay trở lại với KIÊN DRONE</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold mb-6 flex items-center gap-2 border border-red-100">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                placeholder="name@example.com"
                            />
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mật khẩu</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                placeholder="••••••••"
                            />
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        <div className="flex justify-end px-1">
                            <Link to="/forgot-password" virtual-id="forgot-password-link" className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Đang xử lý...' : 'Đăng nhập ngay'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs font-bold text-slate-500">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-2">
                            Đăng ký miễn phí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
