import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { isAllowedOrigin } from '@/lib/security/sameOrigin';

function json<T>(body: T, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

const CustomFieldSchema = z.object({
  id: z.string(),
  key: z.string(),
  label: z.string(),
  type: z.enum(['text', 'number', 'date', 'select']),
  options: z.array(z.string()).optional(),
});

const UpdateSchema = z.object({
  tags: z.array(z.string().max(100)).max(200).optional(),
  custom_field_definitions: z.array(CustomFieldSchema).max(100).optional(),
}).strict();

async function getOrgId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', userId)
    .single();
  return profile?.organization_id as string | undefined;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const orgId = await getOrgId(supabase, user.id);
  if (!orgId) return json({ error: 'No organization' }, 404);

  const { data, error } = await supabase
    .from('organization_settings')
    .select('tags, custom_field_definitions')
    .eq('organization_id', orgId)
    .single();

  if (error) return json({ error: error.message }, 500);

  return json({
    tags: data?.tags ?? [],
    customFieldDefinitions: data?.custom_field_definitions ?? [],
  });
}

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) return json({ error: 'Forbidden' }, 403);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const orgId = await getOrgId(supabase, user.id);
  if (!orgId) return json({ error: 'No organization' }, 404);

  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.message }, 400);

  const updates: Record<string, unknown> = {};
  if (parsed.data.tags !== undefined) updates.tags = parsed.data.tags;
  if (parsed.data.custom_field_definitions !== undefined) updates.custom_field_definitions = parsed.data.custom_field_definitions;

  if (Object.keys(updates).length === 0) return json({ error: 'No fields to update' }, 400);

  const { error } = await supabase
    .from('organization_settings')
    .update(updates)
    .eq('organization_id', orgId);

  if (error) return json({ error: error.message }, 500);

  return json({ ok: true });
}
