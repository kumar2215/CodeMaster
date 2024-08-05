import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/buttons/SubmitButton";

export default function SignUp({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();
    
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
      return redirect("/signup?message=Username already exists. Please use a different username.");
    }

    if (error) {
      console.error(error);
      return redirect("/signup?message=Someting went wrong. Please try again.");
    } else {
      if (data.user?.identities && data.user?.identities.length > 0) {
        return redirect("/signup?message=Check email to continue sign in process");
      } else {
        return redirect("/signup?message=Email already exists. Please use a different email.");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 w-full gap-2 px-8 sm:max-w-md">
      <Link
        href="/"
        className="absolute flex items-center px-4 py-2 text-sm no-underline rounded-md left-8 top-8 text-foreground bg-btn-background hover:bg-btn-background-hover group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <form className="flex flex-col justify-center flex-1 w-full gap-2 animate-in text-foreground">
        <label className="text-md" htmlFor="username">
          Username
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="username"
          placeholder=""
          required
        />
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signUp}
          className="px-4 py-2 mb-2 bg-green-700 border rounded-md border-foreground/20 text-foreground"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton>
        {searchParams?.message && (
          <p className="p-4 mt-4 text-center bg-foreground/10 text-foreground">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
