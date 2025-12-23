import React, { useEffect, useState } from 'react';
import { Calendar, User, ArrowRight, MessageCircle, Clock, Eye, Tag, Search, TrendingUp } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const categories = ["Tất cả", "Đánh giá", "Hướng dẫn", "Kiến thức", "So sánh"];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filteredPosts = activeCategory === "Tất cả"
    ? posts
    : posts.filter(p => p.category === activeCategory);

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header Section */}
      <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-none">
              Tin Tức <span className="text-blue-500">Flycam</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl mx-auto uppercase tracking-widest opacity-80">
              Cập nhật xu hướng và kiến thức mới nhất từ KIÊN DRONE.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Side: Category Sidebar */}
          <aside className="lg:col-span-3 space-y-10">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-8">
              <div className="relative">
                <input type="text" placeholder="Tìm tin tức..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                <Search size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Chuyên mục</h4>
                <nav className="flex flex-col gap-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase transition-all tracking-widest ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Right Side: Blog List */}
          <div className="lg:col-span-9 space-y-12">
            {loading ? <div className="text-center py-20 font-bold text-slate-400">Đang tải tin tức...</div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.length === 0 ? <p className="col-span-2 text-center text-slate-400">Chưa có bài viết nào.</p> :
                  filteredPosts.map(post => (
                    <article key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col hover:shadow-2xl transition-all duration-500 group">
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img src={post.image || 'https://via.placeholder.com/800x600'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
                        <div className="absolute top-5 left-5">
                          <span className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">{post.category}</span>
                        </div>
                      </div>
                      <div className="p-8 flex flex-col flex-grow space-y-4">
                        <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-500" /> {new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-blue-500" /> {post.read_time}</span>
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight uppercase tracking-tight line-clamp-2">{post.title}</h2>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-medium uppercase tracking-widest opacity-80">{post.excerpt}</p>

                        <div className="pt-6 mt-auto border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Viết bởi {post.author}</span>
                          {/* Note: We would typically link to a detail page here, but staying on list for now or dummy link */}
                          <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:gap-4 transition-all">
                            Chi tiết <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
