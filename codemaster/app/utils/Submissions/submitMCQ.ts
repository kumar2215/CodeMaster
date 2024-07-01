import { createClient } from "@/utils/supabase/client";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

export default async function submitMCQ(
  data: any, 
  selectedOption: number, 
  setSubmitted: Dispatch<SetStateAction<boolean>>
) {

  const questionId: string = data.questionId;
  const partId: string = data.partId;
  const username: string = data.username;
  const part: string = data.part;
  const points: number = data.points;
  const expected: number = data.expected;

  if (!selectedOption) {
    toast("Please select an option before submitting.", {type: "warning", autoClose: 3000});
    return;
  }
  setSubmitted(true);
  const supabase = createClient();
  
  const res = await supabase.from("Users").select("*").eq("username", username);
  if (res.error) { console.error(res.error); }

  const answeredRight: string = selectedOption === expected ? "Correct" : "Incorrect";
  
  const XP: number = res.data && res.data[0].XP;
  const additionalPoints: number = selectedOption === expected ? points : 0;
  const newXP: number = XP + additionalPoints;
  let questionsDone: any[] = res.data && res.data[0].questions_done;
  questionsDone = questionsDone ? questionsDone : [];
  
  const res2 = await supabase.from("MCQ").select("*").eq("id", partId);
  if (res2.error) { console.error(res2.error); }
  
  let done_by = res2.data && res2.data[0].done_by;
  let avg_score = res2.data && res2.data[0].average_score;
  
  const index = questionsDone.findIndex(
    (question: { id: string; partId: string}) => question.id === questionId);
    
  let questionDone: any = {};
  let partDone: any = {};

  const res3 = await supabase.from("Questions").select("*").eq("id", questionId);
  if (res3.error) { console.error(res3.error); }
    
  const questionData = res3.data && res3.data[0];
  const partsAvailable = questionData && questionData.parts.length;
    
  if (index !== -1) {
    questionDone = questionsDone[index];
    const index2 = questionDone.parts.findIndex((p : any) => p.part === part);
    if (index2 !== -1) {
      partDone = questionDone.parts[index2];
      const status: string = partDone.status;
      if (status === "Correct") {
        toast("You have already answered this part correctly.", {type: "info", autoClose: 3000});
        return; 
      } else if (status === "Too many wrong attempts") {
        toast("You have wrongly answered this part too many times.", {type: "info", autoClose: 3000});
        return;
      }
      partDone.status = answeredRight;
      partDone.pointsAccumulated = additionalPoints;
      questionDone.parts[index2] = partDone;
      avg_score = (avg_score * done_by + additionalPoints) / done_by;
      partDone.attempts += 1;
    } 
    
    else {
      partDone = {
        part: part,
        partId: partId,
        type: "MCQ",
        status: answeredRight,
        pointsAccumulated: additionalPoints,
        attempts: 1
      };
      avg_score = (avg_score * done_by + additionalPoints) / (done_by + 1);
      done_by += 1
      questionDone.parts.push(partDone);
      questionDone.pointsAccumulated = questionDone.parts.reduce((acc: number, p: any) => acc + p.pointsAccumulated, 0);
    }

    questionsDone[index] = questionDone;
  }
  
  else {
    questionDone = {
      id: questionId,
      pointsAccumulated: additionalPoints,
      parts: [
        {
          part: part,
          partId: partId,
          type: "MCQ",
          status: answeredRight,
          pointsAccumulated: additionalPoints,
          attempts: 1
        }
      ],
      status: partsAvailable === 1 && selectedOption === expected ? "Completed" : "Attempted"
    };
    avg_score = (avg_score * done_by + additionalPoints) / (done_by + 1);
    done_by += 1;
    questionsDone.push(questionDone);
  }

  const Total = questionDone.parts.reduce((acc: number, p: any) => acc + p.pointsAccumulated, 0);
  questionDone.pointsAccumulated = Total;
  if (partsAvailable === questionDone.parts.length) {
    if (questionDone.parts.every((p: any) => p.status === "Correct" || (typeof p.status === "object" && p.status.every((s: string) => s === "Correct")))) {
      questionDone.status = "Completed";
      let completed_by = questionData.completed_by;
      let q_avg_score = questionData.average_score;
      q_avg_score = (q_avg_score * completed_by + Total) / (completed_by + 1);
      completed_by += 1;
      const res4 = await supabase.from("Questions")
      .update({ completed_by: completed_by, average_score: q_avg_score }).eq("id", questionId);
      if (res4.error) { console.error(res4.error);
      }
    }
  }
    
  const res5 = await supabase.from("Users").update({ XP: newXP, questions_done: questionsDone }).eq("username", username);
  if (res5.error) { console.error(res5.error); }
  else { console.log("User stats updated") };
  
  const res6 = await supabase.from("MCQ").update({ done_by: done_by, average_score: avg_score }).eq("id", partId);
  if (res6.error) { console.error(res6.error); }
  else { console.log("MCQ stats updated") };
};