
-- Add user_id to orders to link to auth.users
alter table orders add column if not exists user_id uuid references auth.users(id);

-- Create a profiles table for extra user info (optional but good for future)
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  phone text,
  address text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
