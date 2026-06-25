import { supabase } from "./supabaseClient";

const TABLE_NAME = "smartcart_states";

export async function fetchSmartCartState(userId) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("app_state")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data?.app_state || null;
}

export async function saveSmartCartState(userId, appState) {
  if (!supabase) return;

  const { error } = await supabase
    .from(TABLE_NAME)
    .upsert(
      {
        user_id: userId,
        app_state: appState,
      },
      { onConflict: "user_id" },
    );

  if (error) throw error;
}
