"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import submitFreestyle from '@/app/utils/Submissions/submitFreestyle';
import saveFreestyle from '@/app/utils/Saving/saveFreestyle';
import dropdownBtn from "@/assets/dropdown-btn.jpg"

const CodeEditor = dynamic(() => import('@/components/codeBoxes/CodeEditor'), { ssr: false });

export default function FreeStyle ({data}: {data: any}) {

  const question: string = data.question;
  const part: string = data.part;
  let codeData: string = data.code;
  const language: string = data.language;
  const parameters: any = data.parameters;
  const format: string[] = Object.values(parameters).map((key: any) => key.name);
  const inputs: any[] = data.inputs;
  const points: number[] = data.points;
  const source = data.source;
  const partOfCompetition: any = data.partOfCompetition; 
  let verified: boolean = data.verified;
  
  let results: any[] = Array(inputs.length).fill('').map(x => useState({
    actual: '',
    passed: '',
    error: ''
  }));
  let status: string = "Not Attempted";

  if (partOfCompetition) {
    status = partOfCompetition.status;
    if (status === "Attempted" && partOfCompetition.data[part]) {
      codeData = partOfCompetition.data[part].savedCode;      
    } else if (status === "Completed") {
      codeData = partOfCompetition.data[part].answered;
      results = Array(inputs.length).fill('').map((x: any, i: number) => {
        let value = partOfCompetition.data[part].status[i];
        value = value === "Correct" ? `${points[i]}/${points[i]} ✅` : `0/${points[i]} ❌`;
        return useState({
          actual: value,
          expected: value,
          error: ''
        });
      });
    }
    verified = partOfCompetition.verified
  } 

  const [code, setCode] = useState(codeData);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [accPoints, setAccPoints] = useState(0);
  
  let totalPoints = 0;
  for (let i = 0; i < inputs.length; i++) {
    totalPoints += points[i];
  }
  const [showTestCases, setShowTestCases] = useState(false);

  const runCodeAndSumbit = async () => {
    return await submitFreestyle(data, code, results, setIsLoading, setSubmitted, setAccPoints, setError);
  };

  const handleSave = async () => {
    await saveFreestyle(data, code);
  };
  
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
      {status !== "Completed" && verified &&
      <button 
      className="p-2 text-lg font-medium text-white bg-blue-500 rounded-lg" 
      onClick={partOfCompetition ? handleSave : runCodeAndSumbit}>
      { isLoading 
        ? <span className="w-10 loading loading-spinner"></span>
        : <div className='flex justify-center'>{partOfCompetition ? "Save" : "Submit"}</div>
      }
      </button>
      }
      {status !== "Completed"
       ? <span className="pt-2 pr-5 text-lg font-medium">{
        !submitted || isLoading
        ? `[${points.reduce((a: number, b: number) => a + b, 0)} points]`
        :  accPoints === totalPoints && submitted && !isLoading
        ? `${totalPoints} / ${totalPoints} ✅` 
        : `${accPoints} / ${totalPoints} ❌`
        }</span>
       : <span className="pt-2 pr-5 text-lg font-medium">{
        partOfCompetition.data[part].pointsAccumulated === totalPoints
        ? `${totalPoints} / ${totalPoints} ✅`
        : `${partOfCompetition.data[part].pointsAccumulated} / ${totalPoints} ❌`
        }</span>
      }
    </div>            
  </div>
  );
}