import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BookOpen, Search, Play, ChevronRight, Clock, User, Tag, Lightbulb, ShieldAlert, Cpu } from 'lucide-react';

const Guides = () => {
  const [guides, setGuides] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const tabs = ["Tất cả", "Cơ bản", "Kỹ năng", "Quay phim", "Bảo trì", "Kỹ thuật"];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      const { data } = await supabase.from('guides').select('*').order('created_at', { ascending: false });
      if (data) setGuides(data);
      setLoading(false);
    };
    fetchGuides();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-slate-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
            <BookOpen size={14} /> KIÊN DRONE ACADEMY
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold uppercase tracking-tighter leading-tight text-white">Hướng Dẫn <br /> <span className="text-blue-500 text-white">Sử Dụng & Làm Chủ Flycam</span></h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto font-medium uppercase tracking-widest opacity-80">Trang bị kiến thức từ cơ bản đến nâng cao cho phi công trẻ.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Lightbulb, title: "Lưu ý bay", color: "bg-amber-500" },
          { icon: ShieldAlert, title: "Cấm bay", color: "bg-rose-500" },
          { icon: Cpu, title: "Phần mềm", color: "bg-blue-600" },
          { icon: Play, title: "Video Tutorial", color: "bg-emerald-600" }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 hover:shadow-2xl transition-all cursor-pointer group">
            <div className={`w-12 h-12 ${item.color} text-white rounded-xl flex items-center justify-center`}><item.icon size={22} /></div>
            <span className="font-black uppercase text-xs tracking-widest text-slate-800 group-hover:text-blue-600 transition-colors">{item.title}</span>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 py-24 space-y-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-100 pb-8">
          <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="relative w-full md:w-64">
            <input type="text" placeholder="Tìm hướng dẫn..." className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {loading ? <div className="col-span-2 text-center text-slate-400">Đang tải hướng dẫn...</div> :
            guides.filter(g => activeTab === "Tất cả" || g.category === activeTab).map(guide => (
              <Link key={guide.id} to={`/guides/${guide.id}`} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-2/5 aspect-[4/3] md:aspect-square overflow-hidden">
                  <img src={guide.image || 'https://via.placeholder.com/400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                </div>
                <div className="w-full md:w-3/5 p-8 space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-full">{guide.category}</span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest"><Clock size={12} /> {guide.read_time}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-tight uppercase tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2">{guide.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{guide.description}</p>
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                      Xem chi tiết <ChevronRight size={14} className="text-blue-600" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Guides;
