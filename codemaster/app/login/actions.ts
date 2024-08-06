"use server";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Provider } from "@supabase/supabase-js";

const origin = headers().get("origin");
const supabase = createClient();

export async function emailSignIn(formData: FormData) {
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error(error);
    return "Could not authenticate user";
  }
  
  redirect("/problemset");
};

export async function oAuthSignIn(provider: Provider) {

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    return "Something went wrong. Please try again.";
  }

  redirect(data.url);
}


