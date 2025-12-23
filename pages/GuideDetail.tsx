// Updated GuideDetail.tsx to fetch data from Supabase
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, MessageCircle, Play, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface Guide {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  read_time: string;
  image: string;
  video_url: string;
  created_at: string;
}

const GuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('guides')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching guide:', error);
        } else {
          setGuide(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
    window.scrollTo(0, 0);
  }, [id]);

  // Helper function to get YouTube Embed URL from any YouTube link
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;

    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split(/[?#]/)[0];
    } else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get('v') || '';
    } else if (url.includes('youtube.com/live/')) {
      videoId = url.split('youtube.com/live/')[1].split(/[?#]/)[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (loading) return <div className="py-40 text-center">Đang tải...</div>;

  if (!guide) return (
    <div className="py-40 text-center space-y-4">
      <h2 className="text-2xl font-black uppercase">Không tìm thấy hướng dẫn</h2>
      <Link to="/guides" className="text-blue-600 font-bold uppercase text-xs">Quay lại danh sách</Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Article Header */}
      <section className="bg-slate-50 pt-12 pb-24 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <button onClick={() => navigate('/guides')} className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest transition-all">
            <ArrowLeft size={16} /> Quay lại danh mục
          </button>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">{guide.category}</span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Clock size={14} /> {guide.read_time} đọc</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">{guide.title}</h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed border-l-4 border-slate-200 pl-6">{guide.description}</p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">

        {/* Video Section */}
        {guide.video_url && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-900">
              <Play size={20} className="text-rose-600" /> Hướng dẫn Video chi tiết
            </div>
            <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-slate-100 bg-black relative">
              <iframe
                src={getEmbedUrl(guide.video_url)}
                title={guide.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </section>
        )}

        {/* Text Content Area */}
        <article className="prose prose-slate max-w-none space-y-12">
          {/* If content is present, render it (safely if possible, but for now displaying as text or dangerousHTML if intended, assuming text for now) 
                Since we moved to dynamic data, the hardcoded 'Steps' might not apply to all guides. 
                For this fix, I will render the `content` field.
            */}
          <div className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
            {guide.content || "Nội dung đang cập nhật..."}
          </div>
        </article>

        {/* Social Share & Interaction */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-12 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">
              <Share2 size={16} /> Chia sẻ
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
              <MessageCircle size={16} /> Bình luận (0)
            </button>
          </div>
          <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
            Ngày đăng: {new Date(guide.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-blue-600 p-12 md:p-20 rounded-[3rem] text-center text-white space-y-8">
        <BookOpen size={48} className="mx-auto opacity-50" />
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Bạn muốn nâng cấp thiết bị?</h2>
        <p className="text-blue-100 text-sm md:text-lg max-w-xl mx-auto font-medium uppercase tracking-widest">Ghé thăm cửa hàng KIÊN DRONE để được tư vấn dòng Flycam phù hợp nhất với nhu cầu của bạn.</p>
        <Link to="/?category=Flycam" className="inline-flex px-12 py-5 bg-white text-[#1e3a8a] rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
          Xem sản phẩm ngay
        </Link>
      </section>
    </div>
  );
};

export default GuideDetail;