"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import placeInCodeBox from "@/components/codeBoxes/CodeBox";
import SubmitButton from "@/components/buttons/SubmitButton";
import { toast } from "react-toastify";

export default function Voting({freestyle_id, refactorings, language, username, colorTheme, voted_alr} : 
  {freestyle_id: string, refactorings: any[], language: string, username: string, colorTheme: string, voted_alr: boolean}
) {

  const numOfRefactorings = refactorings.length;
  const {register, watch} = useForm({});
  const votes = watch("rankings");
  const [voted, setVoted] = useState(false);

  const submitVote = async (formData: FormData) => {
    if (new Set(votes).size !== numOfRefactorings) {
      toast.error("Duplicate ranks are not allowed.", {autoClose: 3000});
      return;
    }
    const supabase = createClient();
    for (let i = 0; i < votes.length; i++) {
      const id = refactorings[i].id;
      const res = await supabase
        .from("Votes")
        .select("rankings")
        .eq("id", id)
        .single();

      if (res.error) {
        console.error(res.error); 
        toast.error("Something went wrong. Please try again.", {autoClose: 3000});
        return;
      }
      
      const rankings = res.data.rankings;
      if (rankings[votes[i]] === undefined) {
        rankings[votes[i]] = 1;
      } else {
        rankings[votes[i]] += 1;
      }
      const res2 = await supabase
        .from("Votes")
        .update({rankings: rankings})
        .eq("id", id);
      if (res2.error) {
        console.error(res2.error); 
        toast.error("Something went wrong. Please try again.", {autoClose: 3000});
        return;
      }
    }

    const res3 = await supabase
      .from("Freestyle")
      .select("voters")
      .eq("id", freestyle_id)
      .single();
    if (res3.error) {
      console.error(res3.error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }

    const voters = res3.data.voters;
    voters.push(username);

    const res4 = await supabase
      .from("Freestyle")
      .update({voters: voters})
      .eq("id", freestyle_id);
    if (res4.error) {
      console.error(res4.error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }

    const res5 = await supabase
      .from("Users")
      .select("XP")
      .eq("username", username)
      .single();  

    if (res5.error) {
      console.error(res5.error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }
    
    const XP = res5.data.XP + 5;
    const res6 = await supabase
      .from("Users")
      .update({XP: XP})
      .eq("username", username);
    if (res6.error) {
      console.error(res6.error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }
    
    setVoted(true);
    toast.success("Thank you for voting!", {autoClose: 3000});
  }

  return (
    <form className="flex flex-col w-screen gap-6 p-2 lg:max-w-4xl lg:w-full">
      <h1 className="text-lg font-semibold text-left lg:text-2xl">Submitted refactorings:</h1>
      {numOfRefactorings === 0 
      ? <p>No refactorings submitted yet</p> 
      : refactorings.map((refactoring: any, idx: number) => 
        <div key={idx} className="flex flex-row overflow-x-auto bg-gray-200 lg:w-full">
          {placeInCodeBox(refactoring.code, language, colorTheme)}
          <select 
          className="bg-gray-200"
          {...register(`rankings.${idx}`)}
          required
          >
            {Array.from({length: numOfRefactorings}, (_, i) => i + 1).map((num: number) => {
              return (
                <option 
                key={num} 
                value={num}
                >{num}</option>
              );
            })}
          </select>
        </div>
      )}
      {!voted_alr && !voted &&
      <div className="flex flex-row justify-end w-full mt-2">
        <SubmitButton
        className="flex items-center justify-center w-1/6 h-10 p-2 text-base font-medium text-white bg-green-500 rounded-md lg:text-lg hover:bg-green-700"
        formAction={submitVote}
        pendingText="Voting..."
        >
          Vote
        </SubmitButton>
      </div>}      
    </form>
  );
}