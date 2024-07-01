"use client";
import { useState } from 'react';
import { SubmitButton } from '@/components/buttons/submit-button';
import submitMultipleResponses from '@/app/utils/Submissions/submitMultipleResponses';
import saveMultipleResponses from '@/app/utils/Saving/saveMultipleResponses';

export default function MultipleResponses(params: any) {

  const data = params.data;

  const question: string = data.question;
  const part: string = data.part;
  const format: string[] = data.format;
  const inputs: any[] = data.inputs;
  const points: number[] = data.points;
  const source = data.source;
  const partOfCompetition: any = data.partOfCompetition;

  let inputStates: any[];

  if (partOfCompetition && data.savedInputs !== undefined) {
    inputStates = data.savedInputs.map((savedInput: any) => useState(savedInput));
  } else {
    inputStates = inputs.map(() => useState(""));
  }

  const [submitted, setSubmitted] = useState(false);
  const [additionalPoints, setAdditionalPoints] = useState(0);
  const totalPoints: number = points.reduce((a: number, b: number) => a + b, 0);

  const handleInputChange = (event: any, index: number) => {
    if (submitted) { return; }
    inputStates[index][1](event.target.value);
  }
  
  const handleSubmit = async () => {
    await submitMultipleResponses(data, inputStates, setSubmitted, setAdditionalPoints);
  }

  const handleSave = async () => {
    await saveMultipleResponses(data, inputStates.map((inputState: any) => inputState[0]));
  }
  
  return (
    <div className={!source ? "w-full max-w-5xl bg-slate-50 p-3 border-4" : ""}>
    <form>
    {part !== "null"
    ? (
    <div className="flex flex-row p-2">
      <span className="text-lg font-bold pr-2">{`(${part})`}</span>
      <p className="text-lg font-medium">{question}</p>
    </div>)
    : (
    <div className="text-lg text-gray-500 min-h-10">{question}</div>
    )}
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
      <div className="flex flex-row justify-between p-2 pl-4 m-2 mb-0">
      <SubmitButton
        formAction={partOfCompetition ? handleSave : handleSubmit}
        className="text-lg font-medium bg-blue-500 text-white p-2 rounded-lg"
        pendingText={partOfCompetition ? "Saving..." : "Submitting..."}
        >
        {partOfCompetition ? "Save" : "Submit"}
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
