import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.user_metadata.username) {
      const username = user.user_metadata.username;
      const avatar = {
        url: `https://api.dicebear.com/8.x/personas/svg?seed=${username}`,
        location: null
      }
      const res = await supabase.from("Users").insert({username: username, email: user?.email, avatar});
      if (res.error) { console.error(res.error); }
    }
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/problemset`);
}
