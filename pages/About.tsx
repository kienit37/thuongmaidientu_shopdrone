
import React from 'react';
import { ShieldCheck, Truck, Headphones, Zap, MapPin, Award, Heart, Target, Lightbulb, Users, CheckCircle2, Star } from 'lucide-react';

const About = () => {
   return (
      <div className="bg-white min-h-screen">
         {/* Dynamic Hero Section */}
         <section className="relative py-32 bg-slate-950 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-40">
               <img src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-8">
               <div className="space-y-4">
                  <span className="inline-block px-4 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.4em]">SINCE 2018</span>
                  <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                     KIÊN <br /> <span className="text-blue-500">DRONE</span>
                  </h1>
               </div>
               <p className="text-xl md:text-3xl text-slate-300 font-bold uppercase tracking-widest max-w-2xl border-l-4 border-blue-600 pl-6">
                  "Nâng tầm góc nhìn, khai phá đam mê từ bầu trời cùng KIÊN DRONE."
               </p>
            </div>
         </section>

         {/* Story & Vision Grid */}
         <section className="py-24 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter border-b-8 border-blue-50 pb-4 inline-block">Câu chuyện của KIÊN DRONE</h2>
               <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-medium">
                  <p>Được thành lập từ năm 2018 bởi anh Kiên và những người cộng sự đam mê flycam, KIÊN DRONE khởi đầu từ một cửa hàng nhỏ chuyên cung cấp giải pháp ghi hình trên không tại TP.Hà Nội.</p>
                  <p>Hành trình 6 năm qua, chúng tôi đã vươn mình trở thành hệ thống phân phối Flycam và Action Cam uy tín hàng đầu Việt Nam, phục vụ hàng chục ngàn khách hàng với cam kết duy nhất: <strong>"Chất lượng thật - Giá trị thật"</strong>.</p>
               </div>
               <div className="flex gap-4">
                  <div className="bg-slate-900 text-white p-6 rounded-[2rem] flex-grow text-center">
                     <p className="text-3xl font-black">6+</p>
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Năm phát triển</p>
                  </div>
                  <div className="bg-blue-600 text-white p-6 rounded-[2rem] flex-grow text-center">
                     <p className="text-3xl font-black">100%</p>
                     <p className="text-[9px] font-black uppercase tracking-widest text-blue-100">Chính hãng</p>
                  </div>
               </div>
            </div>
            <div className="relative">
               <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                  <img src="https://phukienflytech.vn/wp-content/uploads/2025/01/8634886755303c9ec25887486ae25a41b0c5fdbd.jpeg" className="w-full h-full object-cover" alt="" />
               </div>
               <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 hidden md:block">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl"><CheckCircle2 /></div>
                     <div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-900">DJI Authorized</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Đối tác ủy quyền 2024</p>
                     </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-widest">Sự hài lòng của bạn là <br /> ưu tiên số 1 của chúng tôi.</p>
               </div>
            </div>
         </section>

         {/* Philosophy */}
         <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 space-y-16">
               <div className="text-center space-y-4">
                  <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">PHILOSOPHY</span>
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Giá trị cốt lõi</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                     { icon: Target, title: "Tận tâm", desc: "Luôn lắng nghe và tìm ra giải pháp phù hợp nhất với nhu cầu của khách hàng.", color: "blue" },
                     { icon: ShieldCheck, title: "Trung thực", desc: "Minh bạch về nguồn gốc và tình trạng thực tế của từng sản phẩm dù cũ hay mới.", color: "emerald" },
                     { icon: Lightbulb, title: "Sáng tạo", desc: "Không ngừng cập nhật công nghệ và xu hướng nhiếp ảnh bầu trời mới nhất.", color: "amber" },
                     { icon: Heart, title: "Trách nhiệm", desc: "Đồng hành và hỗ trợ kỹ thuật trọn đời máy, dù là lỗi nhỏ nhất.", color: "rose" },
                  ].map((val, i) => (
                     <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
                        <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                           <val.icon size={24} />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 uppercase mb-4 tracking-tight">{val.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed uppercase tracking-widest opacity-80">{val.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Team */}

      </div>
   );
};

export default About;
