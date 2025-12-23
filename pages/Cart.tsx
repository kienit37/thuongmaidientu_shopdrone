
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, ChevronLeft } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 10000000 ? 0 : 50000;
  const total = subtotal + shipping;

  if (cart.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-8">
      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
        <ShoppingBag className="w-10 h-10 text-slate-300" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 uppercase italic">Giỏ hàng trống</h2>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Có vẻ bạn chưa chọn được sản phẩm ưng ý</p>
      </div>
      <Link to="/" className="inline-flex items-center gap-2 px-10 py-4 bg-[#243a8c] text-white rounded-full font-black uppercase text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20">
        Bắt đầu mua sắm <ArrowRight size={16} />
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => navigate('/')} className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm text-slate-400">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic leading-none">Giỏ hàng</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Bạn có {cart.length} sản phẩm</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-shadow">
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
              </div>

              <div className="flex-grow space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${item.condition.includes('Mới') ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {item.condition.includes('Mới') ? 'Hàng Mới' : 'Đã qua sử dụng'}
                  </span>
                </div>
                <Link to={`/product/${item.id}`} className="font-black text-slate-900 text-base hover:text-blue-700 transition-colors line-clamp-1">{item.name}</Link>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.brand}</p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:text-blue-600 transition-colors shadow-sm"><Minus size={14} /></button>
                <span className="font-black text-xs w-6 text-center text-slate-900">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:text-blue-600 transition-colors shadow-sm"><Plus size={14} /></button>
              </div>

              <div className="text-right sm:min-w-[140px] space-y-1">
                <p className="font-black text-lg text-slate-900">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1.5 ml-auto text-[10px] font-black uppercase tracking-widest"
                >
                  <Trash2 size={12} /> Xoá
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] border sticky top-32 space-y-8">
            <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-widest border-b border-slate-50 pb-4">Tóm tắt đơn hàng</h3>

            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <span style={{ color: 'black' }}>Tạm tính</span>
                <span style={{ color: 'black' }}>{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <span style={{ color: 'black' }}>Vận chuyển</span>
                <span style={{ color: 'black' }}>{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')}đ`}</span>
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-baseline">
                <span className="text-xs font-black uppercase tracking-widest text-slate-900">Tổng cộng</span>
                <span className="text-2xl font-black text-[#243a8c]">{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-2">
              <div className="flex items-center gap-2 text-blue-700">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Cam kết chính hãng</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Sản phẩm được bảo hành toàn diện và hỗ trợ kỹ thuật trọn đời.</p>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-[#243a8c] hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 group"
            >
              Tiến hành thanh toán <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
