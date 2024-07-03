import { createClient } from "@/utils/supabase/client";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

export default async function submitFreestyle(
  data: any,
  code: string,
  results: any[],
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setSubmitted: Dispatch<SetStateAction<boolean>>,
  setAccPoints: Dispatch<SetStateAction<number>>,
  setError: Dispatch<SetStateAction<string>>,
) {
  setIsLoading(true);
  setSubmitted(true);

  const id: string = data.questionId;
  const part: string = data.part;
  const partId: string = data.partId;
  const username: string = data.username;
  const precode = data.precode;
  const postcode = data.postcode;
  const language: string = data.language;
  const parameters: any = data.parameters;
  const inputs: any[] = data.inputs;
  const points: number[] = data.points;
  const function_name: string = data.function_name;

  let total = 0;
  for (let i = 0; i < inputs.length; i++) {
    total += points[i];
  }
  const answeredRight: string[] = Array(inputs.length).fill("Incorrect");

  let pointsAccumulated: number = 0;

  const supabase = createClient();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  console.log("Sending code to server");
  try {
    const response = await fetch(`${SERVER_URL}/api/runCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        precode: precode,
        postcode: postcode,
        language: language,
        parameters: parameters,
        function_name: function_name,
        testcases: inputs
      })
    });

    if (response.ok) {
      const data = await response.json();
      const result = data.results;

      if (result.error) {
        setError(result.error);
      } else {
        // console.log(results);
        result.forEach((res: any, index: number) => {
          if (res.actual === res.expected) {
            answeredRight[index] = "Correct";
            pointsAccumulated += points[index];
          }
          results[index][1](res);
        });
        setAccPoints(pointsAccumulated);
      }

    } else {
      console.error(response.status, response.statusText);
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error("Something went wrong. Please try again.", {autoClose: 3000});
  }

  const res = await supabase.from("Users").select("*").eq("username", username);
  if (res.error) { console.error(res.error); }

  const XP: number = res.data && res.data[0].XP;
  const newXP: number = XP + pointsAccumulated;
  let questionsDone: any[] = res.data && res.data[0].questions_done;
  questionsDone = questionsDone ? questionsDone : [];

  const res2 = await supabase.from("Freestyle").select("*").eq("id", partId);
  if (res2.error) { console.error("Can't select from Frrestyle table\n" + res2.error); }

  let done_by = res2.data && res2.data[0].done_by;
  let avg_score = res2.data && res2.data[0].average_score;

  const index = questionsDone.findIndex(
    (question: { id: string }) => question.id === id);

  let questionDone: any = {};
  let partDone: any = {};

  const res3 = await supabase.from("Questions").select("*").eq("id", id);
  if (res3.error) { console.error(res3.error); }

  const questionData = res3.data && res3.data[0];
  const partsAvailable = questionData && questionData.parts.length;

  if (index !== -1) {
    questionDone = questionsDone[index];
    const index2 = questionDone.parts.findIndex((p : any) => p.part === part);
    if (index2 !== -1) {
      partDone = questionDone.parts[index2];
      const status: string[] = partDone.status;
      if (status.every((s: string) => s === "Correct")) {
        toast("You have already answered this correctly.", {type: "info", autoClose: 3000});
        return; 
      } 
      const prevScore = partDone.pointsAccumulated;
      for (let i = 0; i < partDone.status.length; i++) {
        if (partDone.status[i] !== "Correct") {
          partDone.status[i] = answeredRight[i];
        }
      }
      partDone.pointsAccumulated = pointsAccumulated + prevScore;
      questionDone.parts[index2] = partDone;
      avg_score = (avg_score * done_by + pointsAccumulated) / done_by;
      partDone.attempts += 1;
    }

    else {
      partDone = {
        part: part,
        partId: partId,
        type: "Freestyle",
        status: answeredRight,
        pointsAccumulated: pointsAccumulated,
        attempts: 1
      }
      avg_score = (avg_score * done_by + total) / (done_by + 1);
      done_by += 1;
      questionDone.parts.push(partDone);
      questionDone.pointsAccumulated = questionDone.parts.reduce((acc: number, p: any) => acc + p.pointsAccumulated, 0);
    }

    questionsDone[index] = questionDone;
  }

  else {
    questionDone = {
      id: id,
      parts: [
        {
          part: part,
          partId: partId,
          type: "Freestyle",
          status: answeredRight,
          pointsAccumulated: pointsAccumulated,
          attempts: 1
        }
      ],
      pointsAccumulated: pointsAccumulated,
      status: partsAvailable === 1 && answeredRight.every((s: string) => s === "Correct") ? "Completed" : "Attempted"
    }
    avg_score = (avg_score * done_by + pointsAccumulated) / (done_by + 1);
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
      .update({ completed_by: completed_by, average_score: q_avg_score }).eq("id", id);
      if (res4.error) { console.error(res4.error);
      }
    }
  }

  const res5 = await supabase.from("Users").update({XP: newXP, questions_done: questionsDone}).eq("username", username);
  if (res5.error) { console.error(res5.error); }
  else { console.log("User stats updated") };
  
  const res6 = await supabase.from("Freestyle").update({done_by: done_by, average_score: avg_score}).eq("id", partId);
  if (res6.error) { console.error(res6.error); }
  else { console.log("Freestyle stats updated") };

  setIsLoading(false);
  return true;
}
