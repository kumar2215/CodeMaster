"use client";
import { SubmitButton } from "@/components/buttons/submit-button";
import submitCompetition from "@/app/utils/Submissions/submitCompetition";
import submitTournamentReview from "@/app/utils/Submissions/submitTournamentReview";
import { createClient } from "@/utils/supabase/client";
import bcrypt from 'bcryptjs';
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [verified, setVerified] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [passwordPresent, setPasswordPresent] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function getData() {

      const table = type === "contest" ? "Contests" : "Tournaments";
      const { data, error } = await supabase
        .from(table)
        .select(`*`)
        .eq("id", id)
        .single();
  
      if (error) { console.error(error); }
      setVerified(data && data.verified_by !== null);
      setReviewed(data && data.reviewed);
      setPasswordPresent(data && data.password_hash !== null);
    }
    getData();
  }, []);

  const className = 
  `bg-green-300 text-base font-medium p-3 rounded-lg 
  hover:bg-green-400 cursor-pointer hover:font-semibold`;

  const setPassword = async () => {
    let password: string | null = null;
    while (!password) {
      password = prompt("Enter password you want to set for the tournament: ");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const { data, error } = await supabase
    .from("Tournaments")
    .update({ password_hash: hashedPassword })
    .eq("id", id);
    
    if (error) { console.error(error); }

    toast.success("Password set successfully", {autoClose: 3000});
  }

  const submit = async () => {
    let msg: string = ""; 
    let level: any;
    if (verified) [msg, level] = await submitCompetition({type, id, username});
    else if (!reviewed) [msg, level] = await submitTournamentReview({id, username});
    if (msg) toast(msg, {type: level, autoClose: 3000});
    if (level === "success") redirect(`/questions/${type}/${id}`);
  }
  
  return (
    <div className="w-full max-w-5xl flex flex-row justify-between">
      {prevLink && 
        <Link href={`/questions/${prevLink}`}>
          <button 
          className={className}
          style={{border: "1px solid black"}}
          >
          {prevText}
          </button>
        </Link>
      }
      <form>
      {nextLink
      ? <Link href={`/questions/${nextLink}`}>
          <button 
          className={className}
          style={{border: "1px solid black"}}
          >
          {nextText}
          </button>
        </Link>
      : reviewed && verified && !passwordPresent
      ? <SubmitButton
        className={className}
        style={{border: "1px solid black"}}
        formAction={setPassword}
        pendingText="Setting password..."
        >
          Set password and publish
        </SubmitButton> 
      : reviewed && !verified
      ? <Link href={`/questions/${type}/${id}`}>
          <button 
          className={className}
          style={{border: "1px solid black"}}
          >
          Go back to start page
          </button>
        </Link>
      : <SubmitButton
        className={className}
        style={{border: "1px solid black"}}
        formAction={submit}
        pendingText="Submitting..."
        >
          {verified ? `Submit ${type}` : "Submit review"}
        </SubmitButton> 
      }
      </form>
    </div>
  );
}