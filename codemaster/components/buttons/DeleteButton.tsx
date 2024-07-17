"use client";
import deleteComment from "@/app/utils/Misc/deleteComment";
import binIcon from "@/assets/bin-icon.jpg";

export default function DeleteButton({ commentId } : any) {
  return (
    <div >
      <button onClick={() => commentId && deleteComment(commentId)}>
        <img alt="delete" title="delete" src={binIcon.src} className="w-6 h-6 mt-1"/>
      </button>
    </div>
  );
}