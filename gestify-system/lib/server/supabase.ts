import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Cliente Supabase apenas para API routes (servidor).
 * Usa service_role / secret — nunca expose essa chave no browser.
 * A chave publishable/anon não é usada aqui (evita bloqueio de RLS em INSERT/UPDATE).
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    const hasPublishable =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    throw new Error(
      hasPublishable
        ? "Defina SUPABASE_SERVICE_ROLE_KEY no .env (Settings → API → service_role / secret). A chave publishable não é usada nas API routes do Gestify."
        : "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env",
    );
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return client;
}
