"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/utils/supabase/client';
import submitFreestyle from '@/app/utils/Submissions/submitFreestyle';
import { SubmitButton } from '@/components/buttons/SubmitButton';
import dropdownBtn from "@/assets/dropdown-btn.jpg"
import { toast } from 'react-toastify';

const CodeEditor = dynamic(() => import('@/components/codeBoxes/CodeEditor'), { ssr: false });

export default function FreeStyleRefactoring({data}: {data: any}) {

  const question: string = data.question;
  const part: string = data.part;
  let codeData: string = data.code;
  const language: string = data.language;
  const parameters: any = data.parameters;
  const format: string[] = Object.values(parameters).map((key: any) => key.name);
  const inputs: any[] = data.inputs;
  const points: number[] = data.points;
  const source = data.source;
  let verified: boolean = data.verified;
  
  let results: any[] = Array(inputs.length).fill('').map(x => useState({
    actual: '',
    passed: '',
    error: ''
  }));
  let status: string = "Not Attempted";

  const [code, setCode] = useState(codeData);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ranOnce, setRanOnce] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [accPoints, setAccPoints] = useState(0);
  
  let totalPoints = 0;
  for (let i = 0; i < inputs.length; i++) {
    totalPoints += points[i];
  }
  const [showTestCases, setShowTestCases] = useState(false);

  const runCode = async () => {
    setRanOnce(true);
    return await submitFreestyle(data, code, results, setIsLoading, setSubmitted, setAccPoints, setError, false);
  };

  const submitForVoting = async () => {
    if (submitted) {
      toast.info("You have already submitted for voting.", {autoClose: 3000});
      return;
    }
    if (!ranOnce) {
      toast.error("Please run the code first at least once before submitting.", {autoClose: 3000});
      return;
    }
    if (!results.every((result) => result[0].passed)) {
      toast.error("Please run the code again with all test cases passed before submitting.", {autoClose: 3000});
      return;
    }

    const supabase = createClient();

    const res = await supabase
      .from("Votes")
      .insert({
        submitted_by: data.username,
        freestyle_id: data.partId,
        code: code,
        rankings: {}
      })
    
    if (res.error) { 
      console.error(res.error); 
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    } else {
      setSubmitted(true);
      toast.success("Submitted for voting successfully!", {autoClose: 3000});
    }
  }
  
  return (
    <div className={!source ? "w-full max-w-5xl bg-slate-50 p-3 border-4" : ""}>
    {part !== "null"
    ? (
    <div className="flex flex-row p-2">
      <span className="pr-2 text-lg font-bold">{`(${part})`}</span>
      <p className="text-lg font-medium">{question}</p>
    </div>)
    : (
    <div className="text-lg text-gray-500 min-h-10">{question}</div>
    )}
    <div className='w-full'>
      <CodeEditor language={language} code={code} setCode={setCode} />
    </div>
    { source
      ? source.link
      ? <div className="text-lg font-medium leading-10">
      <p>source: 
      <a 
      href={source.src}
      target="_blank"
      rel="noopener noreferrer"
      className="px-2 cursor-pointer hover:text-blue-500 hover:underline"
      >{source.src}</a>
      </p>
      </div>
      : <div className="text-lg font-medium leading-10">source: {source.src}</div>
      : <></>
    }

    <div>
      <button
        className="flex flex-row gap-1 px-4 py-2 font-medium"
        onClick={() => setShowTestCases(!showTestCases)}
      >
        <img src={dropdownBtn.src} alt="button" className="w-4 h-4 pt-1" />
        <h2>Show Testcases</h2>
      </button>
    </div>

    {showTestCases &&
      <div>
        {/* headers */}
        <div 
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${format.length+3}, 1fr)`,
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
          style={{border: "2px solid black", borderRight: "none"}}
          >expected
          </div>
          <div 
          className="flex flex-row justify-center text-lg font-bold"
          style={{border: "2px solid black", borderRight: "none"}}
          >{status === "Completed" ? "score" : "actual"}
          </div>
          <div 
          className="flex flex-row justify-center text-lg font-bold"
          style={{border: "2px solid black", borderRight: "2px solid black"}}
          >stdout
          </div>
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
              gridTemplateColumns: `repeat(${format.length+3}, 1fr)`
            }}
            >
            {Object.values(input).slice(0, format.length).map((value: any, idx2: number) => {
              return <div key={idx2} 
              className="flex flex-row justify-center text-lg font-medium" 
              style={{
                border: "2px solid black",
                borderRight: idx2 === format.length ? "2px solid black" : "none",
                borderBottom: idx === inputs.length-1 ? "2px solid black" : "none",
                borderTop: idx === 0 ? "none" : "2px solid black"
              }}>
                <p>{value.toString().trim('""').split(",").join(", ")}</p>
              </div>
            })}
            <div 
            key={idx}
            style={{
              border: "2px solid black", 
              borderBottom: idx === inputs.length ? "none" : "2px solid black", 
              borderRight: idx === inputs.length ? "2px solid black" : "none",
              borderTop: "none"}}
            >
              <div
              className="w-full h-full overflow-x-auto text-lg font-medium text-center"
              >
                {typeof input.expected === "object" ? JSON.stringify(input.expected).split(",").join(", ") : input.expected}
              </div>
            </div>
            <div 
            style={{
              border: "2px solid black", 
              borderBottom: idx === inputs.length ? "none" : "2px solid black", 
              borderRight: idx === inputs.length ? "2px solid black" : "none",
              borderTop: "none"}}
            >
              <div
              className={`w-full h-full text-lg text-center font-medium ${results[idx][0].error ? "text-red-600" : ""}`}
              >
                {typeof results[idx][0].actual === "object" 
                ? JSON.stringify(results[idx][0].actual).split(",").join(", ")
                : results[idx][0].actual
                ? results[idx][0].actual
                : results[idx][0].error
                }
              </div>
            </div>
            <div 
            style={{
              border: "2px solid black", 
              borderBottom: idx === inputs.length ? "none" : "2px solid black", 
              borderTop: "none"
            }}
            >
              <div
              className="w-full h-full overflow-x-auto text-lg font-medium text-center"
              >
                {results[idx][0].output?.trim('""').split(",").join(", ")}
              </div>
            </div>
          </div>
        )})}
        </div>
      </div>
    }    

    <div className="max-w-full mt-2 ml-2 text-red-600 break-words whitespace-pre-wrap">
      {error}
    </div>
     
    <div className={`flex flex-row ${verified ? `justify-between`: "justify-end"} p-2 pl-4 mb-0`}>
      <button 
      className="p-2 text-lg font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700" 
      onClick={runCode}>
      { isLoading 
        ? <span className="w-10 loading loading-spinner"></span>
        : <div className='flex justify-center'>Run</div>
      }
      </button>
      {verified &&
      <form>
      <SubmitButton
      type="submit"
      formAction={submitForVoting}
      className="flex items-center justify-center h-10 p-2 text-lg font-medium text-white bg-green-500 rounded-md hover:bg-green-700"
      pendingText='Submitting...'
      >
        Submit for voting
      </SubmitButton>
      </form>}
    </div>            
  </div>
  );
}