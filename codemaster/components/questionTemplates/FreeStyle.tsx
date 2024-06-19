"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import _ from 'lodash';
import {toast} from "react-toastify";

const CodeEditor = dynamic(() => import('@/components/codeBoxes/CodeEditor'), { ssr: false });

export default function FreeStyle ({data}: {data: any}) {
  
  const id: string = data.questionId;
  const question: string = data.question;
  const part: string = data.part;
  const partId: string = data.partId;
  const username: string = data.username;
  const codeData: string = data.code;
  const language: string = data.language;
  const format: string[] = data.format;
  const inputs: any[] = data.inputs;
  const points: number[] = data.points;
  const function_name: string = data.function_name;
  const source = data.source; 

  if (inputs.length !== points.length) {
    throw new Error('Inputs and points arrays must be the same length');
  }

  const tests: any[] = [];
  for (let i = 0; i < inputs.length; i++) {
    tests.push({input: inputs[i], points: points[i]});
  }
  const answeredRight: string[] = Array(inputs.length).fill("Correct");

  let totalPoints = 0;
  const [code, setCode] = useState(codeData);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [accPoints, setAccPoints] = useState(0);
  const [total, setTotal] = useState(0);
  const [failedTests, setFailedTests] = useState([]);

  const supabase = createClient();
  
  const runCodeAndSumbit = async () => {
    setIsLoading(true);
    setSubmitted(true);

    totalPoints = 0;
    for (let i = 0; i < inputs.length; i++) {
      totalPoints += points[i];
    }
    let pointsAccumulated = totalPoints;
    setTotal(totalPoints);

    try {
      const response = await axios.post('/api/getResult', {
        code: code,
        questionId: id,
        tests: tests,
        function_name: function_name,
        format: format,
        language: language
      });
      console.log(response.data, 'responseData')
      if (response.data.message == 'Some tests failed') {
        setOutput("Some tests failed");
        setFailedTests(response.data.details);
        const failedTests = response.data.details;
        for (let i = 0; i < failedTests.length; i++) {
          const idx = tests.findIndex(test => _.isEqual(test.input, failedTests[i].test));
          if (idx !== -1) {
            pointsAccumulated -= tests[idx].points;
            answeredRight[idx] = "Incorrect";
          }
        }
      } else {
        setOutput(response.data.message)
        setFailedTests([])
      }
      setAccPoints(pointsAccumulated);
    } catch (error: any) {
      if (error.response && error.response.data) {
        if (error.response.data.details) {
          setOutput(`Something went wrong`);
        } else {
          setOutput(error.response.data.message);
        }
      } else {
        // Fallback to the generic Axios error message
        console.log('API error:', error.message);
        setOutput(error.message);
      }
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
  };
  return (
    <div className={!source ? "w-full max-w-5xl bg-slate-50 p-3 border-4" : ""}>
    {part !== "null"
    ? (
    <div className="flex flex-row p-2">
      <span className="text-lg font-bold pr-2">{`(${part})`}</span>
      <p className="text-lg font-medium">{question}</p>
    </div>)
    : (
    <div className="text-lg text-gray-500 min-h-10">{question}</div>
    )}
    <CodeEditor language={language} code={code} setCode={setCode} />
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
    <div className="flex flex-row justify-between p-2 pl-4 mb-0">
      <button className="text-lg font-medium bg-blue-500 text-white p-2 rounded-lg" onClick={runCodeAndSumbit}>
      { isLoading 
        ? <span className="loading loading-spinner w-10"></span>
        : <div className='flex justify-center'>Submit</div>
      }
      </button> 
      <span className="text-lg font-medium pr-5 pt-2">{
        !submitted || isLoading
        ? `[${points.reduce((a: number, b: number) => a + b, 0)} points]`
        :  accPoints === total && submitted && !isLoading
        ? `${total} / ${total} ✅` 
        : `${accPoints} / ${total} ❌`
      }</span>
    </div>            
    <div className={`max-w-full ml-2 whitespace-pre-wrap break-words ${output === 'All tests passed' ? 'text-green-600' : 'text-red-600'}`}>
    {
      failedTests.length > 0 ? (
        <div>
        <div>{output}</div>
        {
          failedTests.map((data: any, index: number) => ( // Add type assertion here
          <div key={index}>
          {`${JSON.stringify((data as any).test)} Got ${(data as any).result} instead`}
          </div>
        ))
      }
      </div>
    ) : (output)
    }
    </div>
    </div>
  );
}