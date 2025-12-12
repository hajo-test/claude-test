-- Migration: Add description column to todos table
-- Date: 2025-12-12

-- Add description column if it doesn't exist
ALTER TABLE todos ADD COLUMN description TEXT;
