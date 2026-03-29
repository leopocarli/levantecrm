-- Wrapper imutável para unaccent (necessário para índices e busca accent-insensitive)
CREATE OR REPLACE FUNCTION public.immutable_unaccent(text) RETURNS text AS $$
  SELECT public.unaccent('public.unaccent', $1)
$$ LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;

-- Índices para busca accent-insensitive nas colunas mais usadas
CREATE INDEX IF NOT EXISTS idx_contacts_name_unaccent
  ON contacts (immutable_unaccent(name) text_pattern_ops);

CREATE INDEX IF NOT EXISTS idx_deals_title_unaccent
  ON deals (immutable_unaccent(title) text_pattern_ops);

CREATE INDEX IF NOT EXISTS idx_companies_name_unaccent
  ON crm_companies (immutable_unaccent(name) text_pattern_ops);
