"use client";
import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { SubmitButton } from '@/components/buttons/submit-button';
import placeInCodeBox from '@/components/codeBoxes/codeBox';

export default function MRQ(params: any) {
  
  const data = params.data;
  
  const questionId: string = data.questionId;
  const partId: string = data.partId;
  const username: string = data.username;
  const question: string = data.question;
  const part: string = data.part;
  const options: any[] = data.options;
  const points: number = data.points;
  const expected: number[] = data.expected;
  const source = data.source;

  const partial = points / expected.length;
  let answeredRight: string = "Incorrect";
  const selectedOptions = options.map(() => useState(false));
  const [numOptionsSelected, setNumOptionsSelected] = useState(0);
  const [additionalPoints, setAdditionalPoints] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  
  const handleOptionChange = (event: any, index: any) => {
    if (submitted) { return; }
    selectedOptions[index][1](event.target.checked);
    if (event.target.checked) {
      setNumOptionsSelected(numOptionsSelected + 1);
    } else {
      setNumOptionsSelected(numOptionsSelected - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (numOptionsSelected === 0) {
      alert("Please select at least 1 option before submitting.");
      return;
    }
    setSubmitted(true);
    const supabase = createClient();
    
    const res = await supabase.from("Users").select("*").eq("username", username);
    if (res.error) { console.error(res.error); }

    const answeredRightIndividual: string[] = selectedOptions.map(
        (selectedOption: any[], index: number) => 
            (selectedOption[0] && expected.includes(index+1))
        || (!selectedOption[0] && !expected.includes(index+1))
        ? "Correct" : "Incorrect")

    console.log(answeredRightIndividual);
    
    const XP: number = res.data && res.data[0].XP;
    let total: number = 0;
    for (let i = 0; i < options.length; i++) {
        if (answeredRightIndividual[i] === "Correct" && expected.includes(i+1)) {
            total += partial;
        }
    }
    total = Math.round(total);
    answeredRight = answeredRightIndividual.every((s: string) => s === "Correct") ? "Correct" : "Incorrect";
    console.log(answeredRight);
    setAdditionalPoints(total);
    let newXP: number = XP;
    let questionsDone: any[] = res.data && res.data[0].questions_done;
    questionsDone = questionsDone ? questionsDone : [];
    
    const res2 = await supabase.from("MRQ").select("*").eq("id", partId);
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
          alert("You have already answered this part correctly."); 
          return; 
        } else if (status === "Too many wrong attempts") {
          alert("You have wrongly answered this part too many times.");
          return;
        }
        const prevScore = partDone.pointsAccumulated;
        if (total > prevScore) {
            partDone.status = answeredRight;
            partDone.pointsAccumulated = total;
            questionDone.parts[index2] = partDone;
            avg_score = (avg_score * done_by - prevScore + total) / done_by;
            newXP += total - prevScore;
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
                    if (res4.error) { console.error(res4.error);
                    }
                }
            }
            partDone.attempts += 1;
        } else {
            alert("You have already answered this part with a higher score. Only the highest score is taken.");
            return;
        }
      } 
      
      else {
        partDone = {
          part: part,
          partId: partId,
          type: "MRQ",
          status: answeredRight,
          pointsAccumulated: total,
          attempts: 1
        };
        avg_score = (avg_score * done_by + total) / (done_by + 1);
        done_by += 1;
        newXP += total;
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
            type: "MRQ",
            status: answeredRight,
            pointsAccumulated: total,
            attempts: 1
          }
        ],
        status: partsAvailable === 1 && answeredRight === "Correct" ? "Completed" : "Attempted"
      };
      avg_score = (avg_score * done_by + total) / (done_by + 1);
      done_by += 1;
      if (partsAvailable === 1 && answeredRight === "Correct") {
        let completed_by = questionData.completed_by;
        let q_avg_score = questionData.average_score;
        q_avg_score = (q_avg_score * completed_by + additionalPoints) / (completed_by + 1);
        completed_by += 1;
        const res4 = await supabase.from("Questions")
        .update({ completed_by: completed_by, average_score: q_avg_score }).eq("id", questionId);
        if (res4.error) { console.error(res4.error); }
      }
      newXP += total;
      questionsDone.push(questionDone);
    }
      
    const res5 = await supabase.from("Users").update({ XP: newXP, questions_done: questionsDone }).eq("username", username);
    if (res5.error) { console.error(res5.error); }
    else { console.log("User stats updated") };
    
    const res6 = await supabase.from("MRQ").update({ done_by: done_by, average_score: avg_score }).eq("id", partId);
    if (res6.error) { console.error(res6.error); }
    else { console.log("MRQ stats updated") };
  };
  
  return (
    <div className={!source ? "w-full max-w-5xl bg-slate-50 p-3 border-4" : ""}>
    {part !== "null"
    ? (
    <div className="flex flex-row">
      <span className="text-lg font-bold pr-2">{`(${part})`}</span>
      <p className="text-lg font-medium">{question}</p>
    </div>)
    : (
    <div className="text-lg font-medium">{question}</div>
    )}
    <div>
    <form>
    {options.map((option, index) => (
      <div key={index} className="flex flex-row p-2 pl-4">
      <label className="inline-flex items-center">
      <input
      type="checkbox"
      name="options"
      value={option}
      checked={selectedOptions[index][0]}
      onChange={(event) => handleOptionChange(event, index)}
      >
      </input>
      <span className="text-lg font-medium pl-2">{
        !option.language ? option.value : placeInCodeBox(option.value, option.language)
      }</span>
      </label>
      </div>
    ))}
    { source
      ? source.link
      ? <div className="text-lg font-medium leading-10">
      <p>source: 
      <a 
      href={source.src}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-blue-500 hover:underline cursor-pointer px-2"
      >{source.src}</a>
      </p>
      </div>
      : <div className="text-lg font-medium leading-10">source: {source.src}</div>
      : <></>
    }
    <div className={`flex flex-row justify-between p-2 ${!source ? "m-2" : ""} mb-0`}>
    <SubmitButton
    formAction={handleSubmit}
    className="text-lg font-medium bg-blue-500 text-white p-2 rounded-lg"
    pendingText='Submitting...'
    >
    Submit
    </SubmitButton>
    <span className="text-lg font-medium pr-5 pt-2">{
      !submitted || !numOptionsSelected
      ? `[${points} points]` 
      : additionalPoints === points && submitted
      ? `${points} / ${points} ✅`
      : `${additionalPoints} / ${points} ❌`
    }</span> 
    </div>
    </form>
    </div>
    </div>
  );
};
