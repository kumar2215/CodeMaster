"use client";
import Link from "next/link";
import { emailSignIn, oAuthSignIn } from "./actions";
import SubmitButton from "@/components/buttons/SubmitButton";
import OAuthButton from "@/components/buttons/OAuthButton";
import { toast } from "react-toastify";
import GitHubIcon from "@/assets/github-icon.jpg";
import GoogleIcon from "@/assets/google-icon.jpg";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {

  if (searchParams.message) {
    toast.error(searchParams.message, { autoClose: 3000 });
  }

  const performSignIn = async (formData: FormData) => {
    const message = await emailSignIn(formData);
    if (typeof message === "string") {
      toast.error(message, { autoClose: 3000 });
    }
  }

  const signInWithGithub = async () => {
    const message = await oAuthSignIn("github");
    if (typeof message === "string") {
      toast.error(message, { autoClose: 3000 });
    }
  }

  const signInWithGoogle = async () => {
    const message = await oAuthSignIn("google");
    if (typeof message === "string") {
      toast.error(message, { autoClose: 3000 });
    }
  }    

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

      <form className="flex flex-col lg:my-0 mt-20 mb-4 justify-center w-full p-4 rounded-lg border-[1px] gap-2 animate-in text-foreground">
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-2xl font-bold">Sign into CodeMaster</h1>
          <div className="flex flex-row justify-start gap-2 text-sm">
            <p>Don't have an account?</p>
            <Link href="/signup" className="font-medium underline">Sign up</Link>
          </div>
        </div>
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="px-4 py-2 mb-4 border rounded-md bg-inherit"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="px-4 py-2 border rounded-md bg-inherit"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <Link href="/reset-password" className="mb-6 text-sm text-end hover:text-blue-600 hover:underline">Forgot password?</Link>
        <SubmitButton
          formAction={performSignIn}
          className="px-4 py-2 mb-2 bg-blue-400 border rounded-md border-foreground/20 text-foreground"
          pendingText="Signing In..."
        >
          Login
        </SubmitButton>
        <div className="relative py-2 my-2">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center leading-6">
            <span className="px-4 text-black text-opacity-75 bg-slate-50">or login with</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <OAuthButton provider="Github" icon={GitHubIcon} action={signInWithGithub} />
          <OAuthButton provider="Google" icon={GoogleIcon} action={signInWithGoogle} />
        </div>
      </form>
    </div>
  );
}
