"use client";
import deleteComment from "@/app/utils/Misc/deleteComment";
import binIcon from "@/assets/bin-icon.jpg";

export default function DeleteButton({ commentId } : any) {
  return (
    <div >
      <button onClick={() => commentId && deleteComment(commentId)}>
        <img alt="delete" title="delete" src={binIcon.src} className="w-5 h-5 mt-2 lg:mt-1 lg:w-6 lg:h-6"/>
      </button>
    </div>
  );
}