"use server";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Provider } from "@supabase/supabase-js";

const origin = headers().get("origin");
const supabase = createClient();

export async function emailSignUp(formData: FormData, passwordStrength: any) {

  if (!passwordStrength.hasAtLeastOneLowercase) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!passwordStrength.hasAtLeastOneUppercase) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!passwordStrength.hasAtLeastOneNumber) {
    return "Password must contain at least one number.";
  }
  if (!passwordStrength.hasAtLeastOneSpecialCharacter) {
    return "Password must contain at least one special character.";
  }

  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  const res = await supabase.from("Users").select("*").eq("username", username);

  if (res.data && res.data.length > 0) { 
    return "Username already exists. Please use a different username.";
  }

  if (error) {
    console.error(error);
    return "Someting went wrong. Please try again.";
  } else {
    if (data.user?.identities && data.user?.identities.length > 0) {
      return "Check email to continue sign in process";
    } else {
      return "Email already exists. Please use a different email.";
    }
  }
}

export async function oAuthSignUp(provider: Provider) {

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
