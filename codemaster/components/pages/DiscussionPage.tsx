"use client";
import { createClient } from "@/utils/supabase/client";
import Likes from "@/components/buttons/LikesButton";
import ReplyButton from "@/components/buttons/ReplyButton";
import { SubmitButton } from "@/components/buttons/submit-button";
import unhighlightedCommentBtn from "@/assets/unhighlighted_replies_button.jpg";
import highlightedCommentBtn from "@/assets/highlighted_replies_button.jpg";
import convertDate from "@/app/utils/dateConversion/convertDateV2";
import { useState } from "react";
import { useRouter } from "next/navigation"
import { toast } from "react-toastify";

export default function CommentSection(params: any) {
  
  const username = params.username;
  const discussionId = params.discussionId;
  const title = params.title;
  const posts = params.posts;
  const commentData = params.commentData;

  const commentId = commentData.id;
  const written_by = commentData.written_by;
  const created_time = commentData.created_at;
  let replies = commentData.replies;
  replies = !replies ? [] : replies;
  const numOfReplies = replies.length;

  const [createReply, setCreateReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesBtn, setRepliesBtn] = useState(unhighlightedCommentBtn.src);
  const [repliesLoaded, setRepliesLoaded] = useState(<div></div>);
  const router = useRouter();

  const submitReply = async (formData: FormData) => {
    
    const content = formData.get("content") as string;
    const newComment = {content: content, written_by: username};

    const supabase = createClient();
    const res = await supabase.from("Comments").insert(newComment).select();
    if (res.error) { 
      console.error(res.error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }

    const newCommentId = res.data && res.data[0].id;
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

  const showComments = () => {
    setShowReplies(!showReplies);
    setRepliesBtn(showReplies ? unhighlightedCommentBtn.src : highlightedCommentBtn.src);
    setRepliesLoaded(
      <div>
      {replies.map(async (replyId: any, index: number) => {
        const supabase = createClient();
        const res = await supabase.from("Comments").select().eq("id", replyId);
        if (res.error) { console.error(res.error) }
        const reply = res.data && res.data[0];
        return <CommentSection discussionId={discussionId} commentData={reply} username={username} title={null} key={index} />}
      )}
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-5xl flex flex-row items-center justify-center">
      <div style={{width: "2.5rem"}}></div>
      <div className="w-full flex flex-col gap-4 ">
        <div className="w-full flex flex-col bg-white p-3 gap-3 border-2">
          <div className="flex flex-row items-center focus:outline-none p-2 justify-between border-b-2 border-gray-300">
            <div className="flex flex-row gap-2"
            aria-haspopup="menu" aria-expanded="false" data-headlessui-state=""
            >
              <span id="navbar_user_avatar" className="relative ml-1 h-10 w-10">
              <img src={`https://api.dicebear.com/8.x/personas/svg?seed=${written_by}`} alt="avatar"
              className="h-full w-full rounded-full object-cover"/>
              </span>
              <div className="flex flex-col">
              <h1 className="text-gray-500 font-medium">{written_by}</h1>
              <h1>{convertDate(created_time)}</h1>
              </div>
            </div>
            <ReplyButton createReply={createReply} setCreateReply={setCreateReply}></ReplyButton>
          </div>
          <div className="flex flex-col pl-2 gap-4">
          {title && <h1 className="text-2xl font-medium">{title}</h1>}
          {commentData.content}
          </div>
          <div className="flex flex-row items-center justify-between">
          <Likes commentData={commentData} username={username}></Likes>
          <button className="flex flex-row items-center gap-1" onClick={showComments}>
            <img className="w-8 h-8" src={repliesBtn} alt="comment button"/>
            <h1>{numOfReplies}</h1>
          </button>
          </div>
        </div>
        {createReply && 
        <div className="w-full max-w-5xl flex flex-row mt-4">
          <div style={{width: "2.5rem"}} ></div>
          <form className="w-full bg-white p-3 gap-3 border-2">
            <div className="flex flex-row items-center focus:outline-none p-2 mb-2">
              <div className="flex flex-row gap-2"
                aria-haspopup="menu" aria-expanded="false" data-headlessui-state=""
                >
                  <span id="navbar_user_avatar" className="relative ml-1 h-10 w-10">
                  <img src={`https://api.dicebear.com/8.x/personas/svg?seed=${username}`} alt="avatar"
                  className="h-full w-full rounded-full object-cover"/>
                  </span>
                  <div className="flex flex-col">
                  <h1 className="text-gray-500 font-medium">{username}</h1>
                  <h1>{convertDate(new Date().toString())}</h1>
                  </div>
                </div>
            </div>
            <textarea 
              className="w-full rounded-md px-2 py-2 bg-inherit border"
              style={{height: "150px"}}
              name="content"
              placeholder="Write your reply here..."
              required
            />
            <SubmitButton
              formAction={submitReply}
              className="w-1/6 bg-blue-400 border border-foreground/20 rounded-md px-4 py-2 text-foreground mt-2"
              pendingText="Replying..."
            >Reply
            </SubmitButton>
          </form>
        </div>}
        {showReplies && repliesLoaded}
        <br/>
      </div>
    </div>
  );
}