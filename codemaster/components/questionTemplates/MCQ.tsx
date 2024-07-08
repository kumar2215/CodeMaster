"use client";
import { useState } from 'react';
import { SubmitButton } from '@/components/buttons/submit-button';
import submitMCQ from '@/app/utils/Submissions/submitMCQ';
import saveMCQ from '@/app/utils/Saving/saveMCQ';
import placeInCodeBox from '@/components/codeBoxes/CodeBox';

export default function MCQ(params: any) {
  
  const data = params.data;

  const question: string = data.question;
  const part: string = data.part;
  const options: any[] = data.options;
  const points: number = data.points;
  const expected: number = data.expected;
  const source = data.source;
  const partOfCompetition: any = data.partOfCompetition;

  let initialSelectedOption: number = 0;
  let status: string = "Not Attempted";
  if (partOfCompetition) {
    status = partOfCompetition.status;
    if (status === "Attempted" && partOfCompetition.data[part]) {
      initialSelectedOption = partOfCompetition.data[part].selectedOption;
    } else if (status === "Completed") {
      initialSelectedOption = partOfCompetition.data[part].answered;
    }
  }

  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionChange = (event: any, index: number) => {
    if (submitted) { return; }
    setSelectedOption(index);
  };

  const handleSubmit = async () => {
    await submitMCQ(data, selectedOption, setSubmitted);
  }
  
  const handleSave = async () => {
    await saveMCQ(data, selectedOption);
  }
  
  return (
    <div className={!source ? "w-full max-w-5xl bg-slate-50 p-3 border-4" : ""}>
    {part !== "null"
    ? (
    <div className="flex flex-row p-2">
      <span className="lg:text-lg text-sm font-bold pr-2">{`(${part})`}</span>
      <p className="lg:text-lg text-sm font-medium">{question}</p>
    </div>)
    : (
    <div className="lg:text-lg text-sm font-medium">{question}</div>
    )}
    <div>
    <form>
    {options.map((option, index) => (
      <div key={index} className="flex flex-row p-2 pl-4 w-full overflow-auto">
      <label className="inline-flex items-center">
      <input
      type="radio"
      name="options"
      value={option}
      checked={selectedOption === index+1}
      onChange={(event) => handleOptionChange(event, index+1)}
      >
      </input>
      <span className="lg:text-lg text-sm font-medium pl-2 w-full">{
        !option.language ? option.value : placeInCodeBox(option.value, option.language)
      }</span>
      </label>
      </div>
    ))}
    { source
      ? source.link
      ? <div className="lg:text-lg text-xs font-medium leading-10">
      <a 
      href={source.src}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-blue-500 hover:underline cursor-pointer px-2"
      >source: {source.src}</a>
      </div>
      : <div className="lg:text-lg text-sm font-medium leading-10">source: {source.src}</div>
      : <></>
    }
    <div className={` flex flex-row justify-between p-2 ${!source ? "m-2" : ""} mb-0`}>
    {status !== "Completed" &&
    <SubmitButton
    formAction={partOfCompetition ? handleSave : handleSubmit}
    className="lg:text-lg text-sm font-medium bg-blue-500 text-white p-2 rounded-lg"
    pendingText={partOfCompetition ? "Saving..." : "Submitting..."}
    >
    {partOfCompetition ? "Save" : "Submit"}
    </SubmitButton>
    }
    {status !== "Completed"
     ? <span className="lg:text-lg text-sm font-medium pr-5 pt-2">{
      !submitted || !selectedOption
      ? `[${points} points]` 
      : selectedOption === expected && submitted
      ? `${points} / ${points} ✅`
      : `0 / ${points} ❌`
      }</span> 
     : <span className="lg:text-lg text-sm font-medium pr-5 pt-2">{
      partOfCompetition.data[part].pointsAccumulated === points
      ? `${points} / ${points} ✅`
      : `${partOfCompetition.data[part].pointsAccumulated} / ${points} ❌`
      }</span>
    }
    </div>
    </form>
    </div>
    </div>
  );
};
