
import React from 'react';
import { RefreshCw, CheckCircle2, PackageSearch, HelpCircle, ArrowRight, ShieldCheck, Box } from 'lucide-react';

const Returns = () => {
  return (
    <div className="bg-white min-h-screen pb-24">
      <section className="bg-emerald-900 py-24 text-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-4 py-1 bg-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Đổi Trả Dễ Dàng</span>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">Chính Sách <br /><span className="text-emerald-400">Đổi Trả 30 Ngày</span></h1>
            <p className="text-emerald-200 text-lg font-medium max-w-xl">Hài lòng 100% hoặc đổi mới ngay lập tức. Quyền lợi tối thượng cho khách hàng.</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/10"><Box size={32} /></div>
            <h3 className="font-black text-slate-900 uppercase italic">Lỗi Đổi Mới</h3>
            <p className="text-slate-500 text-[10px] font-bold leading-relaxed uppercase tracking-widest">Phát hiện lỗi kỹ thuật là đổi mới 1:1 không câu nệ.</p>
          </div>
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/10"><RefreshCw size={32} /></div>
            <h3 className="font-black text-slate-900 uppercase italic">Hoàn Tiền 100%</h3>
            <p className="text-slate-500 text-[10px] font-bold leading-relaxed uppercase tracking-widest">Nếu sản phẩm không đúng mô tả hoặc phát hiện hàng giả.</p>
          </div>
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/10"><ShieldCheck size={32} /></div>
            <h3 className="font-black text-slate-900 uppercase italic">Thủ Tục 15 Phút</h3>
            <p className="text-slate-500 text-[10px] font-bold leading-relaxed uppercase tracking-widest">Xác nhận lỗi nhanh chóng tại quầy, không chờ đợi.</p>
          </div>
        </div>

        <div className="mt-24 space-y-24">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Quy định đổi trả hàng</h2>
              <div className="space-y-4">
                {[
                  "Sản phẩm còn nguyên tem niêm phong và hóa đơn mua hàng.",
                  "Đầy đủ phụ kiện, sách hướng dẫn, quà tặng đi kèm.",
                  "Sản phẩm không có dấu hiệu va chạm, trầy xước cơ học.",
                  "Vỏ hộp còn nguyên vẹn, không móp méo đáng kể."
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <CheckCircle2 className="text-emerald-500 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-700">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative">
              <img src="https://photo2.tinhte.vn/data/attachment-files/2024/01/8232247_20210801-ocLbF1G4ou5wOKvOAzTL1Bau.jpg" className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-emerald-900/20"></div>
            </div>
          </section>

          <section className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Các bước thực hiện</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Chúng tôi luôn ở đây để giúp bạn</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: PackageSearch, title: "Liên Hệ", desc: "Gửi ảnh/video mô tả lỗi qua Zalo/Facebook." },
                { icon: ArrowRight, title: "Xác Nhận", desc: "Kỹ thuật viên xác nhận lỗi từ xa sơ bộ." },
                { icon: Box, title: "Gửi Hàng", desc: "Khách gửi máy về trung tâm kiểm định." },
                { icon: CheckCircle2, title: "Hoàn Tất", desc: "Nhận máy mới hoặc hoàn tiền ngay." }
              ].map((step, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center space-y-4 hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                  <div className="w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm"><step.icon size={24} /></div>
                  <h4 className="text-xs font-black uppercase italic text-slate-900">{step.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-slate-900 p-12 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            <div className="space-y-2">
              <h3 className="text-2xl font-black italic uppercase">Cần hỗ trợ đổi trả?</h3>
              <p className="text-slate-400 text-xs font-medium">Đội ngũ CSKH luôn sẵn sàng lắng nghe mọi khiếu nại của bạn.</p>
            </div>
            <a href="tel:0394300132" className="px-10 py-4 bg-emerald-600 rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2">
              Hotline 0394300132 <HelpCircle size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
