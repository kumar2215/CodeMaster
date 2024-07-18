"use client";
import { createClient } from "@/utils/supabase/client";
import processContent from "@/app/utils/Processing/processContent";
import { toast } from "react-toastify";

export default async function submitReply(content: string, data: any) {

  const username = data.username;
  const discussionId = data.discussionId;
  const commentId = data.commentId;
  const replies = data.replies;
  const posts = data.posts;
  const written_by = data.written_by;
  const setCreateReply = data.setCreateReply;
  const router = data.router;

  if (content === "" || content === "<p><br></p>") { 
    toast.error("Content cannot be empty.", {autoClose: 3000});
    return;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const rawImages = doc.getElementsByTagName("img");
  let newCommentId = null;

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

    newCommentId = res.data[0].id;
    const media = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (!image) continue;
      
      const location = `${username}/${newCommentId}/${image.name}`;
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
      });
    }

    const res2 = await supabase.from("Comments").update({
      content: doc.body.innerHTML,
      images: media
    }).eq("id", newCommentId);
    if (res2.error) { 
      console.error(res2.error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000}); 
      return;
    }
  }

  if (!newCommentId) {
    const res = await supabase.from("Comments").insert({
      written_by: username,
      content: content
    }).select();
    if (res.error) { 
      console.error(res.error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000}); 
      return;
    }
    newCommentId = res.data[0].id;
  }

  replies.push(newCommentId);
  const res2 = await supabase.from("Comments").update({replies: replies}).eq("id", commentId);
  if (res2.error) { 
    console.error(res2.error); 
    toast.error("Something went wrong. Please try again.", {autoClose: 3000});
    return;
  }

  const res3 = await supabase.from("Discussions").update({posts: posts + 1}).eq("id", discussionId);
  if (res3.error) { 
    console.error(res3.error); 
    toast.error("Something went wrong. Please try again.", {autoClose: 3000});
    return;
  }

  const res4 = await supabase.from("Users").select("*").eq("username", username).single();
  if (res4.error) { 
    console.error(res4.error);
    toast.error("Something went wrong. Please try again.", {autoClose: 3000});
    return;
  }

  let comments_written = res4.data.comments_written;
  comments_written = comments_written !== null ? comments_written : [];
  comments_written.push(newCommentId);

  const res5 = await supabase.from("Users").update({comments_written: comments_written}).eq("username", username);
  if (res5.error) { 
    console.error(res5.error);
    toast.error("Something went wrong. Please try again.", {autoClose: 3000});
    return;
  }

  if (written_by !== username) {
    const notification = {
      from: username,
      message: `${username} replied to your comment.`,
      type: "View",
      link: `forum/discussion/${discussionId}`
    }

    const { data, error } = await supabase.from("Users").select("notifications").eq("username", written_by).single();
    if (error) { 
      console.error(error);
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }

    const notifications = data.notifications || [];
    notifications.push(notification);
    const res6 = await supabase.from("Users").update({notifications: notifications}).eq("username", written_by);
    if (res6.error) { 
      console.error(res6.error);
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }
  }

  toast.success("Reply created successfully!", {autoClose: 3000});
  setCreateReply(false);
  router.refresh();
}
