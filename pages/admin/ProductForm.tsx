
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminSupabase as supabase } from '../../supabaseClient';
import { Save, ArrowLeft, Plus, X, Package, Tag, Image as ImageIcon, FileText, Settings, Layout, Info, CheckCircle2 } from 'lucide-react';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'detail' | 'specs'>('basic');

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: 'Flycam',
        sub_category: '',
        condition: 'Mới',
        price: 0,
        discount_price: 0,
        is_on_sale: false,
        image: '',
        description: '',
        stock: 0,
        rating: 5,
        detailed_description: {
            overview: '',
            features: [''],
            whatsInBox: [''],
            images: ['', '', '', ''],
            variants: [] as { name: string, price: number }[]
        },
        specs: {}
    });

    const [specsList, setSpecsList] = useState<{ key: string, value: string }[]>([{ key: '', value: '' }]);

    useEffect(() => {
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (data) {
            const specsArray = data.specs ? Object.entries(data.specs).map(([key, value]) => ({ key, value: value as string })) : [];
            if (specsArray.length === 0) specsArray.push({ key: '', value: '' });

            setFormData({
                ...data,
                detailed_description: {
                    overview: data.detailed_description?.overview || '',
                    features: data.detailed_description?.features || [''],
                    whatsInBox: data.detailed_description?.whatsInBox || [''],
                    images: data.detailed_description?.images || ['', '', '', ''],
                    variants: data.detailed_description?.variants || []
                }
            });
            setSpecsList(specsArray);
        }
    };

    const handleArrayChange = (field: 'features' | 'whatsInBox', index: number, value: string) => {
        const newArray = [...formData.detailed_description[field]];
        newArray[index] = value;
        setFormData(prev => ({
            ...prev,
            detailed_description: {
                ...prev.detailed_description,
                [field]: newArray
            }
        }));
    };

    const addArrayItem = (field: 'features' | 'whatsInBox') => {
        setFormData(prev => ({
            ...prev,
            detailed_description: {
                ...prev.detailed_description,
                [field]: [...prev.detailed_description[field], '']
            }
        }));
    };

    const removeArrayItem = (field: 'features' | 'whatsInBox', index: number) => {
        const newArray = formData.detailed_description[field].filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            detailed_description: {
                ...prev.detailed_description,
                [field]: newArray
            }
        }));
    };

    const handleVariantChange = (index: number, field: 'name' | 'price', value: string | number) => {
        const newVariants = [...formData.detailed_description.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData(prev => ({
            ...prev,
            detailed_description: {
                ...prev.detailed_description,
                variants: newVariants
            }
        }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            detailed_description: {
                ...prev.detailed_description,
                variants: [...(prev.detailed_description.variants || []), { name: '', price: formData.price }]
            }
        }));
    };

    const removeVariant = (index: number) => {
        const newVariants = formData.detailed_description.variants.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            detailed_description: {
                ...prev.detailed_description,
                variants: newVariants
            }
        }));
    };

    const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
        const newSpecs = [...specsList];
        newSpecs[index][field] = val;
        setSpecsList(newSpecs);
    };

    const saveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const specsObj = specsList.reduce((acc, curr) => {
            if (curr.key) acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        const payload = {
            name: formData.name,
            brand: formData.brand,
            category: formData.category,
            sub_category: formData.sub_category,
            condition: formData.condition,
            price: formData.price,
            discount_price: formData.discount_price,
            is_on_sale: formData.is_on_sale,
            image: formData.image,
            description: formData.description,
            stock: formData.stock,
            rating: formData.rating,
            detailed_description: formData.detailed_description,
            specs: specsObj
        };

        if (isEdit) {
            await supabase.from('products').update(payload).eq('id', id);
        } else {
            await supabase.from('products').insert([payload]);
        }
        setLoading(false);
        navigate('/admin/products');
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm border border-slate-100 transition-all active:scale-90"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">Kho hàng hệ thống</p>
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                            {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={saveProduct}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? <span className="animate-spin">⏳</span> : <Save size={16} />}
                        {isEdit ? 'Lưu sản phẩm' : 'Đăng sản phẩm'}
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-8 bg-slate-100/50 p-1.5 rounded-[1.5rem] w-fit">
                {[
                    { id: 'basic', name: 'Thông tin cơ bản', icon: Info },
                    { id: 'detail', name: 'Chi tiết & Hình ảnh', icon: Layout },
                    { id: 'specs', name: 'Thông số kỹ thuật', icon: Settings }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <tab.icon size={14} />
                        {tab.name}
                    </button>
                ))}
            </div>

            <form onSubmit={saveProduct}>
                {activeTab === 'basic' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="admin-card">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Tag size={20} /></div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Tên & Thương hiệu</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="form-group">
                                        <label className="form-label">Tên sản phẩm đầy đủ</label>
                                        <input className="form-input" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ví dụ: DJI Mini 4 Pro Fly More Combo" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group">
                                            <label className="form-label">Thương hiệu</label>
                                            <input className="form-input" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} placeholder="DJI, Autel, Sony..." />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Danh mục chính</label>
                                            <select className="form-input appearance-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                                <option value="Flycam">Flycam</option>
                                                <option value="Action Cam">Action Cam</option>
                                                <option value="Phụ kiện">Phụ kiện</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Mô tả ngắn gọn (SEO)</label>
                                        <textarea className="form-input min-h-[100px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Tóm tắt ngắn gọn về sản phẩm..." />
                                    </div>
                                </div>
                            </div>

                            <div className="admin-card">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={20} /></div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Giá & Tồn kho</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="form-group">
                                        <label className="form-label">Giá niêm yết (VNĐ)</label>
                                        <div className="relative">
                                            <input type="number" className="form-input pl-14 font-black" required value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₫</span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label text-rose-500">Giá khuyến mãi (Nếu có)</label>
                                        <div className="relative">
                                            <input type="number" className="form-input pl-14 font-black text-rose-600 border-rose-100 bg-rose-50/20" value={formData.discount_price} onChange={e => setFormData({ ...formData, discount_price: Number(e.target.value), is_on_sale: Number(e.target.value) > 0 })} />
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-300 font-bold">₫</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center gap-6">
                                    <div className="form-group flex-1">
                                        <label className="form-label">Số lượng trong kho</label>
                                        <input type="number" className="form-input" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} />
                                    </div>
                                    <div className="flex-1 flex items-end pb-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={formData.is_on_sale}
                                                    onChange={e => setFormData({ ...formData, is_on_sale: e.target.checked })}
                                                />
                                                <div className={`w-12 h-6 rounded-full transition-colors ${formData.is_on_sale ? 'bg-rose-500' : 'bg-slate-200'}`}></div>
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_on_sale ? 'translate-x-6 shadow-md' : 'translate-x-0'}`}></div>
                                            </div>
                                            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Kích hoạt Giảm giá</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="admin-card">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><ImageIcon size={20} /></div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Ảnh đại diện</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="form-group">
                                        <label className="form-label">Đường dẫn ảnh (URL)</label>
                                        <input className="form-input" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                                    </div>
                                    <div className="relative aspect-square bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center group transition-all hover:border-blue-300">
                                        {formData.image ? (
                                            <img src={formData.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
                                        ) : (
                                            <div className="text-center p-8">
                                                <ImageIcon size={48} className="text-slate-200 mx-auto mb-4" />
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chưa có ảnh</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="admin-card">
                                <div className="form-group">
                                    <label className="form-label">Trạng thái máy</label>
                                    <select className="form-input" value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })}>
                                        <option value="Mới">Mới 100% (New)</option>
                                        <option value="Cũ">Đã qua sử dụng (Used)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'detail' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="admin-card">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><FileText size={20} /></div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Nội dung chi tiết (Overview)</h3>
                            </div>
                            <textarea className="form-input min-h-[300px]" value={formData.detailed_description.overview}
                                onChange={e => setFormData({ ...formData, detailed_description: { ...formData.detailed_description, overview: e.target.value } })}
                                placeholder="Nhập bài giới thiệu chi tiết về sản phẩm..."
                            />
                        </div>

                        <div className="admin-card">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><ImageIcon size={20} /></div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Ảnh chi tiết sản phẩm (Tối đa 4 ảnh)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[0, 1, 2, 3].map((idx) => (
                                    <div key={idx} className="space-y-4">
                                        <div className="form-group">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Ảnh {idx + 1}</label>
                                            <input
                                                className="form-input text-[11px]"
                                                placeholder="URL ảnh..."
                                                value={formData.detailed_description.images?.[idx] || ''}
                                                onChange={e => {
                                                    const newImages = [...(formData.detailed_description.images || ['', '', '', ''])];
                                                    newImages[idx] = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        detailed_description: { ...formData.detailed_description, images: newImages }
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="aspect-[4/3] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center">
                                            {formData.detailed_description.images?.[idx] ? (
                                                <img src={formData.detailed_description.images[idx]} className="w-full h-full object-cover" alt={`Detailed ${idx}`} />
                                            ) : (
                                                <ImageIcon size={24} className="text-slate-100" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="admin-card">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Package size={20} /></div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Các phiên bản & Giá tương ứng</h3>
                                </div>
                                <button type="button" onClick={addVariant} className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-50 px-3 py-2 rounded-xl transition-all"><Plus size={14} /> Thêm phiên bản</button>
                            </div>
                            <div className="space-y-4">
                                {(formData.detailed_description.variants || []).map((variant, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                                        <div className="flex-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tên phiên bản</label>
                                            <input
                                                className="form-input bg-white"
                                                value={variant.name}
                                                onChange={e => handleVariantChange(idx, 'name', e.target.value)}
                                                placeholder="VD: Bản 1 Pin, Combo 3 Pin..."
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Giá tương ứng (₫)</label>
                                            <input
                                                type="number"
                                                className="form-input bg-white font-bold"
                                                value={variant.price}
                                                onChange={e => handleVariantChange(idx, 'price', Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <button type="button" onClick={() => removeVariant(idx)} className="w-12 h-12 bg-white text-rose-400 hover:text-rose-600 rounded-xl flex items-center justify-center border border-slate-200 transition-all shadow-sm"><X size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                                {(!formData.detailed_description.variants || formData.detailed_description.variants.length === 0) && (
                                    <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sản phẩm này chưa có nhiều phiên bản</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="admin-card">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={20} /></div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Tính năng nổi bật</h3>
                                    </div>
                                    <button type="button" onClick={() => addArrayItem('features')} className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-50 px-3 py-2 rounded-xl transition-all"><Plus size={14} /> Thêm dòng</button>
                                </div>
                                <div className="space-y-3">
                                    {formData.detailed_description.features.map((item, idx) => (
                                        <div key={idx} className="flex gap-3 group">
                                            <input className="form-input" value={item} onChange={e => handleArrayChange('features', idx, e.target.value)} placeholder="Nhập một tính năng sản phẩm..." />
                                            <button type="button" onClick={() => removeArrayItem('features', idx)} className="w-12 h-12 bg-rose-50 text-rose-400 hover:text-rose-600 rounded-xl flex items-center justify-center transition-all group-hover:bg-rose-100"><X size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="admin-card">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><Package size={20} /></div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Bộ sản phẩm gồm</h3>
                                    </div>
                                    <button type="button" onClick={() => addArrayItem('whatsInBox')} className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-50 px-3 py-2 rounded-xl transition-all"><Plus size={14} /> Thêm dòng</button>
                                </div>
                                <div className="space-y-3">
                                    {formData.detailed_description.whatsInBox.map((item, idx) => (
                                        <div key={idx} className="flex gap-3 group">
                                            <input className="form-input" value={item} onChange={e => handleArrayChange('whatsInBox', idx, e.target.value)} placeholder="Tên phụ kiện đi kèm..." />
                                            <button type="button" onClick={() => removeArrayItem('whatsInBox', idx)} className="w-12 h-12 bg-rose-50 text-rose-400 hover:text-rose-600 rounded-xl flex items-center justify-center transition-all group-hover:bg-rose-100"><X size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'specs' && (
                    <div className="admin-card animate-in fade-in duration-500">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center"><Settings size={20} /></div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Thông số kỹ thuật nâng cao</h3>
                            </div>
                            <button type="button" onClick={() => setSpecsList([...specsList, { key: '', value: '' }])} className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all border border-blue-100"><Plus size={14} /> Thêm thông số mới</button>
                        </div>
                        <div className="space-y-4">
                            {specsList.map((spec, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-200 transition-all group">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Tên thông số</label>
                                        <input className="form-input bg-white" placeholder="VD: Trọng lượng, Khoảng cách..." value={spec.key} onChange={e => handleSpecChange(idx, 'key', e.target.value)} />
                                    </div>
                                    <div className="flex-[2] flex gap-4 items-end">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Giá trị</label>
                                            <input className="form-input bg-white" placeholder="VD: 249g, 10km..." value={spec.value} onChange={e => handleSpecChange(idx, 'value', e.target.value)} />
                                        </div>
                                        <button type="button" onClick={() => setSpecsList(specsList.filter((_, i) => i !== idx))} className="w-12 h-12 bg-white text-rose-400 hover:text-rose-600 rounded-xl flex items-center justify-center border border-slate-200 group-hover:border-rose-100 shadow-sm"><X size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {specsList.length === 0 && (
                            <div className="py-20 text-center">
                                <Settings size={48} className="text-slate-100 mx-auto mb-4" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chưa có thông số kỹ thuật nào</p>
                            </div>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ProductForm;
