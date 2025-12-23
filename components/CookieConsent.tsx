
import React, { useState, useEffect } from 'react';
import { CookieManager } from '../utils/CookieManager';
import { Shield, X, Check } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = CookieManager.get('cookie_consent');
        if (!consent) {
            setTimeout(() => setIsVisible(true), 2000);
        }
    }, []);

    const handleAccept = () => {
        CookieManager.set('cookie_consent', 'accepted', 365);
        setIsVisible(false);
    };

    const handleDecline = () => {
        CookieManager.set('cookie_consent', 'declined', 365);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-[95%] max-w-2xl animate-in slide-in-from-bottom duration-700">
            <div className="bg-white/80 backdrop-blur-2xl border border-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Shield size={32} />
                </div>

                <div className="flex-grow space-y-2 text-center md:text-left">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Cookie & Quyền riêng tư</h3>
                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                        Chúng tôi sử dụng cookie để cải thiện trải nghiệm của bạn, phân tích lưu lượng truy cập và tối ưu hóa hiệu suất website. Bằng cách tiếp tục, bạn đồng ý với chính sách bảo mật của chúng tôi.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleDecline}
                        className="flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all border border-slate-100"
                    >
                        Từ chối
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
                    >
                        Chấp nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
