"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SubmitButton } from '@/components/buttons/SubmitButton';
import submitMCQ from '@/app/utils/Submissions/submitMCQ';
import saveMCQ from '@/app/utils/Saving/saveMCQ';
import placeInCodeBox from '@/components/codeBoxes/CodeBox';

export default function MCQ(params: any) {
  
  const data = params.data;

  let codeColorTheme: string = "github";
  useEffect(() => {
    async function getColorTheme() {
      const supabase = createClient();
      const res = await supabase
        .from("Users")
        .select("preferences")
        .eq("username", data.username)
        .single();
      if (res.error) { console.error(res.error); }
      codeColorTheme = res.data && res.data.preferences.codeColorTheme;
    }
    getColorTheme();
  }, []);

  const question: string = data.question;
  const part: string = data.part;
  const options: any[] = data.options;
  const points: number = data.points;
  const expected: number = data.expected;
  const source = data.source;
  const partOfCompetition: any = data.partOfCompetition;
  let verified: boolean = data.verified;

  let initialSelectedOption: number = 0;
  let status: string = "Not Attempted";
  if (partOfCompetition) {
    status = partOfCompetition.status;
    if (status === "Attempted" && partOfCompetition.data[part]) {
      initialSelectedOption = partOfCompetition.data[part].selectedOption;
    } else if (status === "Completed") {
      initialSelectedOption = partOfCompetition.data[part].answered;
    }
    verified = partOfCompetition.verified;
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
      <span className="pr-2 text-lg font-bold">{`(${part})`}</span>
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
      type="radio"
      name="options"
      value={option}
      checked={selectedOption === index+1}
      onChange={(event) => handleOptionChange(event, index+1)}
      >
      </input>
      <span className="pl-2 text-lg font-medium">{
        !option.language ? option.value : placeInCodeBox(option.value, option.language, codeColorTheme)
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
      className="px-2 cursor-pointer hover:text-blue-500 hover:underline"
      >{source.src}</a>
      </p>
      </div>
      : <div className="text-lg font-medium leading-10">source: {source.src}</div>
      : <></>
    }
    <div className={`flex flex-row ${verified ? `justify-between`: "justify-end"} p-2 ${!source ? "m-2" : ""} mb-0`}>
    {status !== "Completed" && verified &&
    <SubmitButton
    formAction={partOfCompetition ? handleSave : handleSubmit}
    className="p-2 text-lg font-medium text-white bg-blue-500 rounded-lg"
    pendingText={partOfCompetition ? "Saving..." : "Submitting..."}
    >
    {partOfCompetition ? "Save" : "Submit"}
    </SubmitButton>
    }
    {status !== "Completed"
     ? <span className="pt-2 pr-5 text-lg font-medium">{
      !submitted || !selectedOption
      ? `[${points} points]` 
      : selectedOption === expected && submitted
      ? `${points} / ${points} ✅`
      : `0 / ${points} ❌`
      }</span> 
     : <span className="pt-2 pr-5 text-lg font-medium">{
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
