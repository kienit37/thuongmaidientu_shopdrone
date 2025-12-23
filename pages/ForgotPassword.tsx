
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Mail, Loader2, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Một liên kết đặt lại mật khẩu đã được gửi đến email của bạn.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen pt-32 pb-12 flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                <div className="text-center mb-10">
                    <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-6 font-bold text-[10px] uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} /> Quay lại đăng nhập
                    </Link>
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <KeyRound size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Quên mật khẩu?</h1>
                    <p className="text-slate-500 font-medium text-xs">Nhập email của bạn để nhận liên kết đặt lại mật khẩu</p>
                </div>

                {error && (
                    <div className="bg-rose-50 text-rose-600 p-5 rounded-3xl text-[11px] font-bold mb-8 flex items-start gap-3 border border-rose-100 animate-in slide-in-from-top-2">
                        <div className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">!</div>
                        <p className="leading-relaxed">{error}</p>
                    </div>
                )}

                {message ? (
                    <div className="text-center space-y-8 py-4 animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 rotate-6">
                            <CheckCircle2 className="w-10 h-10 text-white -rotate-6" />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Đã gửi Email!</h2>
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                                {message}
                            </p>
                        </div>
                        <button
                            onClick={() => setMessage(null)}
                            className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:text-blue-700 transition-colors"
                        >
                            Thử lại với email khác
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email của bạn</label>
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {loading ? 'Đang gửi yêu cầu...' : 'Gửi liên kết xác thực'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
