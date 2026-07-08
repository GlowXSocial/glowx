import { createClient } from '@supabase/supabase-js';

/** True quando URL + service_role key estão definidos (sem lançar). */
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Cliente usado no SERVIDOR com a service_role key.
 * Tem acesso total ao banco (ignora RLS) — usar apenas em server components
 * e server actions (nunca expor a chave no browser).
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local'
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Cliente público (anon). Usado no browser se necessário.
 * Respeita as RLS — pode ler content e inserir leads.
 */
export function supabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL/ANON_KEY não configurados.');
  }
  return createClient(url, key);
}