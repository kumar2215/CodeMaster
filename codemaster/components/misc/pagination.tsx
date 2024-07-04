"use client";
import { SubmitButton } from "@/components/buttons/submit-button";
import submitCompetition from "@/app/utils/Submissions/submitCompetition";
import Link from "next/link";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export default function Pagination(params: any) {

  const data = params.paginationData;

  const type: string = data.type;
  const id: string = data.id;
  const username: string = data.username;
  const prevLink: string = data.prevId;
  const nextLink: string = data.nextId;
  const prevText: string = data.prevText;
  const nextText: string = data.nextText;

  const className = 
  `bg-green-300 text-base font-medium p-3 rounded-lg 
  hover:bg-green-400 cursor-pointer hover:font-semibold`;

  const submit = async () => {
    let msg: string; 
    let level: any;
    [msg, level] = await submitCompetition({type, id, username});
    toast(msg, {type: level, autoClose: 3000});
    if (level === "success") redirect(`/questions/${type}/${id}`);
  }
  
  return (
    <div className="w-full max-w-5xl flex flex-row justify-between">
      {prevLink && 
        <button 
        className={className}
        style={{border: "1px solid black"}}
        >
          <Link href={`/questions/${prevLink}`}>{prevText}</Link>
        </button>
      }
      <form>
      {nextLink
      ? <button 
        className={className}
        style={{border: "1px solid black"}}
        >
          <Link href={`/questions/${nextLink}`}>{nextText}</Link>
        </button>
      : <SubmitButton
        className={className}
        style={{border: "1px solid black"}}
        formAction={submit}
        pendingText="Submitting..."
        >
          {`Submit ${type}`}
        </SubmitButton> 
      }
      </form>
    </div>
  );
}