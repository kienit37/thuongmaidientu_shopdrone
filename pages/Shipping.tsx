
import React from 'react';
import { Truck, MapPin, Zap, ShieldCheck, Clock, PackageOpen, Globe, CreditCard } from 'lucide-react';

const Shipping = () => {
  return (
    <div className="bg-white min-h-screen pb-24">
      <section className="bg-slate-950 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <img src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-4 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Hỏa Tốc Toàn Quốc</span>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">Chính Sách <br/><span className="text-blue-500">Vận Chuyển & Giao Nhận</span></h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl">Hành trình sản phẩm đến tay bạn luôn an toàn, nhanh chóng và được bảo hiểm 100%.</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 space-y-8 group hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-lg"><Zap size={32} /></div>
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">HOT</span>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">Giao Hàng Siêu Tốc 2H</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Áp dụng cho các khu vực nội thành TP. Hồ Chí Minh, Hà Nội và Đà Nẵng. Nhận hàng ngay chỉ sau một cuộc gọi.</p>
              <ul className="space-y-3 pt-4">
                {["Miễn phí đơn từ 10tr", "Kiểm tra máy tại chỗ", "Hỗ trợ lắp đặt/bay thử"].map((txt, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <ShieldCheck size={14} className="text-blue-600" /> {txt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 space-y-8 group hover:border-emerald-500 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-lg"><Globe size={32} /></div>
              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">UY TÍN</span>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">Giao Hàng Toàn Quốc</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Hợp tác cùng Viettel Post, GHTK mang sản phẩm đến mọi tỉnh thành từ 2-4 ngày làm việc.</p>
              <ul className="space-y-3 pt-4">
                {["Đồng kiểm khi nhận", "Bảo hiểm hàng hóa 100%", "Tracking đơn hàng Real-time"].map((txt, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <ShieldCheck size={14} className="text-emerald-600" /> {txt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 space-y-24">
          <section className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Phí Vận Chuyển</h2>
              <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 text-center">
                   <p className="text-[10px] font-black uppercase text-blue-700 tracking-widest mb-2">Đơn hàng {'>'} 5.000.000đ</p>
                   <p className="text-3xl font-black text-slate-900">MIỄN PHÍ</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 text-center">
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Đơn hàng {'<'} 5.000.000đ</p>
                   <p className="text-3xl font-black text-slate-900">45.000đ</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-50 p-12 md:p-20 rounded-[4rem]">
            <div className="max-w-4xl mx-auto space-y-16">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black uppercase italic text-slate-900 tracking-tighter">Cam kết an toàn vận chuyển</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">SkyCam Hub luôn bảo vệ tài sản của bạn</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0"><PackageOpen /></div>
                  <div className="space-y-2">
                    <h4 className="font-black uppercase text-xs tracking-widest">Đóng gói 3 lớp</h4>
                    <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Sử dụng màng xốp hơi chống sốc và thùng carton chuyên dụng để tránh va đập tuyệt đối.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0"><Clock /></div>
                  <div className="space-y-2">
                    <h4 className="font-black uppercase text-xs tracking-widest">Xử lý đơn trong ngày</h4>
                    <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Mọi đơn hàng đặt trước 16h00 đều được bàn giao cho đơn vị vận chuyển ngay trong ngày.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0"><CreditCard /></div>
                  <div className="space-y-2">
                    <h4 className="font-black uppercase text-xs tracking-widest">Bảo hiểm 100%</h4>
                    <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Trường hợp thất lạc hoặc hư hỏng do vận chuyển, SkyCam cam kết hoàn tiền hoặc đổi mới ngay.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0"><MapPin /></div>
                  <div className="space-y-2">
                    <h4 className="font-black uppercase text-xs tracking-widest">Đồng kiểm khi nhận</h4>
                    <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Khách hàng có quyền mở hộp kiểm tra ngoại quan máy trước khi thanh toán tiền cho shipper.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center space-y-6">
             <div className="inline-flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <Truck className="text-blue-600" />
                <p className="text-[10px] text-blue-800 font-black uppercase tracking-widest italic">Cảm ơn bạn đã tin tưởng SkyCam Hub - Người đồng hành trên mọi khung hình!</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
