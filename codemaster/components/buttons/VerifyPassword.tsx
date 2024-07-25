"use client";
import { createClient } from "@/utils/supabase/client";
import bcrypt from 'bcryptjs';
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function VerifyPassword(
  { table, id, link, btnText, promptText, className, style }: 
  { table: string, id: string, link: string, btnText: string, promptText: string, className: string, style: React.CSSProperties }) 
{
   
  const [passwordHash, setPasswordHash] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from(table)
        .select(`password_hash`)
        .eq("id", id)
        .single();
      if (error) { console.error(error); }

      setPasswordHash(data && data.password_hash);
    }
    getData();
  }, []);

  const askForPassword = async () => {
    let password: string | null = prompt(promptText);
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
      className={className} 
      style={style} 
      onClick={askForPassword}
      >
        {btnText}
    </button>
  );
}