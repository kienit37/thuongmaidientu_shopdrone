
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Mail, Lock, Loader2, ArrowLeft, User, CheckCircle2 } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.fullName,
                    phone: formData.phone
                }
            }
        });

        if (authError) {
            let userFriendlyMsg = authError.message;
            if (authError.message.includes('User already registered')) {
                userFriendlyMsg = 'Email này đã được sử dụng bởi một tài khoản khác. Vui lòng sử dụng email khác hoặc đăng nhập.';
            } else if (authError.message.includes('Password should be at least 6 characters')) {
                userFriendlyMsg = 'Mật khẩu phải có ít nhất 6 ký tự.';
            } else if (authError.message.includes('Unable to validate email address')) {
                userFriendlyMsg = 'Định dạng email không hợp lệ.';
            }
            setError(userFriendlyMsg);
            setLoading(false);
        } else {
            setIsSuccess(true);
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen pt-32 pb-12 flex items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 text-center space-y-8 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Kiểm tra Email!</h2>
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                            Chúng tôi đã gửi một liên kết xác thực đến <span className="text-blue-600">{formData.email}</span>.
                            Vui lòng kiểm tra hộp thư (và cả thư rác) để kích hoạt tài khoản trước khi đăng nhập.
                        </p>
                    </div>
                    <Link to="/login" className="inline-block w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all">
                        Quay lại Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-12 flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-6 font-bold text-[10px] uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} /> Quay lại trang chủ
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Đăng ký mới</h1>
                    <p className="text-slate-500 font-medium text-xs">Trở thành thành viên của KIÊN DRONE</p>
                </div>

                {error && (
                    <div className="bg-rose-50 text-rose-600 p-5 rounded-3xl text-[11px] font-bold mb-8 flex items-start gap-3 border border-rose-100 animate-in slide-in-from-top-2">
                        <div className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">!</div>
                        <p className="leading-relaxed">{error}</p>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Họ và tên</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                placeholder="Nguyễn Văn A"
                            />
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                minLength={6}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                placeholder="Ít nhất 6 ký tự"
                            />
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 mt-4"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs font-bold text-slate-500">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-2">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );

};

export default Register;
