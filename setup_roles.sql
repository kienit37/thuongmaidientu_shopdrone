
-- Update profiles table to include role
alter table profiles add column if not exists role text default 'user';

-- Create a policy to allow users to read their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- Create a policy to allow admins to read all profiles
create policy "Admins can view all profiles" on profiles
  for select using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Function to check if a user is an admin
create or replace function is_admin(user_id uuid)
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = user_id and role = 'admin'
  );
$$ language plpgsql security definer;

-- Set a specific user as admin (replace with the user's ID or email later)
-- update profiles set role = 'admin' where id = 'YOUR_USER_ID';
