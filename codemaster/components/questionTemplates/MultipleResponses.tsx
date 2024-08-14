"use client";
import { useState } from 'react';
import SubmitButton from '@/components/buttons/SubmitButton';
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
  let verified: boolean = data.verified;

  let inputStates: any[] = inputs.map(() => useState(""));
  let status: string = "Not Attempted";

  if (partOfCompetition) {
    status = partOfCompetition.status;
    if (status === "Attempted" && partOfCompetition.data[part]) {
      inputStates = partOfCompetition.data[part].savedInputs.map((savedInput: any) => useState(savedInput));
    } else if (status === "Completed") {
      inputStates = partOfCompetition.data[part].answered.map((savedInput: any, i: number) => {
        let value = partOfCompetition.data[part].status[i] === "Correct"
          ? `${points[i]}/${points[i]} ✅`
          : `0/${points[i]} ❌`;
        return useState(value);
      });
    }
    verified = partOfCompetition.verified;
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
      <span className="pr-2 text-base font-bold lg:text-lg">{`(${part})`}</span>
      <p className="text-base font-medium lg:text-lg">{question}</p>
    </div>)
    : (
    <div className="text-base text-gray-500 lg:text-lg min-h-10">{question}</div>
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
      className="flex flex-row justify-center overflow-x-auto text-base font-bold lg:text-lg"
      style={{
        border: "2px solid black", 
        borderRight: index === format.length ? "2px solid black" : "none", 
      }}
      >
      {header}
      </div>
    ))}
    <div 
    className="flex flex-row justify-center overflow-x-auto text-base font-bold lg:text-lg"
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
          className="flex flex-row justify-center overflow-x-auto text-base font-medium lg:text-lg" 
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
          className="w-full h-full overflow-x-auto text-base font-medium text-center bg-gray-200 lg:text-lg"
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
      ? <div className="text-base font-medium leading-10 lg:text-lg">
      <p>source: 
      <a 
      href={source.src}
      target="_blank"
      rel="noopener noreferrer"
      className="px-2 cursor-pointer hover:text-blue-500 hover:underline"
      >{source.src}</a>
      </p>
      </div>
      : <div className="text-base font-medium leading-10 lg:text-lg">source: {source.src}</div>
      : <></>
      }
      <div className={`flex flex-row ${verified ? `justify-between`: "justify-end"} p-2 pl-4 m-2 mb-0`}>
      {status !== "Completed" && verified &&
      <SubmitButton
      formAction={partOfCompetition ? handleSave : handleSubmit}
      className="p-2 text-base font-medium text-white bg-blue-500 rounded-lg lg:text-lg"
      pendingText={partOfCompetition ? "Saving..." : "Submitting..."}
      >
      {partOfCompetition ? "Save" : "Submit"}
      </SubmitButton>
      }
      {status !== "Completed" 
       ? <span className="pt-2 pr-5 text-base font-medium lg:text-lg">{
        !submitted || !inputStates.every((inputState: any) => inputState[0] !== "")
        ? `[${totalPoints} points]` 
        : additionalPoints === totalPoints && submitted
        ? `${totalPoints} / ${totalPoints} ✅`
        : `${additionalPoints} / ${totalPoints}❌`
        }</span>
       : <span className="pt-2 pr-5 text-base font-medium lg:text-lg">{
        partOfCompetition.data[part].pointsAccumulated === totalPoints
        ? `${totalPoints} / ${totalPoints} ✅`
        : `${partOfCompetition.data[part].pointsAccumulated} / ${totalPoints} ❌`
        }</span>
      }
      
      </div>
      </form>
      </div>
    );    
}
