import { supabase } from "./supabaseClient";

const PROFILES_TABLE = "smartcart_profiles";
const STATES_TABLE = "smartcart_states";

export async function fetchSmartCartState(userId) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(STATES_TABLE)
    .select("app_state")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data?.app_state || null;
}

export async function saveSmartCartState(userId, appState) {
  if (!supabase) return;

  const { error } = await supabase
    .from(STATES_TABLE)
    .upsert(
      {
        user_id: userId,
        app_state: appState,
      },
      { onConflict: "user_id" },
    );

  if (error) throw error;
}

export async function fetchSmartCartProfile(userId) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export async function saveSmartCartProfile(profile) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .upsert(profile, { onConflict: "user_id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}
