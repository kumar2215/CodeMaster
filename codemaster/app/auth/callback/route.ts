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
  
  try {
    const supabase = createClient();

    if (code && !reset) {
      const { error: err } = await supabase.auth.exchangeCodeForSession(code);
      if (err) {
        console.error("Error exchanging code for session:", err);
        // console.error(err);
        return NextResponse.redirect(`${origin}/login?message=Someting went wrong. Please try again.`);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.redirect(`${origin}/login?message=Could not authenticate user`);
      }

      const username = getUsername(user);
      console.log(user, username);

      const { data, error } = await supabase.from("Users").select("*").eq("username", username);
      if (error) { 
        console.error(error); 
        return NextResponse.redirect(`${origin}/login?message=Someting went wrong. Please try again.`);
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
      return NextResponse.redirect(`${origin}/reset-password?reset=true&code=${code}`);
    }

    // URL to redirect to after sign up process completes
    return NextResponse.redirect(`${origin}/problemset`);
  } catch (error) {
    console.error("Overall error: ", error);
    // return NextResponse.redirect(`${origin}/login?message=Someting went wrong. Please try again.`);
  };
}
