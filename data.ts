
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'DJI Mavic 3 Pro',
    brand: 'DJI',
    category: 'Flycam',
    subCategory: 'DJI Mavic',
    condition: 'Mới',
    price: 45900000,
    image: 'https://flycamgiare.vn/wp-content/uploads/2023/07/Flycam-Mavic-3-Pro-new-bg.jpg',
    description: 'Flycam hàng đầu thế giới với hệ thống 3 camera Hasselblad, quay video 5.1K.',
    detailedDescription: {
      overview: 'Mavic 3 Pro là bước tiến mới nhất của DJI trong lĩnh vực flycam dân dụng cao cấp.',
      features: ['Hệ thống 3 camera Hasselblad', 'Quay video 5.1K/50fps', 'Thời gian bay 43 phút'],
      whatsInBox: ['Máy bay', 'Điều khiển DJI RC', 'Pin', 'Cáp sạc']
    },
    rating: 4.9,
    stock: 5,
    specs: { 'Cảm biến': '4/3 CMOS', 'Độ phân giải': '20MP', 'Bay': '43 phút' }
  },
  {
    id: '2',
    name: 'GoPro HERO12 Black',
    brand: 'GoPro',
    category: 'Action Cam',
    subCategory: 'GoPro HERO',
    condition: 'Mới',
    price: 9900000,
    image: 'https://product.hstatic.net/1000234350/product/hero_12_2_2d21b6fa58a24438b98041fdba8414f1_grande.jpg',
    description: 'Chất lượng hình ảnh tốt nhất với video 5.3K HDR.',
    detailedDescription: {
      overview: 'HERO12 Black đưa chất lượng hình ảnh GoPro lên tầm cao mới.',
      features: ['Video 5.3K60', 'HyperSmooth 6.0', 'Chống nước 10m'],
      whatsInBox: ['Camera', 'Pin Enduro', 'Giá gắn']
    },
    rating: 4.8,
    stock: 12,
    specs: { 'Video': '5.3K60', 'Chống rung': 'HyperSmooth 6.0' }
  },
  {
    id: '3',
    name: 'DJI Mini 4 Pro',
    brand: 'DJI',
    category: 'Flycam',
    subCategory: 'DJI Mini',
    condition: 'Mới',
    price: 19500000,
    image: 'https://flycamgiare.vn/wp-content/uploads/2023/09/Flycam-DJI-Mini-4-Pro.png',
    description: 'Nhỏ gọn dưới 249g, cảm biến đa hướng.',
    detailedDescription: {
      overview: 'Mini 4 Pro là flycam mini tiên tiến nhất của DJI.',
      features: ['Dưới 249g', 'Quay dọc 4K/60fps', 'Cảm biến đa hướng'],
      whatsInBox: ['Máy bay', 'Pin', 'Cáp']
    },
    rating: 4.7,
    stock: 10,
    specs: { 'Trọng lượng': '249g', 'Bay': '34 phút' }
  },
  {
    id: '4',
    name: 'Insta360 X4',
    brand: 'Insta360',
    category: 'Action Cam',
    subCategory: 'Insta360',
    condition: 'Mới',
    price: 13500000,
    image: 'https://tokyocamera.vn/wp-content/uploads/2024/04/Insta360-X4-4.jpg',
    description: 'Quay phim 8K 360 độ siêu nét.',
    detailedDescription: {
      overview: 'X4 mang đến độ phân giải 8K kỷ lục cho camera 360.',
      features: ['Video 8K 360', 'Màn hình 2.5 inch', 'Chế độ 4K Single lens'],
      whatsInBox: ['Camera', 'Bảo vệ lens', 'Cáp']
    },
    rating: 4.9,
    stock: 8,
    specs: { 'Độ phân giải': '8K 360', 'Màn hình': '2.5 inch' }
  },
  {
    id: '5',
    name: 'DJI Air 3',
    brand: 'DJI',
    category: 'Flycam',
    subCategory: 'DJI Air',
    condition: 'Mới',
    price: 32500000,
    image: 'https://flycamgiare.vn/wp-content/uploads/2023/07/DJI-Air-3-bg.png',
    description: 'Hệ thống camera kép 1/1.3 inch CMOS.',
    detailedDescription: {
      overview: 'DJI Air 3 sở hữu hệ thống camera kép đầu tiên của dòng Air.',
      features: ['Camera kép', 'Bay 46 phút', 'O4 Image Transmission'],
      whatsInBox: ['Máy bay', '3 Pin', 'Sạc', 'Túi đựng']
    },
    rating: 4.9,
    stock: 4,
    specs: { 'Camera': 'Kép 48MP', 'Bay': '46 phút' }
  },
  {
    id: '10',
    name: 'DJI Mini 2 SE',
    brand: 'DJI',
    category: 'Flycam',
    subCategory: 'DJI Mini',
    condition: 'Mới',
    price: 7500000,
    image: 'https://product.hstatic.net/1000340975/product/dronerc-n1-1jpg_5df003d3c64248d39f37c0ee0e2a3f74_master.jpg',
    description: 'Lựa chọn hoàn hảo cho người mới với mức giá cực tốt.',
    detailedDescription: {
      overview: 'Dễ bay, nhỏ gọn và quay video 2.7K sắc nét.',
      features: ['Truyền tin 10km', 'Bay 31 phút', 'Dưới 249g'],
      whatsInBox: ['Máy bay', 'Remote', 'Pin', 'Cáp']
    },
    rating: 4.6,
    stock: 20,
    specs: { 'Video': '2.7K', 'Trọng lượng': '246g' }
  },
  {
    id: '11',
    name: 'Insta360 Ace Pro',
    brand: 'Insta360',
    category: 'Action Cam',
    subCategory: 'Insta360',
    condition: 'Mới',
    price: 11500000,
    image: 'https://cdn2.cellphones.com.vn/x/media/catalog/product/c/a/camera-hanh-trinh-insta360-ace-pro_9__1_2.png',
    description: 'Cùng Leica định nghĩa lại chất lượng Action Cam.',
    detailedDescription: {
      overview: 'Ống kính Leica cao cấp và cảm biến 1/1.3 inch cho chất lượng ban đêm tuyệt vời.',
      features: ['Video 8K', 'Màn hình lật', 'AI Highlights'],
      whatsInBox: ['Camera', 'Giá gắn', 'Pin']
    },
    rating: 4.8,
    stock: 7,
    specs: { 'Ống kính': 'Leica Summarit', 'Video': '8K/24fps' }
  },
  {
    id: '12',
    name: 'GoPro HERO10 Black (Like New)',
    brand: 'GoPro',
    category: 'Action Cam',
    subCategory: 'GoPro HERO',
    condition: 'Cũ (Like New)',
    price: 5200000,
    image: 'https://phukienflytech.vn/wp-content/uploads/2022/02/phu-kien-flytech-gopro-cu-gia-re-gopro-10-cu-1.png',
    description: 'Chip G2 mạnh mẽ, ngoại hình 99% không vết xước.',
    detailedDescription: {
      overview: 'Dòng camera huyền thoại vẫn rất mạnh mẽ ở thời điểm hiện tại.',
      features: ['Video 5.3K', 'Chip G2', 'HyperSmooth 4.0'],
      whatsInBox: ['Camera', '2 Pin', 'Sạc đôi']
    },
    rating: 4.7,
    stock: 3,
    specs: { 'Video': '5.3K', 'Trạng thái': '99%' }
  },
  {
    id: '13',
    name: 'Thẻ nhớ SanDisk Extreme Pro 128GB',
    brand: 'SanDisk',
    category: 'Phụ kiện',
    subCategory: 'Khác',
    condition: 'Mới',
    price: 550000,
    image: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/329/122/products/the-nho-sdxc-sandisk-extreme-pro-u3-v30-128gb-200mb-s-sdsdxxd-128g-gn4in-01.jpg?v=1758522598977',
    description: 'Tốc độ ghi cực nhanh, tối ưu cho quay video 4K/5.1K.',
    detailedDescription: {
      overview: 'Đảm bảo không bao giờ bị giật lag hay mất file khi đang quay flycam.',
      features: ['Tốc độ 200MB/s', 'V30', 'UHS-I'],
      whatsInBox: ['Thẻ nhớ']
    },
    rating: 4.9,
    stock: 50,
    specs: { 'Dung lượng': '128GB', 'Tốc độ': '200MB/s' }
  },
  {
    id: '14',
    name: 'DJI Mavic Air 2 (95%)',
    brand: 'DJI',
    category: 'Flycam',
    subCategory: 'DJI Air',
    condition: 'Cũ (95%)',
    price: 13900000,
    image: 'https://dji-vietnam.vn/wp-content/uploads/2021/02/Mavic-Air-2-Combo-co-dang-mua.jpg',
    description: 'Khả năng quay 4K/60fps ổn định trong tầm giá.',
    detailedDescription: {
      overview: 'Máy có trầy xước nhẹ ở vỏ nhưng động cơ và camera hoạt động hoàn hảo.',
      features: ['4K/60fps', 'Bay 34 phút', 'Cảm biến vật cản'],
      whatsInBox: ['Máy bay', 'Remote', '2 Pin', 'Sạc']
    },
    rating: 4.3,
    stock: 1,
    specs: { 'Video': '4K/60fps', 'Trạng thái': '95%' }
  },
  {
    id: '16',
    name: 'DJI Mini3 (95%)',
    brand: 'DJI',
    category: 'Flycam',
    subCategory: 'DJI Air',
    condition: 'Cũ (95%)',
    price: 7900000,
    image: 'https://product.hstatic.net/200000843159/product/mini_3_3fda50a7909249e4b6413d7484e221f2_master.jpg',
    description: 'Khả năng quay 4K/60fps ổn định trong tầm giá.',
    detailedDescription: {
      overview: 'Máy có trầy xước nhẹ ở vỏ nhưng động cơ và camera hoạt động hoàn hảo.',
      features: ['4K/60fps', 'Bay 34 phút', 'Cảm biến vật cản'],
      whatsInBox: ['Máy bay', 'Remote', '2 Pin', 'Sạc']
    },
    rating: 4.8,
    stock: 1,
    specs: { 'Video': '4K/60fps', 'Trạng thái': '95%' }
  },
  {
    id: '15',
    name: 'Bộ Filter ND/PL cho DJI Mini 4 Pro',
    brand: 'SunnyLife',
    category: 'Phụ kiện',
    subCategory: 'Khác',
    condition: 'Mới',
    price: 850000,
    image: 'https://tokyocamera.vn/wp-content/uploads/2023/09/dji-mini-4-pro-nd-filters-set-16-256-3.jpg',
    description: 'Giúp video mượt mà hơn và chống lóa trong điều kiện nắng gắt.',
    detailedDescription: {
      overview: 'Phụ kiện không thể thiếu cho các nhà làm phim chuyên nghiệp bằng flycam.',
      features: ['Kính quang học', 'Chống xước', 'Lắp đặt nhanh'],
      whatsInBox: ['Bộ 6 filter', 'Hộp đựng']
    },
    rating: 4.8,
    stock: 15,
    specs: { 'Loại': 'ND/PL', 'Bộ lọc': '6 cái' }
  }
];
