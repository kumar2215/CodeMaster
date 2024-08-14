import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import getUsername from "@/app/utils/Misc/getUsername";

export default async function checkInUser() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const username = getUsername(user);

  const { data: userData, error } = await supabase
    .from('Users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) { 
    return [null, error];
  }

  return [supabase, userData];
}