import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'] as string;
const supabaseKey = import.meta.env['VITE_SUPABASE_ANON_KEY'] as string;

// No Supabase Auth is used in this app (admin login is a simple local credential),
// so sessions are never persisted to browser storage.
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    storage: undefined,
  },
});
