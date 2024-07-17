"use client";
import { createClient } from "@/utils/supabase/client";
import bcrypt from 'bcryptjs';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function VerifyPassword({ id, link, btnText }: { id: string, link: string, btnText: string }) {

  const [passwordHash, setPasswordHash] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("Tournaments")
        .select(`password_hash`)
        .eq("id", id)
        .single();
      if (error) { console.error(error); }

      setPasswordHash(data && data.password_hash);
    }
    getData();
  }, []);

  const askForPassword = async () => {
    let password: string | null = prompt("Enter the password for this tournament: ");
    if (!password) { return; }
    const result = await bcrypt.compare(password, passwordHash);
    if (result) {
      router.push(link);
    } else {
      toast.error("Wrong password. Please try again.", { autoClose: 3000 });
    }
  }

  return (
    <button 
      className="p-2 text-base font-medium text-center bg-green-400 rounded-2xl" 
      style={{border: "1px solid black"}} 
      onClick={askForPassword}
      >
        {btnText}
    </button>
  );
}