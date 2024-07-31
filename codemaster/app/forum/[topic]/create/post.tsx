"use client";
import submitPost from "@/app/utils/Submissions/submitPost";
import { createClient } from "@/utils/supabase/client";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Toolbar = dynamic(() => import('@/components/misc/toolbar'), { ssr: false });

export default function Post(params: any) {

  const username = params.username;
  const topic = params.topic;
  const [content, setContent] = useState("");
  const [changed, setChanged] = useState(false);
  const [competition, setCompetition] = useState("");
  const [lst, setLst]: any = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (topic === "contests" || topic === "tournaments") {
        setCompetition(topic[0].toUpperCase() + topic.slice(1, -1));
        const table = topic === "contests" ? "Contests" : "Tournaments";
        const supabase = createClient();
        const res = await supabase.from(table).select("*");
        if (res.error) { console.error(res.error) }
        setLst(res.data && res.data.map((item: any) => item.name));
        setChanged(true);
      }
    }
    fetchData();
  }, [changed]);

  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-row w-full">
        <label className="pr-3 text-base lg:text-lg" htmlFor="title">
          Title:
        </label>
        <input
            className="w-3/5 px-2 border rounded-md lg:py-1 bg-inherit"
            name="title"
            placeholder=""
            required
        />
      </div>
      {competition &&
      <div className="flex flex-row w-full">
        <label className="pr-3 text-base lg:text-lg" htmlFor="name">
          {`${competition}:`}
        </label>
        <select
          className="w-3/5 px-2 border rounded-md lg:py-1 bg-inherit"
          name="name"
          required
        >
          {lst.map((item: any) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>}
      <div className="flex flex-row w-full">
        <label className="pr-3 text-base lg:text-lg" htmlFor="password">
          Password:
        </label>
        <input
          className="w-3/5 px-2 border rounded-md lg:py-1 bg-inherit"
          name="password"
          placeholder="(optional)"
          type="password"
        />
      </div>
      <Toolbar placeholder="Write your post here..." content={content} setContent={setContent} style={{height: "200px"}} />
      <SubmitButton
          formAction={formData => submitPost(formData, content, topic, username)}
          className="w-1/3 px-2 py-2 mb-2 bg-green-300 border rounded-md lg:w-1/6 lg:px-4 border-foreground/20 text-foreground"
          pendingText="Creating..."
      >
        Create
      </SubmitButton>
    </form>
  );
}
