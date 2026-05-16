import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

/** ดึง session ปัจจุบัน — ใช้แทน localStorage('current_user') */
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** ดึง username จาก profiles table โดยใช้ user id */
export async function getUserProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .single();
  return data;
}

/** ดึง username ของ user ที่ login อยู่ — ใช้แทน localStorage parse */
export async function getCurrentUsername(): Promise<string | null> {
  const session = await getSession();
  if (!session?.user?.id) return null;
  const profile = await getUserProfile(session.user.id);
  return profile?.username ?? session.user.email ?? null;
}
