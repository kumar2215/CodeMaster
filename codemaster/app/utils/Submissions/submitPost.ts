"use client";
import processContent from "@/app/utils/Processing/processContent";
import { createClient } from "@/utils/supabase/client";
import bcrypt from 'bcryptjs';
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export default async function submitPost(formData: FormData, content: string, topic: string, username: string) {
  let title = formData.get("title") as string;
  const competition_name = formData.get("name") as string;
  const password = formData.get("password") as string;
  let hashedPassword: string | null = null;

  if (content === "" || content === "<p><br></p>") { 
    toast.error("Content cannot be empty.", {autoClose: 3000});
    return;
  }

  if (competition_name) title = `${competition_name}: ${title}`;
  if (password) {
    const saltRounds = 10;
    hashedPassword = await bcrypt.hash(password, saltRounds);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const rawImages = doc.getElementsByTagName("img");
  let commentData = null;

  const supabase = createClient();

  if (rawImages.length > 0) {
    const [successful, images]: any = await processContent(rawImages);
    if (!successful) return;

    const res = await supabase.from("Comments").insert({
      written_by: username,
      content: ""
    }).select();
    if (res.error) { 
      console.error(res.error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000}); 
      return;
    }

    commentData = res.data[0];
    const commentId = commentData.id;
    const media = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (!image) continue;
      
      const location = `${username}/${commentId}/${image.name}`;
      const res = await supabase.storage
        .from("media")
        .upload(location, image);
      if (res.error) { 
        console.error(res.error); 
        toast.error("Something went wrong. Please try again.", {autoClose: 3000}); 
        return;
      }

      const publicURL = supabase.storage
        .from("media")
        .getPublicUrl(location).data.publicUrl;

      if (!publicURL) {
        toast.error("Something went wrong. Please try again.", {autoClose: 3000});
        return;
      }

      const newImageEle = document.createElement("img");
      newImageEle.src = publicURL;
      rawImages[i].replaceWith(newImageEle);

      media.push({
        url: publicURL,
        location
      })
    }

    const res2 = await supabase.from("Comments").update({
      content: doc.body.innerHTML,
      images: media
    }).eq("id", commentId);
    if (res2.error) { 
      console.error(res2.error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000}); 
      return;
    }
  }

  if (!commentData) {
    const res = await supabase.from("Comments").insert({
      written_by: username,
      content: content
    }).select();
    if (res.error) { 
      console.error(res.error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000}); 
      return;
    }
    commentData = res.data[0];
  }

  const res = await supabase.from("Discussions").insert({
    created_at: commentData.created_at,
    created_by: username,
    head_comment: commentData.id,
    title: title,
    type: topic,
    password_hash: hashedPassword
  }).select();
  if (res.error) { 
    console.error(res.error);
    toast.error("Something went wrong. Please try again.", {autoClose: 3000});
    return;
  }

  const res2 = await supabase.from("Users").select("*").eq("username", username).single();
  if (res2.error) { 
    console.error(res2.error);
    toast.error("Something went wrong. Please try again.", {autoClose: 3000});
    return;
  }

  let comments_written = res2.data.comments_written;
  comments_written = comments_written !== null ? comments_written : [];
  comments_written.push(commentData.id);

  const res3 = await supabase.from("Users").update({comments_written: comments_written}).eq("username", username);
  if (res3.error) { 
    console.error(res3.error);
    toast.error("Something went wrong. Please try again.", {autoClose: 3000});
    return;
  }

  if (topic === "reports") {
    const admins = process.env.NEXT_PUBLIC_ADMINS?.split(",");

    const notification = {
      from: username,
      message: `Report: ${title}`,
      type: "View",
      link: `/forum/discussion/${res.data[0].id}`
    }

    if (!admins) { 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }
    
    for (let i = 0; i < admins.length; i++) {
      const res = await supabase.from("Users").select("notifications").eq("username", admins[i]).single();
      if (res.error) { 
        console.error(res.error);
        toast.error("Something went wrong. Please try again.", {autoClose: 3000});
        return;
      }

      const notifications = res.data.notifications;
      notifications.push(notification);

      const res2 = await supabase.from("Users").update({notifications}).eq("username", admins[i]);
      if (res2.error) { 
        console.error(res2.error);
        toast.error("Something went wrong. Please try again.", {autoClose: 3000});
        return;
      }
    }
  }

  toast.success("Post created successfully!", {autoClose: 3000});
  redirect(`/forum/discussion/${res.data[0].id}`);
}