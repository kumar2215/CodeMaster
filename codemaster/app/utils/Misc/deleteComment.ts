"use client";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export default async function deleteComment(commentId: string) {

  const supabase = createClient();

  const res = await supabase
    .from("Comments")
    .select("images")
    .eq("id", commentId)
    .single();
    
  if (res.error) { 
    console.error(res.error); 
    toast.error("Something went wrong. Please try again.", {autoClose: 3000});
    return;
  }

  if (res.data && res.data.images.length > 0) {
    const { data, error } = await supabase.storage
      .from("media")
      .remove(res.data.images.map((image: any) => image.location));
    if (error) { 
      console.error(error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }
  }
  
  const res2 = await supabase
    .from("Comments")
    .update({deleted: true})
    .eq("id", commentId);

  if (res2.error) { 
    console.error(res2.error); 
    toast.error("Something went wrong. Please try again.", {autoClose: 3000});
    return;
  }

  toast.success("Comment deleted successfully!", {autoClose: 3000});
}
