"use client";
import { createClient } from "@/utils/supabase/client";
import Likes from "@/components/buttons/LikesButton";
import ReplyButton from "@/components/buttons/ReplyButton";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import EditButton from "@/components/buttons/EditButton";
import DeleteButton from "@/components/buttons/DeleteButton";
import submitReply from "@/app/utils/Submissions/submitReply";
import editComment from "@/app/utils/Misc/editComment";
import ProfilePic from "@/components/images/profilepic";
import unhighlightedCommentBtn from "@/assets/unhighlighted_replies_button.jpg";
import highlightedCommentBtn from "@/assets/highlighted_replies_button.jpg";
import convertDate from "@/app/utils/dateConversion/convertDateV2";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";

const Toolbar = dynamic(() => import('@/components/misc/toolbar'), { ssr: false });

export default function CommentSection(params: any) {
  
  const userData = params.userData;
  const username = userData.username;
  const user_type = userData.user_type;
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

  const [editingMode, setEditingMode] = useState(false);
  const [createReply, setCreateReply] = useState(false);
  const [content, setContent] = useState("");
  const [editingContent, setEditingContent] = useState(commentData.content);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesBtn, setRepliesBtn] = useState(unhighlightedCommentBtn.src);
  const [repliesLoaded, setRepliesLoaded] = useState(<div></div>);

  const router = useRouter();
  const supabase = createClient();

  const replyData = {
    username,
    discussionId,
    commentId,
    replies,
    posts,
    written_by,
    setCreateReply,
    router
  }

  const editData = {
    editingMode,
    editingContent,
    commentId,
    username,
    setEditingMode,
    router
  }

  const showComments = () => {
    setShowReplies(!showReplies);
    setRepliesBtn(showReplies ? unhighlightedCommentBtn.src : highlightedCommentBtn.src);
    setRepliesLoaded(
      <div>
      {replies.map(async (replyId: any, index: number) => {
        const res = await supabase.from("Comments").select().eq("id", replyId);
        if (res.error) { console.error(res.error) }
        const reply = res.data && res.data[0];
        return <CommentSection discussionId={discussionId} commentData={reply} userData={userData} title={null} key={index} />}
      )}
      </div>
    );
  }
  
  return (
    <div className="flex flex-row w-full max-w-5xl">
      <div style={{width: "2.5rem"}}></div>
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-col w-full gap-3 p-3 bg-white border-2">
          <div className="flex flex-row items-center justify-between p-2 border-b-2 border-gray-300 focus:outline-none">
            <div className="flex flex-row gap-2"
            aria-haspopup="menu" aria-expanded="false" data-headlessui-state=""
            >
              <span id="navbar_user_avatar" className="relative w-10 h-10 ml-1">
                <ProfilePic username={written_by} />
              </span>
              <div className="flex flex-col">
                <h1 className="font-medium text-gray-500">{written_by}</h1>
                <h1>{convertDate(created_time) + (commentData.editted ? " (edited)" : "")}</h1>
              </div>
            </div>
            <ReplyButton createReply={createReply} setCreateReply={setCreateReply}></ReplyButton>
          </div>
          {title && <h1 className="pl-1 text-2xl font-medium">{title}</h1>}
          {commentData.deleted
          ? <h1 className="pl-1 text-xl font-medium">This comment was deleted.</h1>
          : editingMode && username === written_by
          ? <form className="w-full gap-3 p-3 bg-white border-2">
              <Toolbar content={editingContent} setContent={setEditingContent} editMode={true} style={{height: "150px"}}/>
              <SubmitButton
                formAction={formData => editComment(formData, editData)}
                className="w-1/6 px-4 py-2 mt-2 bg-blue-400 border rounded-md border-foreground/20 text-foreground"
                pendingText="Editing..."
              >Edit
              </SubmitButton>
            </form>
          : <div className="flex flex-col gap-4 pl-2">
            {parse(commentData.content)}
            </div>
          }
          <div className={`flex flex-row items-center ${commentData.deleted ? "justify-end" : "justify-between"}`}>
            {!commentData.deleted &&
              <div className="flex flex-row gap-5">
                <Likes commentData={commentData} username={username}></Likes>
                {username === written_by && <EditButton editingMode={editingMode} setEditingMode={setEditingMode}></EditButton>}
                {(username === written_by || user_type.includes("admin")) &&  <DeleteButton commentId={commentId} ></DeleteButton>}
              </div>
            }
            <button className="flex flex-row items-center gap-1" onClick={showComments}>
              <img className="w-8 h-8" src={repliesBtn} alt="comment button"/>
              <h1>{numOfReplies}</h1>
            </button>
          </div>
        </div>
        {createReply && 
        <div className="flex flex-row w-full max-w-5xl mt-4">
          <div style={{width: "2.5rem"}} ></div>
          <form className="w-full gap-3 p-3 bg-white border-2">
            <div className="flex flex-row items-center p-2 mb-2 focus:outline-none">
              <div className="flex flex-row gap-2"
                aria-haspopup="menu" aria-expanded="false" data-headlessui-state=""
                >
                  <span id="navbar_user_avatar" className="relative w-10 h-10 ml-1">
                    <ProfilePic username={username} />
                  </span>
                  <div className="flex flex-col">
                  <h1 className="font-medium text-gray-500">{username}</h1>
                  <h1>{convertDate(new Date().toString())}</h1>
                  </div>
                </div>
            </div>
            <Toolbar placeholder="Write your reply here..." content={content} setContent={setContent} style={{height: "150px"}} />
            <SubmitButton
              formAction={formData => submitReply(content, replyData)}
              className="w-1/6 px-4 py-2 mt-2 bg-blue-400 border rounded-md border-foreground/20 text-foreground"
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