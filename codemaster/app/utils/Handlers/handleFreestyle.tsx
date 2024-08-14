"use client";
import FreeStyleDebugging from "@/components/questionTemplates/FreeStyleDebugging";
import FreeStyleRefactoring from "@/components/questionTemplates/FreeStyleRefactoring";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function HandleFreestyle({questionPart, username}: {questionPart: any, username: string}) {

  const questionId: string = questionPart.questionId;
  const partId: string = questionPart.partId;
  let points: number[] = questionPart.points;
  const [submitted, setSubmitted] = useState(false);
  
  const supabase = createClient();

  async function getData() {
    const res = await supabase.from("Users").select("*").eq("username", username);
    if (res.error) { console.error(res.error); }
    
    const questionsDone = res.data && res.data[0].questions_done;
    if (questionsDone) {
      const index = questionsDone.findIndex((question: any) => question.id === questionId);
      if (index !== -1) {
        const questionDone = questionsDone[index];
        const index2 = questionDone.parts.findIndex((partDone: any) => partDone.partId === partId);
        if (index2 !== -1) {
          const partDone = questionDone.parts[index2];
          for (let i = 0; i < partDone.status.length; i++) {
            if (partDone.status[i] === "Correct") {
              points[i] = 0;
            }
          }
          questionDone.parts[index2] = partDone;
          questionsDone[index] = questionDone;
          const res2 = await supabase.from("Users").update({questions_done: questionsDone}).eq("username", username);
          if (res2.error) { console.error(res2.error); }
        }
      }
    }
  }

  useEffect(() => {
    setTimeout(() => getData(), 1000);
  }, [submitted]);
  
  const data = {
    username,
    ...questionPart,
    precode: questionPart.pre_code ? questionPart.pre_code : "",
    postcode: questionPart.post_code ? questionPart.post_code : "",
    language: questionPart.language.toLowerCase(),
    submitted,
    setSubmitted
  }

  return data.refactoring
  ? <FreeStyleRefactoring data={data}></FreeStyleRefactoring>
  : <FreeStyleDebugging data={data}></FreeStyleDebugging>;
}