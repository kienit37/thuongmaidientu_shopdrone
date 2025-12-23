
-- 1. Thêm các cột còn thiếu vào bảng products
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_price numeric;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_on_sale boolean DEFAULT false;

-- 2. Thêm ràng buộc UNIQUE cho cột name để hỗ trợ lệnh ON CONFLICT (nếu chưa có)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_name_key') THEN
        ALTER TABLE products ADD CONSTRAINT products_name_key UNIQUE (name);
    END IF;
END $$;

-- 3. Cập nhật dữ liệu sản phẩm
INSERT INTO products (name, brand, category, sub_category, condition, price, image, description, detailed_description, specs, rating, stock, is_on_sale, discount_price)
VALUES 
(
  'DJI Mavic 3 Pro', 'DJI', 'Flycam', 'DJI Mavic', 'Mới', 49900000, 
  'https://flycamgiare.vn/wp-content/uploads/2023/07/Flycam-Mavic-3-Pro-new-bg.jpg', 
  'Flycam hàng đầu thế giới với hệ thống 3 camera Hasselblad, quay video 5.1K.', 
  '{"overview": "Mavic 3 Pro là bước tiến mới nhất của DJI trong lĩnh vực flycam dân dụng cao cấp.", "features": ["Hệ thống 3 camera Hasselblad", "Quay video 5.1K/50fps", "Thời gian bay 43 phút"], "whatsInBox": ["Máy bay", "Điều khiển DJI RC", "Pin", "Cáp sạc"], "images": ["", "", "", ""], "variants": [{"name": "Bản đơn 1 pin", "price": 45900000}, {"name": "Combo 2 pin", "price": 49900000}, {"name": "Combo 3 pin", "price": 53900000}]}'::jsonb, 
  '{"Cảm biến": "4/3 CMOS", "Độ phân giải": "20MP", "Bay": "43 phút"}'::jsonb, 
  4.9, 5, true, 45900000
),
(
  'GoPro HERO12 Black', 'GoPro', 'Action Cam', 'GoPro HERO', 'Mới', 11900000, 
  'https://product.hstatic.net/1000234350/product/hero_12_2_2d21b6fa58a24438b98041fdba8414f1_grande.jpg', 
  'Chất lượng hình ảnh tốt nhất với video 5.3K HDR.', 
  '{"overview": "HERO12 Black đưa chất lượng hình ảnh GoPro lên tầm cao mới.", "features": ["Video 5.3K60", "HyperSmooth 6.0", "Chống nước 10m"], "whatsInBox": ["Camera", "Pin Enduro", "Giá gắn"], "images": ["", "", "", ""], "variants": [{"name": "Bản đơn", "price": 9900000}, {"name": "Combo Phượt (2 Pin + Thẻ)", "price": 11500000}, {"name": "Combo Creator (Gậy + Mic)", "price": 13900000}]}'::jsonb, 
  '{"Video": "5.3K60", "Chống rung": "HyperSmooth 6.0"}'::jsonb, 
  4.8, 12, true, 9900000
),
(
  'DJI Mini 4 Pro', 'DJI', 'Flycam', 'DJI Mini', 'Mới', 21500000, 
  'https://flycamgiare.vn/wp-content/uploads/2023/09/Flycam-DJI-Mini-4-Pro.png', 
  'Nhỏ gọn dưới 249g, cảm biến đa hướng.', 
  '{"overview": "Mini 4 Pro là flycam mini tiên tiến nhất của DJI.", "features": ["Dưới 249g", "Quay dọc 4K/60fps", "Cảm biến đa hướng"], "whatsInBox": ["Máy bay", "Pin", "Cáp"], "images": ["", "", "", ""], "variants": [{"name": "Bản đơn 1 pin", "price": 19500000}, {"name": "Combo 2 pin", "price": 22500000}, {"name": "Combo 3 pin", "price": 25500000}]}'::jsonb, 
  '{"Trọng lượng": "249g", "Bay": "34 phút"}'::jsonb, 
  4.7, 10, true, 19500000
),
(
  'Insta360 X4', 'Insta360', 'Action Cam', 'Insta360', 'Mới', 14500000, 
  'https://tokyocamera.vn/wp-content/uploads/2024/04/Insta360-X4-4.jpg', 
  'Quay phim 8K 360 độ siêu nét.', 
  '{"overview": "X4 mang đến độ phân giải 8K kỷ lục cho camera 360.", "features": ["Video 8K 360", "Màn hình 2.5 inch", "Chế độ 4K Single lens"], "whatsInBox": ["Camera", "Bảo vệ lens", "Cáp"], "images": ["", "", "", ""], "variants": [{"name": "Bản Standard", "price": 13500000}, {"name": "Get-Set Kit", "price": 14900000}, {"name": "Motorcycle Kit", "price": 16500000}]}'::jsonb, 
  '{"Độ phân giải": "8K 360", "Màn hình": "2.5 inch"}'::jsonb, 
  4.9, 8, true, 13500000
),
(
  'DJI Air 3', 'DJI', 'Flycam', 'DJI Air', 'Mới', 35500000, 
  'https://flycamgiare.vn/wp-content/uploads/2023/07/DJI-Air-3-bg.png', 
  'Hệ thống camera kép 1/1.3 inch CMOS.', 
  '{"overview": "DJI Air 3 sở hữu hệ thống camera kép đầu tiên của dòng Air.", "features": ["Camera kép", "Bay 46 phút", "O4 Image Transmission"], "whatsInBox": ["Máy bay", "3 Pin", "Sạc", "Túi đựng"], "images": ["", "", "", ""], "variants": [{"name": "Bản đơn 1 pin", "price": 32500000}, {"name": "Combo 2 pin", "price": 36500000}, {"name": "Combo 3 pin", "price": 39900000}]}'::jsonb, 
  '{"Camera": "Kép 48MP", "Bay": "46 phút"}'::jsonb, 
  4.9, 4, true, 32500000
),
(
  'DJI Mini 2 SE', 'DJI', 'Flycam', 'DJI Mini', 'Mới', 8900000, 
  'https://product.hstatic.net/1000340975/product/dronerc-n1-1jpg_5df003d3c64248d39f37c0ee0e2a3f74_master.jpg', 
  'Lựa chọn hoàn hảo cho người mới với mức giá cực tốt.', 
  '{"overview": "Dễ bay, nhỏ gọn và quay video 2.7K sắc nét.", "features": ["Truyền tin 10km", "Bay 31 phút", "Dưới 249g"], "whatsInBox": ["Máy bay", "Remote", "Pin", "Cáp"], "images": ["", "", "", ""], "variants": [{"name": "Bản đơn 1 pin", "price": 7500000}, {"name": "Combo 2 pin", "price": 9500000}, {"name": "Combo 3 pin", "price": 11500000}]}'::jsonb, 
  '{"Video": "2.7K", "Trọng lượng": "246g"}'::jsonb, 
  4.6, 20, true, 7500000
),
(
  'Insta360 Ace Pro', 'Insta360', 'Action Cam', 'Insta360', 'Mới', 12500000, 
  'https://cdn2.cellphones.com.vn/x/media/catalog/product/c/a/camera-hanh-trinh-insta360-ace-pro_9__1_2.png', 
  'Cùng Leica định nghĩa lại chất lượng Action Cam.', 
  '{"overview": "Ống kính Leica cao cấp và cảm biến 1/1.3 inch cho chất lượng ban đêm tuyệt vời.", "features": ["Video 8K", "Màn hình lật", "AI Highlights"], "whatsInBox": ["Camera", "Giá gắn", "Pin"], "images": ["", "", "", ""], "variants": [{"name": "Bản đơn", "price": 11500000}, {"name": "Combo 2 pin", "price": 13500000}]}'::jsonb, 
  '{"Ống kính": "Leica Summarit", "Video": "8K/24fps"}'::jsonb, 
  4.8, 7, true, 11500000
),
(
  'GoPro HERO10 Black (Like New)', 'GoPro', 'Action Cam', 'GoPro HERO', 'Cũ (Like New)', 6500000, 
  'https://phukienflytech.vn/wp-content/uploads/2022/02/phu-kien-flytech-gopro-cu-gia-re-gopro-10-cu-1.png', 
  'Chip G2 mạnh mẽ, ngoại hình 99% không vết xước.', 
  '{"overview": "Dòng camera huyền thoại vẫn rất mạnh mẽ ở thời điểm hiện tại.", "features": ["Video 5.3K", "Chip G2", "HyperSmooth 4.0"], "whatsInBox": ["Camera", "2 Pin", "Sạc đôi"], "images": ["", "", "", ""], "variants": [{"name": "Máy trần", "price": 5200000}, {"name": "Full PK (Gậy + Thẻ)", "price": 6200000}]}'::jsonb, 
  '{"Video": "5.3K", "Trạng thái": "99%"}'::jsonb, 
  4.7, 3, true, 5200000
),
(
  'Thẻ nhớ SanDisk Extreme Pro 128GB', 'SanDisk', 'Phụ kiện', 'Khác', 'Mới', 750000, 
  'https://bizweb.dktcdn.net/thumb/1024x1024/100/329/122/products/the-nho-sdxc-sandisk-extreme-pro-u3-v30-128gb-200mb-s-sdsdxxd-128g-gn4in-01.jpg?v=1758522598977', 
  'Tốc độ ghi cực nhanh, tối ưu for quay video 4K/5.1K.', 
  '{"overview": "Đảm bảo không bao giờ bị giật lag hay mất file khi đang quay flycam.", "features": ["Tốc độ 200MB/s", "V30", "UHS-I"], "whatsInBox": ["Thẻ nhớ"], "images": ["", "", "", ""], "variants": [{"name": "128GB", "price": 550000}, {"name": "256GB", "price": 950000}]}'::jsonb, 
  '{"Dung lượng": "128GB", "Tốc độ": "200MB/s"}'::jsonb, 
  4.9, 50, true, 550000
),
(
  'DJI Mavic Air 2 (95%)', 'DJI', 'Flycam', 'DJI Air', 'Cũ (95%)', 15900000, 
  'https://dji-vietnam.vn/wp-content/uploads/2021/02/Mavic-Air-2-Combo-co-dang-mua.jpg', 
  'Khả năng quay 4K/60fps ổn định trong tầm giá.', 
  '{"overview": "Máy có trầy xước nhẹ ở vỏ nhưng động cơ và camera hoạt động hoàn hảo.", "features": ["4K/60fps", "Bay 34 phút", "Cảm biến vật cản"], "whatsInBox": ["Máy bay", "Remote", "2 Pin", "Sạc"], "images": ["", "", "", ""], "variants": [{"name": "Combo 2 Pin", "price": 13900000}, {"name": "Combo 3 Pin", "price": 15900000}]}'::jsonb, 
  '{"Video": "4K/60fps", "Trạng thái": "95%"}'::jsonb, 
  4.3, 1, true, 13900000
),
(
  'DJI Mini3 (95%)', 'DJI', 'Flycam', 'DJI Air', 'Cũ (95%)', 9500000, 
  'https://product.hstatic.net/200000843159/product/mini_3_3fda50a7909249e4b6413d7484e221f2_master.jpg', 
  'Khả năng quay 4K/60fps ổn định trong tầm giá.', 
  '{"overview": "Máy có trầy xước nhẹ ở vỏ nhưng động cơ và camera hoạt động hoàn hảo.", "features": ["4K/60fps", "Bay 34 phút", "Cảm biến vật cản"], "whatsInBox": ["Máy bay", "Remote", "2 Pin", "Sạc"], "images": ["", "", "", ""], "variants": [{"name": "Bản đơn 1 Pin", "price": 7900000}, {"name": "Combo 2 Pin", "price": 9500000}]}'::jsonb, 
  '{"Video": "4K/60fps", "Trạng thái": "95%"}'::jsonb, 
  4.8, 1, true, 7900000
),
(
  'Bộ Filter ND/PL cho DJI Mini 4 Pro', 'SunnyLife', 'Phụ kiện', 'Khác', 'Mới', 1050000, 
  'https://tokyocamera.vn/wp-content/uploads/2023/09/dji-mini-4-pro-nd-filters-set-16-256-3.jpg', 
  'Giúp video mượt mà hơn và chống lóa trong điều kiện nắng gắt.', 
  '{"overview": "Phụ kiện không thể thiếu cho các nhà làm phim chuyên nghiệp bằng flycam.", "features": ["Kính quang học", "Chống xước", "Lắp đặt nhanh"], "whatsInBox": ["Bộ 6 filter", "Hộp đựng"], "images": ["", "", "", ""], "variants": [{"name": "Bộ 6 Filter", "price": 850000}, {"name": "Bộ 8 Filter", "price": 1150000}]}'::jsonb, 
  '{"Loại": "ND/PL", "Bộ lọc": "6 cái"}'::jsonb, 
  4.8, 15, true, 850000
)
ON CONFLICT (name) DO UPDATE SET 
  detailed_description = EXCLUDED.detailed_description,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  is_on_sale = EXCLUDED.is_on_sale;
