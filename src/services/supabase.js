import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://gnqdsiaysazlwclxriab.supabase.co';
const defaultKey = 'sb_publishable_XB4eVHiRgflPajiM-4lSJA_Z6WNaWiH';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'SEU_SUPABASE_ANON_KEY_AQUI' &&
  supabaseAnonKey.trim().length > 0
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    '[Rota Nova] Supabase: URL configurada (' + supabaseUrl + '), aguardando preenchimento da chave anon em VITE_SUPABASE_ANON_KEY no arquivo .env.'
  );
} else {
  console.log('[Rota Nova] Supabase conectado com sucesso em:', supabaseUrl);
}
