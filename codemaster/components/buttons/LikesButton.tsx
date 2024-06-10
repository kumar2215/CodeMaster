"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import selectedLikesBtn from "@/assets/selected_likes_btn.jpg";
import unselectedLikesBtn from "@/assets/unselected_likes_btn.jpg";
import selectedDislikesBtn from "@/assets/selected_dislikes_btn.jpg";
import unselectedDislikesBtn from "@/assets/unselected_dislikes_btn.jpg";

export default function Likes(data: any) {

  const commentData = data.commentData;
  const username = data.username;

  const id = commentData.id;
  const initialLikes = commentData.likes;
  const initialDislikes = commentData.dislikes;
  let usersLiked = commentData.users_liked;
  usersLiked = !usersLiked ? [] : usersLiked;
  let usersDisliked = commentData.users_disliked;
  usersDisliked = !usersDisliked ? [] : usersDisliked;

  const [likes, setLikes] = useState(initialLikes);
  const alrLiked = usersLiked.includes(username);
  const [likesImage, setLikesImage] = useState(alrLiked ? selectedLikesBtn.src : unselectedLikesBtn.src);
  const [liked, setLiked] = useState(alrLiked);

  const [dislikes, setDislikes] = useState(initialDislikes);
  const alrDisliked = usersDisliked.includes(username);
  const [dislikesImage, setDislikesImage] = useState(alrDisliked ? selectedDislikesBtn.src : unselectedDislikesBtn.src);
  const [disliked, setDisliked] = useState(alrDisliked);

  const saveLike = async () => {
    if (!liked) {
      setLiked(true);
      setLikes(likes + 1);
      setLikesImage(selectedLikesBtn.src);
      usersLiked.push(username);
      if (disliked) await saveDislike();

      const supabase = createClient();
      const res = await supabase.from("Comments")
        .update({likes: likes + 1, users_liked: usersLiked})
        .eq("id", id);
      if (res.error) { console.error(res.error) }

    } else {
      setLiked(false);
      setLikes(likes - 1);
      setLikesImage(unselectedLikesBtn.src);
      usersLiked.splice(usersLiked.indexOf(username), 1);

      const supabase = createClient();
      const res = await supabase.from("Comments")
        .update({likes: likes - 1, users_liked: usersLiked})
        .eq("id", id);
      if (res.error) { console.error(res.error) }

    }
  }

  const saveDislike = async () => {
    if (!disliked) {
      setDisliked(true);
      setDislikes(dislikes + 1);
      setDislikesImage(selectedDislikesBtn.src);
      usersDisliked.push(username);
      if (liked) await saveLike();

      const supabase = createClient();
      const res = await supabase.from("Comments")
        .update({dislikes: dislikes + 1, users_disliked: usersDisliked})
        .eq("id", id);
      if (res.error) { console.error(res.error) }

    } else {
      setDisliked(false);
      setDislikes(dislikes - 1);
      setDislikesImage(unselectedDislikesBtn.src);
      usersDisliked.splice(usersDisliked.indexOf(username), 1);

      const supabase = createClient();
      const res = await supabase.from("Comments")
        .update({dislikes: dislikes - 1, users_disliked: usersDisliked})
        .eq("id", id);
      if (res.error) { console.error(res.error) }
    }
  }

  return (
      <div className="flex flex-row gap-2">
        <button onClick={saveLike}>
          <img src={likesImage} className="w-8 h-8"/>
        </button>
        <h1 className="pt-1" >{likes}</h1>
        <button onClick={saveDislike}>
          <img src={dislikesImage} className="w-8 h-8"/>
        </button>
        <h1 className="pt-1">{dislikes}</h1>
      </div>
  );

}

