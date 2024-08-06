"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { sendEmail, updatePassword } from "./actions";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/buttons/SubmitButton";
import { toast } from "react-toastify";

export default function ResetPassword({
  searchParams
} : {
  searchParams: { reset: string, code: string, email: string }
}) {

  const sendLink = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const message = await sendEmail(email);
    if (message === "Check your email for a password reset link.") {
      toast.success(message, { autoClose: 3000 });
    } else {
      toast.error(message, { autoClose: 3000 });
    }
  }

  const { register, watch } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });
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

  const resetPassword = async (formData: FormData) => {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", { autoClose: 3000 });
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
    const message = await updatePassword(password, passwordStrength, searchParams.code, searchParams.email);
    if (message === "Password updated successfully.") {
      toast.success(message, { autoClose: 3000 });
      redirect("/login");
    } else {
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
        {searchParams.reset === "true"
        ? <>
          <div className="flex flex-col gap-2 mb-4">
            <h1 className="text-2xl font-bold">Reset password</h1>
          </div>
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="px-4 py-2 border rounded-md bg-inherit"
            {...register("password")}
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <label className="text-md" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="px-4 py-2 border rounded-md bg-inherit"
            {...register("confirmPassword")}
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            required
          />
          <div className="grid grid-cols-1 gap-1 mt-2 mb-6 text-sm sm:grid-cols-2 text-black/60">
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
            formAction={resetPassword}
            className="px-4 py-2 mb-2 bg-blue-400 border rounded-md border-foreground/20 text-foreground"
            pendingText="Resetting password..."
          >
            Reset
          </SubmitButton>
          </>
        : <>
          <div className="flex flex-col gap-2 mb-4">
            <h1 className="text-2xl font-bold">Get reset link</h1>
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
          <SubmitButton
            formAction={sendLink}
            className="px-4 py-2 mb-2 bg-blue-400 border rounded-md border-foreground/20 text-foreground"
            pendingText="Sending link to email..."
          >
            Send Link
          </SubmitButton>
          </>}
      </form>
    </div>
  );
}
