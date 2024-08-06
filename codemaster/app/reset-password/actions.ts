"use server";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const origin = headers().get("origin");
const supabase = createClient();

export async function sendEmail(email: string) {

  // Check if email exists in database
  const { data, error } = await supabase.from("Users").select("email").eq("email", email);
  if (error) {
    console.error(error);
    return "Something went wrong. Please try again.";
  }
  if (data.length === 0) {
    return "Email not found.";
  }

  const res = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?reset=true&email=${email}`,
  });
  if (res.error) {
    console.error(res.error);
    return "Something went wrong. Please try again.";
  }

  return "Check your email for a password reset link.";
}

export async function updatePassword(newPassword: string, passwordStrength: any, code: string, email: string) {

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

  await supabase.auth.exchangeCodeForSession(code);

  const res = await supabase.auth.updateUser({ 
    password: newPassword
  });
  if (res.error) {
    console.error(res.error);
    return "Something went wrong. Please try again.";
  }

  return "Password updated successfully.";
}
