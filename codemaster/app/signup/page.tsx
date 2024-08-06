"use client";
import Link from "next/link";
import { emailSignUp, oAuthSignUp } from "./actions";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import SubmitButton from "@/components/buttons/SubmitButton";
import OAuthButton from "@/components/buttons/OAuthButton";
import { toast } from "react-toastify";
import GitHubIcon from "@/assets/github-icon.jpg";
import GoogleIcon from "@/assets/google-icon.jpg";

export default function SignUpPage() {

  const { register, watch } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    }
  });

  const username = watch("username");
  const password = watch("password");

  const [hasAtLeastOneLowercase, setHasAtLeastOneLowercase] = useState(false);
  const [hasAtLeastOneUppercase, setHasAtLeastOneUppercase] = useState(false);
  const [hasAtLeastOneNumber, setHasAtLeastOneNumber] = useState(false);
  const [hasAtLeastOneSpecialCharacter, setHasAtLeastOneSpecialCharacter] = useState(false);

  useEffect(() => {
    setHasAtLeastOneLowercase(/[a-z]/.test(password));
    setHasAtLeastOneUppercase(/[A-Z]/.test(password));
    setHasAtLeastOneNumber(/[0-9]/.test(password));
    setHasAtLeastOneSpecialCharacter(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password));
  }, [password]);

  const performSignUp = async (formData: FormData) => {
    if (username.length < 3) {
      toast.error("Username must be at least 3 characters long.", { autoClose: 3000 });
      return;
    } 
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.", { autoClose: 3000 });
      return;
    }
    const passwordStrength = {
      hasAtLeastOneLowercase,
      hasAtLeastOneUppercase,
      hasAtLeastOneNumber,
      hasAtLeastOneSpecialCharacter
    };
    const message = await emailSignUp(formData, passwordStrength);
    if (message === "Check email to continue sign in process") {
      toast.success(message, { autoClose: 3000 });
    }
    toast.error(message, { autoClose: 3000 });
  }
  //   "use server";

  //   const origin = headers().get("origin");
  //   const username = formData.get("username") as string;
  //   const email = formData.get("email") as string;
  //   const password = formData.get("password") as string;
  //   const supabase = createClient();
    
  //   const { data, error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //     options: {
  //       data: {
  //         username: username
  //       },
  //       emailRedirectTo: `${origin}/auth/callback`,
  //     },
  //   });

  //   const res = await supabase.from("Users").select("*").eq("username", username);

  //   if (res.data && res.data.length > 0) { 
  //     return redirect("/signup?message=Username already exists. Please use a different username.");
  //   }

  //   if (error) {
  //     console.error(error);
  //     return redirect("/signup?message=Someting went wrong. Please try again.");
  //   } else {
  //     if (data.user?.identities && data.user?.identities.length > 0) {
  //       return redirect("/signup?message=Check email to continue sign in process");
  //     } else {
  //       return redirect("/signup?message=Email already exists. Please use a different email.");
  //     }
  //   }
  // };

  const signUpWithGithub = async () => {
    const message = await oAuthSignUp("github");
    if (typeof message === "string") {
      toast.error(message, { autoClose: 3000 });
    }
  }

  const signUpWithGoogle = async () => {
    const message = await oAuthSignUp("google");
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

      <form className="flex flex-col lg:my-0 mt-20 mb-4 justify-center p-4 rounded-lg border-[1px] w-fit gap-2 animate-in text-foreground">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-2xl font-bold">Create a new account</h1>
        </div>
        <label className="text-md" htmlFor="username">
          Username
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          {...register("username")}
          name="username"
          placeholder=""
          required
        />
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          {...register("email")}
          type="email"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          {...register("password")}
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-black/60 mt-[-0.5rem] mb-6">
          <div className="flex items-center">
            <div className={`circle mr-2 w-2.5 h-2.5 rounded-full ${hasAtLeastOneLowercase ? "bg-green-400" : "bg-gray-300"}`} ></div>
            <span>One lowercase character</span>
          </div>
          <div className="flex items-center">
            <div className={`circle mr-2 w-2.5 h-2.5 rounded-full ${hasAtLeastOneUppercase ? "bg-green-400" : "bg-gray-300"}`} ></div>
            <span>One uppercase character</span>
          </div>
          <div className="flex items-center">
            <div className={`circle mr-2 w-2.5 h-2.5 rounded-full ${hasAtLeastOneNumber ? "bg-green-400" : "bg-gray-300"}`} ></div>
            <span>One number</span>
          </div>
          <div className="flex items-center">
            <div className={`circle mr-2 w-2.5 h-2.5 rounded-full ${hasAtLeastOneSpecialCharacter ? "bg-green-400" : "bg-gray-300"}`} ></div>
            <span>One special character</span>
          </div>
        </div>
        <SubmitButton
          formAction={performSignUp}
          className="px-4 py-2 mb-2 bg-green-700 border rounded-md border-foreground/20 text-foreground"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton>
        <div className="my-2 py-2 relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center leading-6">
            <span className="bg-slate-50 px-4 text-black text-opacity-75">or sign up with</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <OAuthButton provider="Github" icon={GitHubIcon} action={signUpWithGithub} />
          <OAuthButton provider="Google" icon={GoogleIcon} action={signUpWithGoogle} />
        </div>
      </form>
    </div>
  );
}
