"use client";
import ProfilePic from "@/components/images/profilepic";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function SetProfilePic({username}: {username: string}) {

  const { register, watch } = useForm({
    defaultValues: {
      avatar: null
    }
  });

  const [image, setImage]: any = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedBefore, setUploadedBefore] = useState(false);
  const defaultImageUrl = `https://api.dicebear.com/8.x/personas/svg?seed=${username}`;

  const savedImage = watch('avatar');
  const supabase = createClient();

  useEffect(() => {
    async function updateImage() {
      const { data, error } = await supabase.from("Users").select("avatar").eq("username", username).single();
      if (error) { console.error(error); }
      if (data) {
        setImageUrl(data.avatar.url);
      }

      if (savedImage) {
        const imageFile: any = savedImage[0];

        if (imageFile && imageFile.size > 2_097_152) {
          toast.error("File cannot be larger than 2 MB.", {autoClose: 3000});
          return;
        }
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(`${username}/avatar-${imageFile.name}`, imageFile);
        if (error) { 
          console.error(error); 
          toast.error("Error uploading file. Please try again.", {autoClose: 3000});
          return;
        }

        const publicURL = supabase.storage
          .from('avatars')
          .getPublicUrl(`${username}/avatar-${imageFile.name}`).data.publicUrl;
        if (!publicURL) {
          toast.error("Error uploading file. Please try again.", {autoClose: 3000});
          return;
        }

        const newAvatar = {
          url: publicURL,
          location: `${username}/avatar-${imageFile.name}`
        }

        const { data: imageUpdate, error: imageUpdateError } = await supabase
          .from('Users')
          .update({ avatar: newAvatar })
          .eq('username', username);
        if (imageUpdateError) { 
          console.error(imageUpdateError); 
          toast.error("Error updating image. Please try again.", {autoClose: 3000});
          return;
        }

        if (uploadedBefore) {
          const { data, error } = await supabase.storage
            .from('avatars')
            .remove([`${username}/avatar-${image.name}`]);
        } if (!error) {
          toast.success("Image updated successfully.", {autoClose: 3000});
        }

        setImage(imageFile);
        setImageUrl(publicURL);
        setUploadedBefore(true);
      }
    }
    updateImage();
  }, [savedImage]);

  const setDefaultImage = async () => {
    
    const { data, error } = await supabase
      .from('Users')
      .select('avatar')
      .eq('username', username)
      .single();
    if (error) { 
      console.error(error); 
      toast.error("Error updating image. Please try again.", {autoClose: 3000});
      return;
    }

    const location = data.avatar.location;

    const { error: error2 } = await supabase.storage
      .from('avatars')
      .remove([location]);
    if (error2) { 
      console.error(error2); 
      toast.error("Error updating image. Please try again.", {autoClose: 3000});
      return;
    }

    const avatar = {
      url: defaultImageUrl,
      location: null
    }

    const { data: imageUpdate, error: imageUpdateError } = await supabase
      .from('Users')
      .update({ avatar })
      .eq('username', username);
    if (imageUpdateError) { 
      console.error(imageUpdateError); 
      toast.error("Error updating image. Please try again.", {autoClose: 3000});
      return;
    }

    setImageUrl(defaultImageUrl);
  }
  
  return (
    <div className="flex flex-col w-full gap-6">
      <span className="overflow-hidden border-2 rounded-full w-60 h-60">
        <ProfilePic username={username} refresh={imageUrl} />
      </span>

      <div className="flex flex-col gap-4">
        <label
        className="flex items-center justify-center h-10 p-2 font-medium text-white bg-green-500 rounded-md w-60 hover:bg-green-700"
        onClick={() => document.getElementById("getAvatar")?.click()}
        >
          Set profile picture
        </label>
        <input id="getAvatar" type="file" accept="image/*" {...register("avatar")} style={{display: "none"}} />

        {imageUrl !== defaultImageUrl &&
        <button
        className="flex items-center justify-center h-10 p-2 font-medium text-white bg-green-500 rounded-md w-60 hover:bg-green-700"
        onClick={setDefaultImage}
        >
          Use default profile picture
        </button>}
      </div>
    </div>
  );
}