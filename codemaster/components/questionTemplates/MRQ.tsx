"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SubmitButton } from '@/components/buttons/SubmitButton';
import submitMRQ from '@/app/utils/Submissions/submitMRQ';
import saveMRQ from '@/app/utils/Saving/saveMRQ';
import placeInCodeBox from '@/components/codeBoxes/CodeBox';

export default function MRQ(params: any) {
  
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
  const source = data.source;
  const partOfCompetition: any = data.partOfCompetition;
  let verified: boolean = data.verified

  let selectedOptions : any[] = options.map(() => useState(false));
  let status: string = "Not Attempted";

  if (partOfCompetition) {
    status = partOfCompetition.status;
    if (status === "Attempted" && partOfCompetition.data[part]) {
      selectedOptions = partOfCompetition.data[part].selectedOptions.map((optionSelected: boolean) => useState(optionSelected));
    } else if (status === "Completed") {
      selectedOptions = partOfCompetition.data[part].answered.map((optionSelected: boolean) => useState(optionSelected));
    }
    verified = partOfCompetition.verified;
  } 

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
    await submitMRQ(data, selectedOptions, numOptionsSelected, setSubmitted, setAdditionalPoints);
  }

  const handleSave = async () => {
    await saveMRQ(data, selectedOptions.map((option: any[]) => option[0]));
  }
  
  return (
    <div className={!source ? "w-full max-w-5xl bg-slate-50 p-3 border-4" : ""}>
    {part !== "null"
    ? (
    <div className="flex flex-row">
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
      type="checkbox"
      name="options"
      value={option}
      checked={selectedOptions[index][0]}
      onChange={(event) => handleOptionChange(event, index)}
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
      !submitted || !numOptionsSelected
      ? `[${points} points]` 
      : additionalPoints === points && submitted
      ? `${points} / ${points} ✅`
      : `${additionalPoints} / ${points} ❌`
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
