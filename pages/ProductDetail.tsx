
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { supabase } from '../supabaseClient';
import { Star, ShieldCheck, Truck, ShoppingBag, ArrowLeft, Box, ClipboardList, Info, Package, Download, Loader2 } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').eq('id', id).single();
    if (data) {
      setProduct(data);
      if (data.detailed_description?.variants?.length > 0) {
        setSelectedVariant(data.detailed_description.variants[0]);
      }
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="py-40 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải thông tin sản phẩm...</p>
    </div>
  );

  if (!product) return <div className="py-40 text-center font-bold">Không tìm thấy sản phẩm</div>;

  const detailImages = product.detailed_description?.images || [];
  const images = [product.image, ...detailImages.filter((img: string) => img && img.trim() !== '')].slice(0, 5);

  const overview = product.detailed_description?.overview || product.description;
  const whatsInBox = product.detailed_description?.whatsInBox || [];
  const variants = product.detailed_description?.variants || [];
  const specs = product.specs || {};

  const displayPrice = selectedVariant ? selectedVariant.price : (product.is_on_sale && product.discount_price > 0 ? product.discount_price : product.price);
  const originalPrice = selectedVariant ? null : (product.is_on_sale && product.discount_price > 0 ? product.price : null);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-8 font-bold text-[10px] uppercase tracking-widest transition-colors">
        <ArrowLeft size={14} /> <span>Quay lại cửa hàng</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[16/10] rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm relative group">
            <img src={images[selectedImage]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)} className={`w-24 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === i ? 'border-blue-600 shadow-lg scale-105' : 'border-transparent opacity-60'}`}>
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-wider">{product.brand}</span>
              <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${product.condition?.includes('Mới') ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{product.condition}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tighter uppercase leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-1 text-yellow-500"><Star size={16} className="fill-current" /> {product.rating}</div>
              <div className="h-4 w-px bg-slate-200"></div>
              <div className={product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}>{product.stock > 0 ? `Còn ${product.stock} máy` : 'Hết hàng'}</div>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-black text-blue-900 tracking-tighter">
              {Number(displayPrice).toLocaleString('vi-VN')}đ
            </span>
            {originalPrice && (
              <>
                <span className="text-lg text-slate-300 line-through font-bold">
                  {Number(originalPrice).toLocaleString('vi-VN')}đ
                </span>
                <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-1 rounded-lg border border-rose-100 italic">
                  -{Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%
                </span>
              </>
            )}
            {selectedVariant && (
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
                {selectedVariant.name}
              </span>
            )}
          </div>

          {variants.length > 0 && (
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chọn phiên bản</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {variants.map((v: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedVariant?.name === v.name
                      ? 'border-blue-600 bg-blue-50/50 shadow-md scale-[1.02]'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                  >
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{v.name}</p>
                    <p className={`text-sm font-bold mt-1 ${selectedVariant?.name === v.name ? 'text-blue-600' : 'text-slate-500'}`}>
                      {Number(v.price).toLocaleString('vi-VN')}đ
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
            <button
              onClick={() => addToCart({
                ...product,
                name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
                price: displayPrice
              })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95"
            >
              <ShoppingBag size={20} /> Thêm Vào Giỏ Hàng
            </button>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span className="text-[10px] font-black text-slate-600 uppercase">Bảo hành 12th</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Truck size={18} className="text-blue-500" />
                <span className="text-[10px] font-black text-slate-600 uppercase">Giao hỏa tốc</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-slate-100 pt-16">
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <Info size={22} className="text-blue-600" /> Giới thiệu chi tiết
            </h3>
            <div className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-inner">
              <p className="text-sm md:text-base leading-relaxed text-slate-600 font-medium whitespace-pre-line">{overview}</p>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <Package size={22} className="text-blue-600" /> Phụ kiện đi kèm
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {whatsInBox.map((item: string, i: number) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-4 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Box size={22} /></div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white space-y-8 sticky top-36">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center gap-2"><ClipboardList size={18} /> Thông số kỹ thuật</h4>
              <Download size={16} className="text-slate-500" />
            </div>
            <div className="space-y-2">
              {Object.entries(specs).map(([key, value]: [string, any], idx) => (
                <div key={key} className="flex flex-col gap-1 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <span className="text-[9px] text-blue-400 uppercase font-black tracking-widest opacity-60">{key}</span>
                  <span className="text-sm font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetail;
