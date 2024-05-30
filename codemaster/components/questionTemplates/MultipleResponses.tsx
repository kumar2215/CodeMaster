"use client";
import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { SubmitButton } from '@/components/buttons/submit-button';

export default function MultipleResponses(params: any) {

  const data = params.data;

  const questionId: string = data.questionId;
  const partId: string = data.partId;
  const username: string = data.username;
  const question: string = data.question;
  const part: string = data.part;
  const format: string[] = data.format;
  const inputs: any[] = data.inputs;
  const points: number[] = data.points;

  const inputStates: any[] = inputs.map((input: any) => {return useState("");});
  const [submitted, setSubmitted] = useState(false);
  const [additionalPoints, setAdditionalPoints] = useState(0);
  const answeredRight: string[] = Array(inputs.length).fill("Incorrect");
  const totalPoints: number = points.reduce((a: number, b: number) => a + b, 0);

  const handleInputChange = (event: any, index: number) => {
    if (submitted) { return; }
    inputStates[index][1](event.target.value);
  }

  const handleSubmit = async () => {
    if (inputStates.some((inputState: any) => inputState[0] === "")) { 
      alert("Please fill in all the inputs before submitting.");
      return; 
    }

    setSubmitted(true);
    const supabase = createClient();

    const res = await supabase.from("Users").select("*").eq("username", username);
    if (res.error) { console.error(res.error); }

    const XP: number = res.data && res.data[0].XP;
    let total: number = 0;
    for (let i = 0; i < inputs.length; i++) {
      let expected = inputs[i].expected;
      expected = typeof expected === "object" ? JSON.stringify(expected) : expected.toString();
      if (inputStates[i][0] === expected) {
        total += points[i];
        answeredRight[i] = "Correct";
        inputStates[i][1](`${points[i]}/${points[i]} ✅`);
      }
      else {
        inputStates[i][1](`0/${points[i]} ❌`);
      }
    }
    setAdditionalPoints(total);
    const newXP: number = XP + total;
    let questionsDone: any[] = res.data && res.data[0].questions_done;
    questionsDone = questionsDone ? questionsDone : [];

    const res2 = await supabase.from("Multiple-Responses").select("*").eq("id", partId);
    if (res2.error) { console.error("Can't select from MR table\n" + res2.error); }

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
      console.log(questionDone.parts, index2);
      if (index2 !== -1) {
        partDone = questionDone.parts[index2];
        const status: string[] = partDone.status;
        if (status.every((s: string) => s === "Correct")) {
          alert("You have already answered this part correctly."); 
          return; 
        } else if (status.every((s: string) => s === "Too many wrong attempts")) {
          alert("You have already attempted this part too many times.");
          return;
        }
        const prevScore = partDone.pointsAccumulated;
        for (let i = 0; i < partDone.status.length; i++) {
          if (partDone.status[i] !== "Correct") {
            partDone.status[i] = answeredRight[i];
          }
        }
        partDone.pointsAccumulated = prevScore + total;
        questionDone.parts[index2] = partDone;
        avg_score = (avg_score * done_by + total) / done_by;
        const Total = questionDone.parts.reduce((acc: number, p: any) => acc + p.pointsAccumulated, 0);
        questionDone.pointsAccumulated = Total;
        if (partsAvailable === questionDone.parts.length) {
          if (questionDone.parts.every((p: any) => p.status === "Correct" || p.status.every((s: string) => s === "Correct"))) {
            questionDone.status = "Completed";
            let completed_by = questionData.completed_by;
            let q_avg_score = questionData.average_score;
            q_avg_score = (q_avg_score * completed_by + Total) / (completed_by + 1);
            completed_by += 1;
            const res4 = await supabase.from("Questions")
            .update({ completed_by: completed_by, average_score: q_avg_score }).eq("id", questionId);
            if (res4.error) { console.error(res4.error)};
          }
        }
        partDone.attempts += 1;
      } 
      
      else {
        partDone = {
          part: part,
          partId: partId,
          type: "Multiple-Responses",
          status: answeredRight,
          pointsAccumulated: total,
          attempts: 1,
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
        id: questionId,
        pointsAccumulated: total,
        parts: [
          {
            part: part,
            partId: partId,
            type: "Multiple-Responses",
            status: answeredRight,
            pointsAccumulated: total,
            attempts: 1,
          }
        ],
        status: partsAvailable === 1 && answeredRight.every((s: string) => s === "Correct") ? "Completed" : "Attempted"
      }
      avg_score = (avg_score * done_by + total) / (done_by + 1);
      done_by += 1;
      questionsDone.push(questionDone);
    }

    const res5 = await supabase.from("Users").update({questions_done: questionsDone, XP: newXP}).eq("username", username);
    if (res5.error) { console.error(res5.error); }
    else { console.log("User stats updated") };
    
    const res6 = await supabase.from("Multiple-Responses").update({done_by: done_by, average_score: avg_score}).eq("id", partId);
    if (res6.error) { console.error("Can't update MR table\n" +res6.error); }
    else { console.log("Multiple Responses stats updated") };
  }  
  return (
    <div className="w-full max-w-5xl flex flex-col bg-slate-50 p-3 border-4">
    <form>
    <div className="flex flex-row p-2">
    <span className="text-lg font-bold pr-2">{`(${part})`}</span>
    <p className="text-lg font-medium">{question}</p>
    </div>
    <div 
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${format.length+1}, 1fr)`,
      paddingLeft: "2rem",
      paddingRight: "2rem"
    }}
    >
    {format.map((header: string, index: number) => (
      <div key={index} 
      className="flex flex-row justify-center text-lg font-bold"
      style={{
        border: "2px solid black", 
        borderRight: index === format.length ? "2px solid black" : "none", 
      }}
      >
      {header}
      </div>
    ))}
    <div 
    className="flex flex-row justify-center text-lg font-bold"
    style={{border: "2px solid black", borderRight: "2px solid black"}}
    >expected</div>
    </div>
    <div
    style={{
      display: "grid",
      gridTemplateRows: `repeat(${inputs.length}, 1fr)`,
      paddingLeft: "2rem",
      paddingRight: "2rem"
    }}
    >
    {inputs.map((input: any, idx: number) => {
      return (
        <div
        key={idx}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${format.length+1}, 1fr)`,
        }}
        >
        {Object.values(input).slice(0, format.length).map((value: any, idx2: number) => (
          <div key={idx2} 
          className="flex flex-row justify-center text-lg font-medium" 
          style={{
            border: "2px solid black",
            borderRight: idx2 === format.length ? "2px solid black" : "none",
            borderBottom: idx === inputs.length-1 ? "2px solid black" : "none",
            borderTop: idx === 0 ? "none" : "2px solid black",
          }}>
          {typeof value === "object" ? JSON.stringify(value).split(",").join(", ") : value}
          </div>
        ))}
        <div 
        key={idx}
        style={{
          border: "2px solid black", 
          borderBottom: idx === inputs.length ? "none" : "2px solid black", 
          borderTop: "none"}}
          >
          <input 
          className="w-full h-full bg-gray-200 text-lg text-center font-medium"
          placeholder={`[${points[idx]} points]`}
          onChange={(event) => handleInputChange(event, idx)}
          value={inputStates[idx][0]}
          >
          </input>
          </div>
          </div>
        )
      })}
      </div>
      <div className="flex flex-row justify-between p-2 pl-4 m-2 mb-0">
      <SubmitButton
        formAction={handleSubmit}
        className="text-lg font-medium bg-blue-500 text-white p-2 rounded-lg"
        pendingText='Submitting...'
        >
        Submit
      </SubmitButton>
      <span className="text-lg font-medium pr-5 pt-2">{
        !submitted || !inputStates.every((inputState: any) => inputState[0] !== "")
        ? `[${totalPoints} points]` 
        : additionalPoints === totalPoints && submitted
        ? `${totalPoints} / ${totalPoints} ✅`
        : `${additionalPoints} / ${totalPoints}❌`
      }
      </span>
      </div>
      </form>
      </div>
    );    
}
