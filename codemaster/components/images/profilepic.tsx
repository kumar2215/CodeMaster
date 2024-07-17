"use client";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

export default function ProfilePic({ username, refresh, style }: { username: string, refresh?: any, style?: React.CSSProperties }) {

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function fetchAvatar() {
      const supabase = createClient();
      const { data, error } = await supabase.from("Users").select("*").eq("username", username).single();
      if (error) {console.log(error); }

      setImageUrl(data && data.avatar.url);
    }
    fetchAvatar();
  }, [refresh]);

  return (
    <img 
      src={imageUrl} 
      alt="avatar"
      className="h-full w-full rounded-full object-cover"
      style={style}
    />
  );
}