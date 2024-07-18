"use client";
import processContent from "@/app/utils/Processing/processContent";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export default async function editComment(formData: FormData, editData: any) {

  const { commentId, editingContent, editingMode, setEditingMode, username, router } = editData;

  const supabase = createClient();

  if (editingContent === "" || editingContent === "<p><br></p>") { 
    toast.error("Content cannot be empty.", {autoClose: 3000});
    return;
  }

  // retrieve existing images
  const res = await supabase.from("Comments").select("images").eq("id", commentId).single();
  if (res.error) { 
    console.error(res.error);
    toast.error("Something went wrong. Please try again.", {autoClose: 3000});
    return;
  }

  // delete existing images
  if (res.data.images && res.data.images.length > 0) {
    const { data, error } = await supabase.storage
      .from("media")
      .remove(res.data.images.map((image: any) => image.location));
    if (error) { 
      console.error(error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }
  }
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(editingContent, "text/html");
  const rawImages = doc.getElementsByTagName("img");

  if (rawImages.length > 0) {
    const [successful, images]: any = await processContent(rawImages);
    if (!successful) return;

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

      const newImageEle = doc.createElement("img");
      newImageEle.src = publicURL;
      rawImages[i].replaceWith(newImageEle);

      media.push({
        url: publicURL,
        location
      })
    }

    media.forEach((image: any) => console.log(image.url));

    const res = await supabase.from("Comments").update({
      content: doc.body.innerHTML,
      images: media,
      editted: true
    }).eq("id", commentId);
    if (res.error) { 
      console.error(res.error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000}); 
      return;
    }
  } else {
    const res = await supabase.from("Comments").update({
      content: doc.body.innerHTML,
      images: null,
      editted: true
    }).eq("id", commentId);
    if (res.error) { 
      console.error(res.error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000}); 
      return;
    }
  }
  toast.success("Comment edited successfully!", {autoClose: 3000});
  setEditingMode(!editingMode);
  router.refresh();
}