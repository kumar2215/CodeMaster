"use client";
import replyBtn from "@/assets/reply_button.jpg";

export default function ReplyButton(data: any) {
  const createReply = data.createReply;
  const setCreateReply = data.setCreateReply;

  const createReplyBox = async () => {
    setCreateReply(!createReply);
  }
  
  return (
    <div className="flex flex-col gap-2">
      <button onClick={createReplyBox}>
        <img 
        title="reply"
        src={replyBtn.src} alt="reply button" 
        className="w-6 h-6 lg:w-8 lg:h-8" />
        <h1 className="text-sm lg:text-base hover:text-[#4d9de0]">Reply</h1>
      </button>
    </div>
  );
}