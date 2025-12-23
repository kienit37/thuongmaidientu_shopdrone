
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  ShoppingCart, Menu, X, Search, ChevronRight, Phone, Mail, MapPin,
  Facebook, Instagram, Youtube, ChevronDown, Tag, BookOpen,
  Home as HomeIcon, Package, Newspaper, Info, MessageSquare,
  ShieldCheck, RefreshCw, User, CheckCircle, ExternalLink, Cpu, Eye, Plane, Camera
} from 'lucide-react';
import { Product, CartItem } from './types';
import { useCart, CartProvider } from './CartContext';
import { supabase } from './supabaseClient';

import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Blog from './pages/Blog';
import About from './pages/About';
import UsedProducts from './pages/UsedProducts';
import Warranty from './pages/Warranty';
import Returns from './pages/Returns';
import Shipping from './pages/Shipping';
import Guides from './pages/Guides';
import GuideDetail from './pages/GuideDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MyOrders from './pages/MyOrders';
import CookieConsent from './components/CookieConsent';
import { SessionTracker } from './utils/SessionTracker';

import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import OrderList from './pages/admin/OrderList';
import BlogList from './pages/admin/BlogList';
import BlogForm from './pages/admin/BlogForm';
import DiscountList from './pages/admin/DiscountList';
import GuideList from './pages/admin/GuideList';
import GuideForm from './pages/admin/GuideForm';
import BannerList from './pages/admin/BannerList';
import BannerForm from './pages/admin/BannerForm';
import PageList from './pages/admin/PageList';
import UserList from './pages/admin/UserList';

