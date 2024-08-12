import getUsername from "@/app/utils/Misc/getUsername";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const reset = requestUrl.searchParams.get("reset");
  const email = requestUrl.searchParams.get("email");
  const origin = requestUrl.origin;
  const supabase = createClient();

  if (code && !reset) {
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      NextResponse.redirect(`${origin}/login?message=Could not authenticate user`);
      return;
    }

    const username = getUsername(user);

    const { data, error } = await supabase.from("Users").select("*").eq("username", username);
    if (error) { 
      console.error(error); 
      NextResponse.redirect(`${origin}/login?message=Someting went wrong. Please try again.`);
      return;
    }

    if (data.length === 0) {
      const avatar = {
        url: `https://api.dicebear.com/8.x/personas/svg?seed=${username}`,
        location: null
      }
      const res = await supabase.from("Users").insert({username: username, email: user?.email, avatar});
      if (res.error) { console.error(res.error); }
    }
  } else if (code && reset) {
    NextResponse.redirect(`${origin}/reset-password?reset=true&code=${code}`);
    return;
  }

  // URL to redirect to after sign up process completes
  NextResponse.redirect(`${origin}/problemset`);
}
