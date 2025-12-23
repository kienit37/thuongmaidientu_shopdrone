
import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Star, Filter, ArrowRight, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../CartContext';
import { supabase } from '../supabaseClient';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const searchParams = new URLSearchParams(location.search);

  const categoryFilter = searchParams.get('category');
  const conditionFilter = searchParams.get('condition');
  const queryParam = searchParams.get('q');

  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [dbSlides, setDbSlides] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  const defaultSlides = [
    {
      title: "DJI Mavic 4 Pro",
      desc: "Hệ thống 3 camera Hasselblad đỉnh cao cho điện ảnh trên không chuyên nghiệp.",
      img: "https://www.cined.com/content/uploads/2025/05/DJI-Mavic-4-Pro-featured2.jpg",
      link: "/product/1",
      duration: 10000
    },
    {
      title: "DJI MINI 5 PRO",
      desc: "Camera 1-inch mạnh mẽ, mang trải nghiệm điện ảnh trên không trong thiết kế siêu gọn nhẹ.",
      img: "https://djishop.vn/wp-content/uploads/2025/09/review-dji-mini-5-pro-3.jpg",
      link: "/product/3",
      duration: 10000
    },
    {
      title: "GoPro HERO13 Black",
      desc: "Chống rung HyperSmooth 6.0 và video 5.3K HDR sắc nét nhất.",
      img: "https://goprovietnam.vn/wp-content/uploads/2025/06/GoPro-Hero-13-Black-hinh-anh-chat-luong-HDR.webp",
      link: "/product/2",
      duration: 10000
    }
  ];

  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase.from('banners').select('*').eq('is_active', true).order('display_order', { ascending: true });
      if (data && data.length > 0) {
        setDbSlides(data.map(b => ({
          title: b.title,
          desc: b.description,
          img: b.image_url,
          link: b.link_url,
          duration: b.duration || 5000
        })));
      }
    };

    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setDbProducts(data);
    };

    fetchBanners();
    fetchProducts();
  }, []);

  const slides = dbSlides.length > 0 ? dbSlides : defaultSlides;

  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const priceOptions = [
    { label: 'Dưới 10 triệu', range: [0, 10000000] },
    { label: '10tr - 25tr', range: [10000000, 25000000] },
    { label: 'Trên 25 triệu', range: [25000000, 500000000] },
  ];

  const filteredProducts = useMemo(() => {
    return dbProducts.filter(p => {
      const condition = p.condition || '';
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (conditionFilter && !condition.includes(conditionFilter)) return false;
      if (priceRange && (p.price < priceRange[0] || p.price > priceRange[1])) return false;
      if (queryParam) {
        const query = queryParam.toLowerCase();
        return p.name.toLowerCase().includes(query) || (p.brand || '').toLowerCase().includes(query);
      }
      return true;
    });
  }, [categoryFilter, conditionFilter, priceRange, queryParam, dbProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, conditionFilter, priceRange, queryParam]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const currentDuration = (slides[currentSlide] as any)?.duration || 5000;
    const timer = setTimeout(() => {
      setCurrentSlide(s => (s + 1) % slides.length);
    }, currentDuration);
    return () => clearTimeout(timer);
  }, [currentSlide, slides]);

  return (
    <div className="space-y-12">
      {/* Hero Slider */}
      {!queryParam && !categoryFilter && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="relative h-[350px] md:h-[550px] rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl">
            {slides.map((slide, idx) => (
              <div key={idx} className={`absolute inset-0 transition-all duration-1000 ${currentSlide === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
                <img src={slide.img} className="w-full h-full object-cover brightness-50" alt={slide.title} />
                <div className="absolute inset-0 flex items-center p-8 md:p-20">
                  <div className="max-w-xl space-y-6">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-[10px] font-black uppercase tracking-widest text-white rounded-full">New Arrival</span>
                    <h2 className="text-4xl md:text-7xl font-extrabold uppercase tracking-tighter leading-[0.9] text-white">{slide.title}</h2>
                    <p className="text-slate-200 text-sm md:text-xl font-medium leading-relaxed max-w-md">{slide.desc}</p>
                    <div className="pt-4">
                      <Link to={slide.link} className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                        Xem chi tiết <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="hidden lg:block lg:col-span-3 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Khoảng giá</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => setPriceRange(null)} className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${priceRange === null ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>Tất cả giá</button>
              {priceOptions.map((opt, i) => (
                <button key={i} onClick={() => setPriceRange(opt.range as [number, number])} className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${priceRange && priceRange[0] === opt.range[0] ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>{opt.label}</button>
              ))}
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Trạng thái máy</h3>
            <div className="flex flex-wrap gap-2">
              {['Mới', 'Cũ'].map(cond => (
                <button key={cond} onClick={() => navigate(conditionFilter === cond ? '/' : `/?condition=${cond}`)} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${conditionFilter === cond ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{cond}</button>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold uppercase tracking-tighter text-slate-900">
              {queryParam ? `Kết quả: ${queryParam}` : (categoryFilter || "Sản phẩm mới nhất")}
              <span className="ml-3 text-xs font-bold text-slate-400 lowercase">({filteredProducts.length} món)</span>
            </h2>
            <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden p-3 bg-white border border-slate-200 rounded-xl"><Filter size={18} /></button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {currentProducts.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-[1.5rem] p-3 md:p-6 shadow-sm border border-slate-100 hover:shadow-2xl transition-all group flex flex-col">
                <div className="aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-slate-50 mb-4 relative">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                  {p.condition?.includes('Cũ') && <div className="absolute top-2 left-2 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full z-10 shadow-sm">HÀNG CŨ</div>}
                  {p.is_on_sale && p.discount_price > 0 && (
                    <div className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] font-black px-2 py-1 rounded-lg z-10 shadow-lg shadow-rose-600/30 animate-pulse">
                      -{Math.round(((p.price - p.discount_price) / p.price) * 100)}%
                    </div>
                  )}
                </div>
                <div className="flex-grow space-y-2">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{p.brand}</p>
                  <h3 className="text-[11px] md:text-sm font-bold text-slate-900 uppercase leading-tight line-clamp-2 h-8 md:h-10">{p.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-400"><Star size={10} className="fill-current" /> <span className="text-slate-400 text-[9px] font-bold">{p.rating}</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      {p.is_on_sale && p.discount_price > 0 ? (
                        <>
                          <p className="text-sm md:text-lg font-black text-rose-600">{Number(p.discount_price).toLocaleString('vi-VN')}đ</p>
                          <p className="text-[10px] text-slate-300 line-through font-bold">{Number(p.price).toLocaleString('vi-VN')}đ</p>
                        </>
                      ) : (
                        <p className="text-sm md:text-lg font-black text-slate-900">{Number(p.price).toLocaleString('vi-VN')}đ</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); addToCart({ ...p, price: p.is_on_sale && p.discount_price > 0 ? p.discount_price : p.price }); }}
                      className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all active:scale-90 shadow-lg shadow-blue-600/20"
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${currentPage === page
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'border border-slate-100 hover:bg-slate-50 text-slate-600'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </section>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[110]">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-[2rem] p-8 space-y-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between">
              <h3 className="font-black uppercase text-lg tracking-tighter">Bộ lọc</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ngân sách</p>
              <div className="grid grid-cols-2 gap-3">
                {priceOptions.map((opt, i) => (
                  <button key={i} onClick={() => { setPriceRange(opt.range as [number, number]); setIsMobileFilterOpen(false); }} className={`p-4 rounded-xl text-[10px] font-bold uppercase transition-all ${priceRange && priceRange[0] === opt.range[0] ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'}`}>{opt.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
