-- ============================================
-- Migration: Add User Roles System
-- ============================================
-- Adds role-based access control to users table
-- Roles: user (default), admin, publisher
-- ============================================

-- Create user_role enum type
CREATE TYPE user_role AS ENUM ('user', 'admin', 'publisher');

-- Add role column to users table
ALTER TABLE users
ADD COLUMN role user_role DEFAULT 'user' NOT NULL;

-- Create index for role queries (helps with filtering by role)
CREATE INDEX idx_users_role ON users(role);

-- Add comment
COMMENT ON COLUMN users.role IS 'User role: user (default), admin (full access), publisher (content provider)';

-- Update existing users to have 'user' role (already default, but explicit)
-- This is a safety measure if there are any NULL values
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Verify the changes
DO $$
DECLARE
  role_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO role_count FROM users WHERE role = 'user';
  RAISE NOTICE '✅ Migration: Added user_role system';
  RAISE NOTICE '   Total users with "user" role: %', role_count;
END $$;
