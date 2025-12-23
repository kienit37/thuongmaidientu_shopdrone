import React, { useState, useEffect } from 'react';

import { useCart } from '../CartContext';
import { CreditCard, Wallet, ArrowLeft, CheckCircle2, User, Package, ChevronRight, Smartphone, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', address: '', paymentMethod: 'cod' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [phoneWarning, setPhoneWarning] = useState('');


  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + (subtotal > 10000000 ? 0 : 50000);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        // Pre-fill from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFormData(prev => ({
            ...prev,
            fullName: profile.full_name || '',
            phone: profile.phone || '',
            email: user.email || '',
            address: profile.address || ''
          }));
        } else {
          setFormData(prev => ({ ...prev, email: user.email || '' }));
        }
      }
      setAuthLoading(false);
    };
    checkUser();
  }, []);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      // Generate short order code (6 digits)
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setOrderCode(code);

      // 1. Create Order with user_id
      // We append the code to payment_method to save it: e.g. "momo_123456"
      const paymentMethodValue = `${formData.paymentMethod}_${code}`;

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            total: total,
            status: 'pending',
            payment_method: paymentMethodValue,
            user_id: userId,
          },
        ])
        .select()
        .single();
      if (orderError) throw orderError;
      setOrderId(orderData.id);

      // 2. Create Order Items
      const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: isUUID(item.id) ? item.id : null,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 3. Logic based on payment method
      if (formData.paymentMethod === 'cod') {
        clearCart();
        setStep(3);
      } else {
        // Show QR Code Modal
        setShowPaymentModal(true);
      }

    } catch (err: any) {
      console.error('Lỗi đặt hàng:', err);
      setError(err.message || 'Hệ thống đang bận. Vui lòng thử lại sau giây lát.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    clearCart();
    setStep(3);
  };

  const paymentMethods = [
    {
      id: 'cod',
      label: 'Giao hàng thu tiền (COD)',
      desc: 'Thanh toán khi nhận hàng',
      logo: null,
      icon: Package
    },
    {
      id: 'bank',
      label: 'Chuyển khoản ngân hàng',
      desc: 'VietQR - Xác nhận tự động',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDD-5brTjlafAEn-q-67NhLAcsts2PXuHyWw&s',
      icon: null
    },
    {
      id: 'momo',
      label: 'Ví điện tử MoMo',
      desc: 'Siêu ứng dụng thanh toán',
      logo: 'https://img.mservice.com.vn/app/img/portal_documents/mini-app_design-guideline_branding-guide-2-2.png',
      icon: null
    },
  ];

  const renderPaymentMethods = () => (
    <div className="space-y-3">
      {paymentMethods.map(method => {
        const isSelected = formData.paymentMethod === method.id;
        return (
          <label
            key={method.id}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${isSelected ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'bg-white border-slate-200 hover:border-slate-300'}`}
          >
            <input
              type="radio"
              name="payment"
              className="hidden"
              onChange={() => setFormData({ ...formData, paymentMethod: method.id })}
              checked={isSelected}
            />

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white border border-slate-100 p-2`}>
              {method.logo ? (
                <img src={method.logo} className="w-full h-full object-contain" alt={method.label} />
              ) : (
                <method.icon size={24} className="text-blue-600" />
              )}
            </div>

            <div className="flex-grow">
              <p className={`text-sm font-bold ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{method.label}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{method.desc}</p>
            </div>

            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
              {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </label>
        );
      })}
    </div>
  );

  if (authLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (!userId) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 text-center space-y-10">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-lg">
            <User size={40} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Bạn chưa đăng nhập</h2>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[280px] mx-auto">
              Vui lòng đăng nhập hoặc đăng ký tài khoản để tiếp tục thanh toán và nhận các ưu đãi hấp dẫn.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate('/login?redirect=checkout')}
              className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
            >
              Đăng nhập ngay
            </button>
            {/* ... */}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={14} /> Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Success Step
  if (step === 3) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 text-center space-y-10 animate-in zoom-in duration-500">
        <div className="relative">
          <div className="w-28 h-28 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 rotate-12 animate-in slide-in-from-top-4 duration-700">
            <CheckCircle2 className="w-14 h-14 text-white -rotate-12" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white font-black text-xs animate-bounce">
            VIP
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Đặt hàng thành công!</h1>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-sm mx-auto">
            Cảm ơn bạn đã tin tưởng KIÊN DRONE. Đơn hàng #{orderId} của bạn đang được xử lý.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-3">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Trạng thái</span>
            <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Đã xác nhận</span>
          </div>
          <div className="flex justify-between items-center text[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Thanh toán</span>
            <span className="text-slate-900 font-bold">{formData.paymentMethod === 'cod' ? 'COD' : (formData.paymentMethod === 'momo' ? 'MOMO' : 'CHUYỂN KHOẢN')}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/my-orders')}
            className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20"
          >
            Xem lịch sử đơn hàng
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-5 bg-white text-slate-400 hover:text-slate-900 rounded-3xl font-black text-xs uppercase tracking-widest transition-all"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );

  if (cart.length === 0 && step === 1) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <Package size={64} className="text-slate-200" />
        <p className="text-slate-500 font-bold">Giỏ hàng cúa bạn đang trống</p>
        <button onClick={() => navigate('/')} className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all">Mua sắm ngay</button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 relative">
      {/* QR Code Modal for Bank/MoMo */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowPaymentModal(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"><ChevronRight className="rotate-90" size={20} /></button>

            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Thanh toán đơn hàng</h3>
                <p className="text-sm text-slate-500 font-medium">Vui lòng quét mã QR bên dưới để thanh toán</p>
              </div>

              <div className="bg-white p-4 rounded-3xl border-2 border-dashed border-blue-200 shadow-inner inline-block relative group">
                {formData.paymentMethod === 'bank' ? (
                  <img
                    src={`https://img.vietqr.io/image/MB-0394300132-compact2.png?amount=${total}&addInfo=KIENDRONE-${orderCode}&accountName=KIEN DRONE`}
                    className="w-64 h-64 object-contain rounded-xl"
                    alt="VietQR Bank Transfer"
                  />
                ) : (
                  <div className="relative">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(`https://me.momo.vn/0394300132?amount=${total}&message=KIENDRONE-${orderCode}`)}`}
                      className="w-64 h-64 object-contain rounded-xl"
                      alt="MoMo Payment QR"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-sm py-1 border-t border-dashed border-slate-200">
                      <p className="text-[10px] font-bold text-center text-pink-600 uppercase">Quét bằng App MoMo</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1 text-center">Nội dung chuyển khoản</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-black text-slate-900 tracking-tight select-all">KIENDRONE-{orderCode}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm font-bold border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Số tiền cần thanh toán:</span>
                  <span className="text-blue-600 text-lg">{total.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <button
                onClick={handlePaymentSuccess}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
              >
                Tôi đã thanh toán
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => navigate('/cart')} className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"><ArrowLeft size={18} /></button>
        <h1 style={{ marginTop: '20px' }} className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Hoàn tất thanh toán</h1>
      </div>

      <form onSubmit={handleOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-12">
          <section className="space-y-8">
            <h3 className="text-xs font-black text-blue-700 uppercase tracking-[0.3em] flex items-center gap-3"><User size={18} /> 01. Thông tin giao hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={e => {
                    const val = e.target.value;
                    if (/[^0-9]/.test(val)) {
                      setPhoneWarning('Vui lòng chỉ nhập số');
                    } else {
                      setPhoneWarning('');
                    }
                    const cleanVal = val.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, phone: cleanVal });
                  }}
                  className={`w-full bg-white border rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all ${phoneWarning ? 'border-rose-300 focus:border-rose-500 text-rose-500' : 'border-slate-200 focus:border-blue-500'}`}
                  placeholder="098....."
                />
                {phoneWarning && <p className="text-[10px] text-rose-500 font-bold ml-2 animate-pulse">{phoneWarning}</p>}
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none transition-all"
                  placeholder="email@vi-du.com"
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ nhận hàng</label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="Số nhà, đường, phường/xã..."
                ></textarea>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <h3 className="text-xs font-black text-blue-700 uppercase tracking-[0.3em] flex items-center gap-3"><Wallet size={18} /> 02. Phương thức thanh toán</h3>
            <div className="space-y-3">
              {renderPaymentMethods()}
            </div>

          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl sticky top-36 space-y-8 overflow-hidden">
            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">Chi tiết đơn hàng</h3>
            <div className="space-y-5 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center border-b border-slate-50 pb-4 last:border-0">
                  <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0"><img src={item.image} className="w-full h-full object-cover" /></div>
                  <div className="flex-grow space-y-1">
                    <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{item.name}</p>
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>x{item.quantity}</span>
                      <span className="text-slate-900">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest"><span>Tạm tính</span><span className="text-slate-900">{subtotal.toLocaleString('vi-VN')}đ</span></div>
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest"><span>Phí vận chuyển</span><span className="text-emerald-600">Miễn phí</span></div>
              <div className="p-6 bg-slate-900 rounded-3xl flex justify-between items-center text-white shadow-xl shadow-slate-900/20">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Tổng cộng</span>
                <span className="text-3xl font-black tracking-tighter">{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-[10px] font-bold flex items-start gap-2 border border-rose-100 animate-in slide-in-from-top-2">
                <div className="w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-[9px]">!</div>
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Xác nhận thanh toán <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

