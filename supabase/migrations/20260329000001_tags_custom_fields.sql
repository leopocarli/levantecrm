-- Migration: Tags & Custom Fields → organization_settings (JSON columns)
-- Moves tags and custom field definitions from client localStorage to the database,
-- ensuring they are shared across devices and team members.

ALTER TABLE public.organization_settings
ADD COLUMN IF NOT EXISTS tags jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.organization_settings
ADD COLUMN IF NOT EXISTS custom_field_definitions jsonb NOT NULL DEFAULT '[]'::jsonb;
