"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SubmitButton } from '@/components/buttons/SubmitButton';
import submitMCQ from '@/app/utils/Submissions/submitMCQ';
import saveMCQ from '@/app/utils/Saving/saveMCQ';
import placeInCodeBox from '@/components/codeBoxes/CodeBox';

export default function MCQ(params: any) {
  
  const data = params.data;

  let [codeColorTheme, setCodeColorTheme] = useState("github");
  let [changed, setChanged] = useState(false);
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
      setCodeColorTheme(codeColorTheme);
    }
    getColorTheme();
    setChanged(true);
  }, [changed]);

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
    <div className={!source ? "lg:w-full lg:max-w-5xl bg-slate-50 p-3 border-4" : ""}>
    {part !== "null"
    ? (
    <div className="flex flex-row p-2">
      <span className="pr-2 text-base font-bold lg:text-lg">{`(${part})`}</span>
      <p className="text-base font-medium lg:text-lg">{question}</p>
    </div>)
    : (
    <div className="text-base font-medium lg:text-lg">{question}</div>
    )}
    <div>
    <form>
    {options.map((option, index) => (
      <div key={index} className="flex flex-row p-2 pl-4 max-w-fit">
      <input
      type="radio"
      name="options"
      value={option}
      checked={selectedOption === index+1}
      onChange={(event) => handleOptionChange(event, index+1)}
      >
      </input>
      {!option.language 
      ? <p className="pl-1 text-base font-medium lg:pl-2 lg:text-lg">{option.value}</p> 
      : placeInCodeBox(option.value, option.language, codeColorTheme)}
      </div>
    ))}
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
    <div className={`flex flex-row ${verified ? `justify-between`: "justify-end"} p-2 ${!source ? "m-2" : ""} mb-0`}>
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
      !submitted || !selectedOption
      ? `[${points} points]` 
      : selectedOption === expected && submitted
      ? `${points} / ${points} ✅`
      : `0 / ${points} ❌`
      }</span> 
     : <span className="pt-2 pr-5 text-base font-medium lg:text-lg">{
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
