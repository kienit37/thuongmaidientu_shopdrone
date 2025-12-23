
-- 1. Tạo bảng site_visits để theo dõi lượt truy cập
create table if not exists site_visits (
  id uuid default uuid_generate_v4() primary key,
  session_id text,
  created_at timestamp with time zone default now()
);

-- 2. Tạo chỉ mục để truy vấn theo ngày nhanh hơn
create index if not exists site_visits_created_at_idx on site_visits (created_at);

-- 3. Cấu hình quyền truy cập (RLS) để cho phép lưu lượt truy cập
alter table site_visits enable row level security;

-- Cho phép mọi người thêm lượt truy cập mới
create policy "Allow anonymous inserts" on site_visits 
for insert with check (true);

-- Cho phép mọi người xem thống kê
create policy "Allow anonymous selects" on site_visits 
for select using (true);
