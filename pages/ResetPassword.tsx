
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Lock, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        // Handle the session from the recovery link
        const checkInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            // If already has session and it's a recovery flow (hash contains type=recovery)
            if (session && (window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token'))) {
                setVerifying(false);
                return;
            }

            // If no session but hash exists, Supabase client might be still parsing it
            if (window.location.hash.includes('access_token')) {
                // Wait for the auth change event instead of doing another check immediately
                return;
            }

            // If no session and NO hash with token, then it's invalid
            if (!session && !window.location.hash.includes('access_token')) {
                setError('Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.');
                setVerifying(false);
            }
        };

        checkInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Auth Event in ResetPassword:", event);
            if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && window.location.hash.includes('type=recovery'))) {
                setVerifying(false);
                setError(null);
            }
        });

        // Fail-safe: if after 5 seconds still verifying, show error
        const timeout = setTimeout(() => {
            if (verifying && !error) {
                setError('Không thể xác thực liên kết. Vui lòng thử lại.');
                setVerifying(false);
            }
        }, 5000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp.');
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            // Also sign out after password change for security
            await supabase.auth.signOut();
            setTimeout(() => navigate('/login'), 3000);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center bg-slate-50 px-4">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Đang xác thực liên kết...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-12 flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Mật khẩu mới</h1>
                    <p className="text-slate-500 font-medium text-xs">Hãy nhập mật khẩu mới bảo mật nhất cho bạn</p>
                </div>

                {error && (
                    <div className="bg-rose-50 text-rose-600 p-5 rounded-3xl text-[11px] font-bold mb-8 flex items-start gap-3 border border-rose-100 animate-in slide-in-from-top-2">
                        <ShieldAlert size={20} className="flex-shrink-0" />
                        <p className="leading-relaxed">{error}</p>
                    </div>
                )}

                {success ? (
                    <div className="text-center space-y-6 py-4">
                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <CheckCircle2 size={32} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-slate-900">Thành công!</h2>
                            <p className="text-xs text-slate-500 font-medium">Mật khẩu đã được đổi. Vui lòng đăng nhập lại với mật khẩu mới.</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mật khẩu mới</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                    placeholder="••••••••"
                                />
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nhập lại mật khẩu</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                    placeholder="••••••••"
                                />
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {loading ? 'Đang cập nhật...' : 'Xác nhận đổi mật khẩu'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
