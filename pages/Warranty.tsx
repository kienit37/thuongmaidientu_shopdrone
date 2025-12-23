
import React from 'react';
import { ShieldCheck, Award, Clock, FileText, CheckCircle2, AlertCircle, Headphones } from 'lucide-react';

const Warranty = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-[#1e3a8a] py-32 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-6">
          <span className="inline-block px-4 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.4em]">KIÊN DRONE Care</span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">Chính Sách <br/> Bảo Hành 12 Tháng</h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto opacity-80 uppercase tracking-widest">Chế độ hậu mãi chuyên nghiệp hàng đầu Việt Nam.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Clock, title: "12 Tháng Toàn Diện", desc: "Bảo hành lỗi phần cứng từ nhà sản xuất cho tất cả các thiết bị chính." },
            { icon: Award, title: "Linh Kiện Chính Hãng", desc: "Cam kết thay thế linh kiện 100% từ DJI, GoPro, Insta360." },
            { icon: Headphones, title: "Tư Vấn Bay Trọn Đời", desc: "Hỗ trợ kỹ thuật bay và xử lý hình ảnh miễn phí cho khách hàng." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center space-y-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto"><item.icon size={32} /></div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-widest">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 space-y-24">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 space-y-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4"><CheckCircle2 className="text-blue-600" /> Được bảo hành khi</h3>
              <ul className="space-y-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
                <li className="flex items-start gap-4"><span>01</span> Còn trong thời hạn bảo hành 12 tháng tại KIÊN DRONE.</li>
                <li className="flex items-start gap-4"><span>02</span> Lỗi từ phía nhà sản xuất (Mainboard, Sensor, Gimbal).</li>
                <li className="flex items-start gap-4"><span>03</span> Tem niêm phong và số serial còn nguyên vẹn.</li>
              </ul>
            </div>
            <div className="bg-rose-50 p-12 rounded-[3rem] border border-rose-100 space-y-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4 text-rose-900"><AlertCircle className="text-rose-600" /> Từ chối bảo hành</h3>
              <ul className="space-y-4 text-xs font-bold text-rose-700 uppercase tracking-widest">
                <li className="flex items-start gap-4"><span>01</span> Máy bị va chạm, rơi rớt hoặc vào nước do người dùng.</li>
                <li className="flex items-start gap-4"><span>02</span> Tự ý tháo lắp, can thiệp phần cứng hoặc phần mềm máy.</li>
                <li className="flex items-start gap-4"><span>03</span> Sử dụng sai hướng dẫn, pin không chính hãng.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Warranty;