const Header = () => {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async (u: any) => {
      if (!u) {
        setUserRole(null);
        return;
      }
      const { data } = await supabase.from('profiles').select('role').eq('id', u.id).single();
      setUserRole(data?.role || 'user');
    };

    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('id, name, image, brand, price, discount_price, is_on_sale');
      if (data) setDbProducts(data);
    };

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
      fetchProfile(currentUser);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      fetchProfile(u);
    });

    fetchProducts();
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowSuggestions(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const suggestions = searchQuery.trim().length > 0
    ? dbProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[100] transition-all duration-300">
        <div className="bg-[#1e3a8a] text-white text-[10px] py-2 text-center font-bold tracking-wider uppercase hidden md:block border-b border-white/5">
          Hệ thống Flycam & Action Cam Chính Hãng KIÊN DRONE - Giao hàng 2H Nội Thành
        </div>

        <div className={`bg-[#1e3a8a] text-white px-4 py-4 md:py-5 transition-all duration-300 ${isScrolled ? 'shadow-xl' : ''}`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
            <Link to="/" className="flex-shrink-0">
              <h1 className="font-extrabold tracking-tighter text-2xl uppercase">KIEN DRONE</h1>
            </Link>

            <div className="flex-grow max-w-2xl hidden md:block relative z-50 group" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                {/* Subtle Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[1.25rem] blur opacity-0 group-focus-within:opacity-20 transition duration-1000 group-focus-within:duration-200"></div>

                <div className="relative flex items-center bg-white/5 backdrop-blur-md hover:bg-white/10 group-focus-within:bg-white border border-white/10 group-focus-within:border-transparent rounded-[1.2rem] transition-all duration-500 overflow-hidden shadow-2xl">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Tìm kiếm máy bay, phụ kiện..."
                    className="w-full bg-transparent text-white group-focus-within:text-slate-900 px-6 py-3.5 text-xs font-bold tracking-tight transition-all outline-none placeholder:text-white/40 placeholder:font-medium group-focus-within:placeholder:text-slate-400"
                  />
                  <div className="pr-1.5">
                    <button
                      type="submit"
                      className="w-10 h-10 bg-blue-600 text-white rounded-[0.9rem] flex items-center justify-center hover:bg-black group-focus-within:hover:bg-blue-700 active:scale-90 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                      <Search size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </form>

              {showSuggestions && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 w-full mt-3 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Sản phẩm gợi ý</span>
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{suggestions.length} kết quả</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {suggestions.length > 0 ? (
                      suggestions.map((p, idx) => (
                        <Link
                          key={p.id}
                          to={`/product/${p.id}`}
                          onClick={() => setShowSuggestions(false)}
                          className="flex items-center gap-5 p-4 hover:bg-blue-50 transition-all border-b border-slate-50 last:border-0 group/item"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 p-1 overflow-hidden group-hover/item:scale-110 transition-transform duration-500 flex-shrink-0">
                            <img src={p.image} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-grow">
                            <p className="text-[11px] font-black text-slate-900 group-hover/item:text-blue-600 transition-colors uppercase tracking-tight line-clamp-1 mb-1">{p.name}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black text-blue-600">
                                {Number(p.is_on_sale && p.discount_price > 0 ? p.discount_price : p.price).toLocaleString('vi-VN')}₫
                              </span>
                              {p.is_on_sale && p.discount_price > 0 && (
                                <span className="text-[10px] text-slate-300 line-through font-bold">
                                  {Number(p.price).toLocaleString('vi-VN')}₫
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="opacity-0 group-hover/item:opacity-100 -translate-x-4 group-hover/item:translate-x-0 transition-all duration-300 text-blue-600">
                            <ChevronRight size={18} />
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search size={24} className="text-slate-200" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Không tìm thấy sản phẩm phù hợp</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-blue-600 text-center">
                    <button onClick={() => handleSearchSubmit()} className="text-[9px] font-black text-white uppercase tracking-[0.3em] hover:opacity-80 transition-opacity">
                      Xem tất cả tất cả kết quả cho "{searchQuery}"
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 md:gap-4">
                {user ? (
                  <div className="flex items-center gap-2">
                    {userRole === 'admin' && (
                      <Link to="/admin" className="text-[9px] font-black text-white bg-red-600 px-2 py-1 rounded uppercase tracking-tighter">Admin</Link>
                    )}
                    <Link to="/my-orders" className="flex items-center gap-2 text-[11px] font-bold text-white hover:text-blue-200 uppercase tracking-widest bg-white/10 px-2 md:px-3 py-2 rounded-lg transition-all border border-white/10">
                      <User size={18} className="md:w-4 md:h-4" />
                      <span className="max-w-[80px] md:max-w-[100px] truncate hidden sm:inline">{user.user_metadata?.full_name || 'Tài khoản'}</span>
                    </Link>
                  </div>
                ) : (
                  <Link to="/login" className="text-[11px] font-bold text-white hover:text-blue-200 uppercase tracking-widest bg-white/10 px-2 md:px-3 py-2 rounded-lg transition-all border border-white/10 flex items-center gap-2">
                    <User size={18} className="md:w-4 md:h-4" />
                    <span className="hidden md:inline">Đăng nhập / Đăng ký</span>
                  </Link>
                )}
              </div>

              <Link to="/cart" className="relative p-2 md:p-2.5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2">
                <ShoppingCart size={20} />
                <span className="bg-red-600 text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full absolute -top-1 -right-1 border-2 border-[#1e3a8a]">{totalItems}</span>
                <span className="hidden lg:inline text-xs font-bold uppercase tracking-widest text-white">Giỏ hàng</span>
              </Link>
              <button className="md:hidden p-2.5 bg-white/10 rounded-xl active:scale-90 transition-transform" onClick={() => setIsMenuOpen(true)}>
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-slate-100 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between relative">
            <div className="w-32"></div>
            <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-10 text-[11px] font-bold text-slate-600 uppercase tracking-widest">
              <Link to="/" className={`hover:text-blue-700 transition-colors ${location.pathname === '/' ? 'text-blue-700' : ''}`}>Trang chủ</Link>
              <div className="relative group" onMouseEnter={() => setIsProductMenuOpen(true)} onMouseLeave={() => setIsProductMenuOpen(false)}>
                <button className={`hover:text-blue-700 flex items-center gap-1 py-4 ${(location.pathname === '/used-products' || location.search.includes('category')) ? 'text-blue-700' : ''}`}>
                  SẢN PHẨM <ChevronDown size={12} className={`transition-transform duration-300 ${isProductMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden transition-all duration-300 origin-top z-[60] ${isProductMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'}`}>
                  <div className="grid grid-cols-2 p-3 gap-2 bg-white">
                    {/* Column 1: Flycam */}
                    <div className="p-4 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Plane size={20} />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-xs uppercase tracking-widest text-slate-900">Flycam & Drone</h5>
                          <p className="text-[9px] text-slate-400 font-bold">Thiết bị bay chuyên nghiệp</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Link to="/?category=Flycam" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 group/link transition-all">
                          <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 group-hover/link:bg-blue-600 group-hover/link:text-white transition-colors">
                            <Package size={14} />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-slate-700 group-hover/link:text-blue-600 uppercase tracking-wide">Flycam Mới</div>
                            <div className="text-[9px] text-slate-400 font-medium">Hàng chính hãng, Fullbox</div>
                          </div>
                        </Link>
                        <Link to="/used-products" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 group/link transition-all">
                          <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 group-hover/link:bg-amber-500 group-hover/link:text-white transition-colors">
                            <Tag size={14} />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-slate-700 group-hover/link:text-amber-600 uppercase tracking-wide">Flycam Cũ (Like New)</div>
                            <div className="text-[9px] text-slate-400 font-medium">Tiết kiệm, chất lượng tốt</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Column 2: Camera */}
                    <div className="p-4 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Camera size={20} />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-xs uppercase tracking-widest text-slate-900">Camera HT</h5>
                          <p className="text-[9px] text-slate-400 font-bold">Ghi lại hành trình</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Link to="/?category=Action Cam" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 group/link transition-all">
                          <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 group-hover/link:bg-indigo-600 group-hover/link:text-white transition-colors">
                            <Camera size={14} />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-slate-700 group-hover/link:text-indigo-600 uppercase tracking-wide">Action Camera</div>
                            <div className="text-[9px] text-slate-400 font-medium">GoPro, Osmo Action...</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Link to="/guides" className={`hover:text-blue-700 transition-colors flex items-center gap-1.5 ${location.pathname.startsWith('/guides') ? 'text-blue-700' : ''}`}><BookOpen size={14} className="text-blue-600" /> Hướng Dẫn</Link>
              <Link to="/blog" className={`hover:text-blue-700 transition-colors ${location.pathname === '/blog' ? 'text-blue-700' : ''}`}>Tin tức</Link>
              <Link to="/about" className={`hover:text-blue-700 transition-colors ${location.pathname === '/about' ? 'text-blue-700' : ''}`}>Về CHÚNG TÔI</Link>
            </nav>
            <div className="flex items-center gap-4">
              <a href="tel:0394300132" className="text-[11px] font-bold text-slate-900 flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 hover:bg-blue-50 transition-colors">
                <Phone size={14} className="text-blue-600" /> 0394 300 132
              </a>
            </div>

          </div>
        </div>
      </header>

      {/* PROFESSIONAL MOBILE MENU (2/3 WIDTH) */}
      <div className={`fixed inset-0 z-[200] transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-2/3 max-w-[300px] bg-white shadow-[-15px_0_40px_rgba(0,0,0,0.15)] transition-transform duration-500 flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

          <div className="p-5 border-b border-slate-50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-extrabold text-sm uppercase tracking-tighter text-slate-900">KIÊN DRONE</span>
              <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-blue-600">MENU BÁN HÀNG</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
              <X size={16} />
            </button>
          </div>

          <div className="p-4 relative">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Bạn tìm gì..."
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-[10px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none"
              />
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600" />
            </form>

            {showSuggestions && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-[210]">
                {suggestions.length > 0 ? (
                  suggestions.map(p => (
                    <Link key={p.id} to={`/product/${p.id}`} className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                      <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden"><img src={p.image} className="w-full h-full object-cover" /></div>
                      <div className="flex-grow">
                        <p className="text-[10px] font-bold text-slate-800 line-clamp-1">{p.name}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-3 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Không có kết quả</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar px-4 pt-2 ">
            <nav className="flex flex-col gap-1 ">
              {[
                { to: "/", icon: HomeIcon, label: "Trang chủ" },
                { to: "/?category=Flycam", icon: Package, label: "Flycam Mới" },
                { to: "/used-products", icon: Tag, label: "Flycam Cũ", color: "text-amber-600" },
                { to: "/guides", icon: BookOpen, label: "Hướng Dẫn" },
                { to: "/blog", icon: Newspaper, label: "Tin tức" },
                { to: "/about", icon: Info, label: "Giới thiệu" },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  to={link.to}
                  className={`flex items-center gap-3 p-3.5 rounded-xl hover:bg-slate-50 transition-all group ${link.color || 'text-slate-700'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${link.color ? 'bg-amber-50' : 'bg-blue-50 group-hover:bg-blue-600 group-hover:text-white'}`}>
                    <link.icon size={14} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em]">{link.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-8 px-2 pb-6">
              <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4">Hỗ trợ khách hàng</h4>
              <nav className="flex flex-col gap-1">
                <Link to="/warranty" className="flex items-center gap-3 p-2 text-[9px] font-bold uppercase text-slate-500 hover:text-blue-600 tracking-widest"><ShieldCheck size={12} /> Bảo hành</Link>
                <Link to="/returns" className="flex items-center gap-3 p-2 text-[9px] font-bold uppercase text-slate-500 hover:text-blue-600 tracking-widest"><RefreshCw size={12} /> Đổi trả</Link>
              </nav>
            </div>
          </div>

          <div className="p-5 border-t border-slate-50 space-y-5 bg-slate-50/50">
            <div className="grid grid-cols-2 gap-2">
              <a href="tel:19008888" className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-slate-100 shadow-sm active:scale-95 transition-all">
                <Phone size={14} className="text-blue-600" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">Gọi Ngay</span>
              </a>
              <Link to="/cart" className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-slate-100 shadow-sm active:scale-95 transition-all">
                <ShoppingCart size={14} className="text-slate-900" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">Giỏ hàng</span>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 pb-2">
              <Facebook size={16} className="text-slate-400 hover:text-blue-600 transition-colors" />
              <Youtube size={16} className="text-slate-400 hover:text-rose-600 transition-colors" />
              <Instagram size={16} className="text-slate-400 hover:text-pink-600 transition-colors" />
              <MessageSquare size={16} className="text-slate-400 hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-[7px] text-center font-bold text-slate-300 uppercase tracking-widest italic">Quality & Passion by KIÊN DRONE</p>
          </div>
        </div>
      </div>
    </>
  );
};

const CartToast = () => {
  const { toast } = useCart();
  if (!toast?.show || !toast.product) return null;

  return (
    <div className={`fixed bottom-8 right-8 z-[9999] transition-all duration-300`}>
      <div className={`bg-white rounded-[2rem] shadow-[0_30px_100px_-15px_rgba(0,0,0,0.4)] border border-slate-100 p-4 flex items-center gap-6 min-w-[340px] max-w-md overflow-hidden relative group animate-toast-in`}>
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />

        <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 shadow-inner">
          <img src={toast.product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
        </div>

        <div className="flex-grow space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            <CheckCircle size={14} className="animate-bounce" /> Đã thêm vào giỏ
          </div>
          <p className="text-[11px] font-black text-slate-800 line-clamp-1 uppercase tracking-tight">{toast.product.name}</p>
          <Link to="/cart" className="inline-block text-[10px] font-extrabold text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4 uppercase tracking-widest mt-1 transition-colors">Xem giỏ hàng</Link>
        </div>

        <div className="pr-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-xs shadow-inner shadow-blue-100/50">
            +1
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [stats, setStats] = useState({ today: 0, total: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const s = await SessionTracker.getSiteStats();
      setStats(s);
    };
    fetchStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-slate-950 pt-20 pb-10 mt-20 relative overflow-hidden border-t border-slate-900">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Cpu className="text-white" size={20} />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">KIEN DRONE</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium pr-4">
              Chuyên cung cấp các dòng Flycam & Action Cam chính hãng.
              Dịch vụ chuyên nghiệp, tận tâm và uy tín hàng đầu Việt Nam.
            </p>
            <div className="flex gap-3 pt-2">
              {[
                { icon: Facebook, color: "hover:bg-[#1877F2]", text: "hover:text-white" },
                { icon: Youtube, color: "hover:bg-[#FF0000]", text: "hover:text-white" },
                { icon: Instagram, color: "hover:bg-[#E4405F]", text: "hover:text-white" },
                { icon: MessageSquare, color: "hover:bg-[#00B2FF]", text: "hover:text-white" }
              ].map((Item, idx) => (
                <a key={idx} href="#" className={`w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-slate-400 transition-all duration-300 ${Item.color} ${Item.text}`}>
                  <Item.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">SẢN PHẨM</h4>
            <ul className="space-y-4">
              <li><Link to="/?category=Flycam" className="text-slate-400 hover:text-blue-400 text-sm font-medium transition-colors block hover:translate-x-1 duration-300">Flycam Mới</Link></li>
              <li><Link to="/used-products" className="text-slate-400 hover:text-blue-400 text-sm font-medium transition-colors block hover:translate-x-1 duration-300">Flycam Cũ</Link></li>
              <li><Link to="/?category=Action Cam" className="text-slate-400 hover:text-blue-400 text-sm font-medium transition-colors block hover:translate-x-1 duration-300">Action Cam</Link></li>
            </ul>
          </div>

          {/* Links Column 2 (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Hỗ trợ</h4>
            <ul className="space-y-4">
              <li><Link to="/guides" className="text-slate-400 hover:text-blue-400 text-sm font-medium transition-colors block hover:translate-x-1 duration-300">Hướng dẫn bay</Link></li>
              <li><Link to="/warranty" className="text-slate-400 hover:text-blue-400 text-sm font-medium transition-colors block hover:translate-x-1 duration-300">Chính sách bảo hành</Link></li>
              <li><Link to="/returns" className="text-slate-400 hover:text-blue-400 text-sm font-medium transition-colors block hover:translate-x-1 duration-300">Đổi trả hàng</Link></li>
              <li><Link to="/shipping" className="text-slate-400 hover:text-blue-400 text-sm font-medium transition-colors block hover:translate-x-1 duration-300">Vận chuyển</Link></li>
            </ul>
          </div>

          {/* Contact & Stats (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">Liên hệ nhanh</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <MapPin size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  <span>TP.Hà Nội</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <Phone size={16} className="text-blue-500 shrink-0" />
                  <span className="font-bold text-slate-200">0394 300 132</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <Mail size={16} className="text-blue-500 shrink-0" />
                  <span>contact@kiendrone.vn</span>
                </li>
              </ul>
            </div>

            {/* Stats Mini Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <Eye size={12} /> Hôm nay
                </div>
                <div className="text-xl font-black text-white">{stats.today.toLocaleString()}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <User size={12} /> Tổng lượt
                </div>
                <div className="text-xl font-black text-white">{stats.total.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-slate-500">
            © {new Date().getFullYear()} KIEN DRONE. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              {/* Payment Icons */}
              <div className="flex gap-3 items-center opacity-70 ">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Visa_Logo.png/640px-Visa_Logo.png" className="h-4 object-contain" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 object-contain" alt="Mastercard" />
                <img src="https://logos-world.net/wp-content/uploads/2024/12/MoMo-Logo-New.png" className="h-4 object-contain" alt="MoMo" />
                <div className="h-5 px-1 bg-slate-800 text-[8px] font-black text-white flex items-center rounded border border-slate-700">COD</div>
              </div>
            </div>

            <div className="h-4 w-px bg-slate-800" />

            <a
              href="http://kiencode.io.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-500 transition-colors"
            >
              <span>Designed by kienit</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

import { ActivityTracker } from './utils/ActivityTracker';

const RouteTracker = () => {
  const location = useLocation();
  useEffect(() => {
    SessionTracker.updateLastPage(location.pathname);

    // Track Page View (debounce/filter could be added but simple is fine for now)
    // Only track main pages to meaningful names
    let pageName = location.pathname;
    if (pageName === '/') pageName = 'Trang chủ';
    else if (pageName.startsWith('/product/')) pageName = 'Xem sản phẩm';
    else if (pageName === '/cart') pageName = 'Xem giỏ hàng';
    else if (pageName === '/checkout') pageName = 'Đặt hàng';

    ActivityTracker.track('view_page', `Đang xem: ${pageName}`);
  }, [location]);
  return null;
};

const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow mt-[130px] md:mt-[180px] pb-12">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App = () => {
  useEffect(() => {
    SessionTracker.init();
  }, []);

  return (
    <CartProvider>
      <Router>
        <RouteTracker />
        <CartToast />
        <CookieConsent />
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="discounts" element={<DiscountList />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="blogs" element={<BlogList />} />
            <Route path="blogs/new" element={<BlogForm />} />
            <Route path="blogs/edit/:id" element={<BlogForm />} />
            <Route path="guides" element={<GuideList />} />
            <Route path="guides/new" element={<GuideForm />} />
            <Route path="guides/edit/:id" element={<GuideForm />} />
            <Route path="banners" element={<BannerList />} />
            <Route path="banners/new" element={<BannerForm />} />
            <Route path="banners/edit/:id" element={<BannerForm />} />
            <Route path="pages" element={<PageList />} />
            <Route path="users" element={<UserList />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/used-products" element={<UsedProducts />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/warranty" element={<Warranty />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:id" element={<GuideDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="my-orders" element={<MyOrders />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
