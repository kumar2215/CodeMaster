"use client";
import {SubmitButton} from "@/components/buttons/submit-button";
import submitToDB from "@/app/utils/ServerActions/savePostToDB";
import dynamic from "next/dynamic";
// import { useState } from "react";
import { toast } from "react-toastify";

const Toolbar = dynamic(() => import('@/components/misc/toolbar'), { ssr: false });

export default function Post(params: any) {

  // const [content, setContent] = useState(null);

  async function submit(formData: FormData, topic: string) {
    const successful = await submitToDB(formData, topic);
    if (successful) toast.success("Post created successfully!", {autoClose: 3000});
    else toast.error("Something went wrong. Please try again.", {autoClose: 3000});
  }

  return (
    <form className="flex flex-col">
      <div className="w-full flex flex-row">
        <label className="text-lg pr-3" htmlFor="title">
          Title:
        </label>
        <input
            className="w-3/5 rounded-md px-2 py-1 bg-inherit border mb-6"
            name="title"
            placeholder=""
            required
        />
      </div>
      <textarea 
          className="w-full rounded-md px-2 py-2 bg-inherit border"
          style={{height: "200px"}}
          name="content"
          placeholder="Write your post here..."
          required
      />
      <br/>
      <SubmitButton
          formAction={formData => submit(formData, params.topic)}
          className="w-1/6 bg-green-300 border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Creating..."
      >
        Create
      </SubmitButton>
    </form>
  );
}
