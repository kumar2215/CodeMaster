"use client";
import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { SubmitButton } from '@/components/buttons/submit-button';

function MCQ(params: any) {

  const data = params.data;

  const questionId: string = data.questionId;
  const userEmail: string = data.userEmail;
  const question: string = data.question;
  const part: string = data.part;
  const options: string[] = data.options;
  const points: number = data.points;
  const expected: string = data.expected;

  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  
  const handleOptionChange = (event: any) => {
    if (submitted) { return; }
    setSelectedOption(event.target.value);
  };
  
  const handleSubmit = async () => {
    const supabase = createClient();
    setSubmitted(true);

    const res = await supabase.from("Users").select("*").eq("email", userEmail);
    if (res.error) { console.error(res.error); }

    const XP: number = res.data && res.data[0].XP;
    const newXP: number = selectedOption === expected ? XP + points : XP;
    let questionsDone: any[] = res.data && res.data[0].questions_done;
    questionsDone = questionsDone ? questionsDone : [];

    const index = questionsDone.findIndex(
      (question: { id: string; part: string}) => question.id === questionId && question.part === part);

    let questionDone: any = {};

    if (index !== -1) {
      questionDone = questionsDone[index];
      const status = questionDone.status;
      if (status === "Correct") {
        alert("You have already answered this question correctly."); 
        return; 
      } else if (status === "Too many wrong attempts") {
        alert("You have wrongly answered this question too many times.");
        return;
      }
      const bestScore = questionDone.pointsAccumulated;
      if (newXP > bestScore) {
        questionDone.status = selectedOption === expected ? "Correct" : "Incorrect";
        questionDone.pointsAccumulated = newXP;
      }
      questionDone.attempts += 1;
    }

    else {
      questionDone = {
        id: questionId,
        part: part,
        status: selectedOption === expected ? "Correct" : "Incorrect",
        pointsAccumulated: newXP,
        attempts: 1
      };
    }

    if (index !== -1) {
      questionsDone[index] = questionDone;
    } else {
      questionsDone.push(questionDone);
    }
    
    const res2 = await supabase.from("Users").update({ XP: newXP, questions_done: questionsDone }).eq("email", userEmail);
    if (res2.error) { console.error(res2.error); }

    console.log("User stats updated");
  };
  
  return (
  <div className="w-full max-w-5xl bg-slate-50 p-3 border-4">
    <div className="flex flex-row p-2">
      <span className="text-lg font-bold pr-2">{`(${part})`}</span>
      <p className="text-lg font-medium">{question}</p>
    </div>
    <div>
      <form>
      {options.map((option, index) => (
        <div key={index} className="flex flex-row p-2 pl-4">
          <label className="inline-flex items-center">
          <input
          type="radio"
          name="options"
          value={option}
          checked={selectedOption === option}
          onChange={handleOptionChange}
          />
          <span className="text-lg font-medium pl-2">{option}</span>
          </label>
        </div>
      ))}
      <div className="flex flex-row justify-between p-2 pl-4 m-2 mb-0">
        <SubmitButton
        formAction={handleSubmit}
        className="text-lg font-medium bg-blue-500 text-white p-2 rounded-lg"
        pendingText='Submitting...'
        >
          Submit
        </SubmitButton>
        <span className="text-lg font-medium pr-5 pt-2">{
          !submitted 
          ? `[${points} points]` 
          : selectedOption === expected
          ? `${points}/${points} ✅`
          : `0/${points} ❌`
        }</span> 
      </div>
      </form>
    </div>
  </div>
  );
};

export default MCQ;
