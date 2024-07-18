"use client";
import submitPost from "@/app/utils/Submissions/submitPost";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import dynamic from "next/dynamic";
import { useState } from "react";

const Toolbar = dynamic(() => import('@/components/misc/toolbar'), { ssr: false });

export default function Post(params: any) {

  const username = params.username;
  const topic = params.topic;
  const [content, setContent] = useState("");

  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-row w-full">
        <label className="pr-3 text-lg" htmlFor="title">
          Title:
        </label>
        <input
            className="w-3/5 px-2 py-1 border rounded-md bg-inherit"
            name="title"
            placeholder=""
            required
        />
      </div>
      <Toolbar placeholder="Write your post here..." content={content} setContent={setContent} style={{height: "200px"}} />
      <SubmitButton
          formAction={formData => submitPost(formData, content, topic, username)}
          className="w-1/6 px-4 py-2 mb-2 bg-green-300 border rounded-md border-foreground/20 text-foreground"
          pendingText="Creating..."
      >
        Create
      </SubmitButton>
    </form>
  );
}
