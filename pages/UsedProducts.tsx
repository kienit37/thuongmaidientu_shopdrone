
import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, ShieldCheck, RefreshCw, Star, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '../CartContext';
import { supabase } from '../supabaseClient';

const UsedProducts = () => {
   const { addToCart } = useCart();
   const [dbProducts, setDbProducts] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchUsedProducts();
   }, []);

   const fetchUsedProducts = async () => {
      setLoading(true);
      const { data } = await supabase.from('products').select('*').ilike('condition', '%Cũ%');
      if (data) setDbProducts(data);
      setLoading(false);
   };

   const usedProducts = useMemo(() => {
      return dbProducts;
   }, [dbProducts]);

   return (
      <div className="pb-24 animate-in fade-in duration-700">
         {/* Hero Section Hàng Cũ */}
         <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
               <div className="relative z-10 space-y-6 max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                     <Tag size={12} /> Flycam & Action Cam Like New
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">Chợ Đồ Cũ <br /> Chất Lượng Cao</h1>
                  <p className="text-amber-50 text-sm md:text-base font-medium leading-relaxed">
                     Tất cả sản phẩm đã qua sử dụng tại KIÊN DRONE đều được kiểm định kỹ thuật 30 bước, cam kết chưa qua sửa chữa và bảo hành lên tới 6 tháng.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                     <div className="flex items-center gap-2 text-[11px] font-black uppercase"><ShieldCheck size={16} /> Kiểm định 30 bước</div>
                     <div className="flex items-center gap-2 text-[11px] font-black uppercase"><RefreshCw size={16} /> Bảo hành 6 tháng</div>
                  </div>
               </div>
            </div>
         </section>

         {/* Product Grid */}
         <section className="max-w-7xl mx-auto px-4 mt-12">
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Sản phẩm đang có sẵn</h2>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{usedProducts.length} Máy</span>
            </div>

            {loading ? (
               <div className="flex flex-col items-center py-20 gap-4">
                  <Loader2 className="animate-spin text-amber-500" size={32} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải danh sách hàng cũ...</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {usedProducts.map(p => (
                     <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-5 relative">
                           <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                           <div className="absolute top-3 left-3 bg-amber-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg">
                              {p.condition.replace('Cũ (', '').replace(')', '')}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">{p.brand}</p>
                           <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">{p.name}</h3>
                           <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-between">
                                 <div className="flex flex-col">
                                    {p.is_on_sale && p.discount_price > 0 ? (
                                       <>
                                          <span className="text-base font-black text-rose-600">{Number(p.discount_price).toLocaleString('vi-VN')}đ</span>
                                          <span className="text-[10px] text-slate-400 line-through font-bold">{Number(p.price).toLocaleString('vi-VN')}đ</span>
                                       </>
                                    ) : (
                                       <span className="text-base font-black text-slate-900">{Number(p.price).toLocaleString('vi-VN')}đ</span>
                                    )}
                                 </div>
                                 <div className="flex items-center gap-1 text-yellow-400">
                                    <Star size={12} className="fill-current" />
                                    <span className="text-slate-900 text-[10px] font-bold">{p.rating}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                           <button
                              onClick={(e) => { e.preventDefault(); addToCart({ ...p, price: p.is_on_sale && p.discount_price > 0 ? p.discount_price : p.price }); }}
                              className="flex items-center gap-2 text-[10px] font-black text-blue-600 hover:text-black uppercase tracking-widest transition-all group/btn"
                           >
                              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all shadow-sm">
                                 <ShoppingBag size={14} />
                              </div>
                              Thêm vào giỏ
                           </button>
                           <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 group-hover:text-amber-600 transition-all" />
                        </div>
                     </Link>
                  ))}
               </div>
            )}
         </section>

         {/* Quality Commitment */}
         <section className="max-w-7xl mx-auto px-4 mt-24">
            <div className="bg-slate-900 rounded-[3rem] p-12 text-center space-y-8">
               <h2 className="text-2xl font-black text-white uppercase italic">Quy trình kiểm định khắt khe</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                     { step: "01", title: "Kiểm tra ngoại quan", desc: "Đảm bảo vỏ máy không móp méo, ống kính không trầy xước." },
                     { step: "02", title: "Test tính năng", desc: "Bay thử, test chống rung, cảm biến và chất lượng video thực tế." },
                     { step: "03", title: "Vệ sinh & Đóng gói", desc: "Vệ sinh chuyên sâu bằng dung dịch cao cấp trước khi giao." },
                  ].map((item, i) => (
                     <div key={i} className="space-y-3">
                        <span className="text-4xl font-black text-white/10 block">{item.step}</span>
                        <h4 className="text-white font-bold text-lg">{item.title}</h4>
                        <p className="text-slate-400 text-xs font-medium">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>
      </div>
   );
};

export default UsedProducts;
