"use client";
import { useState } from 'react';
import { SubmitButton } from '@/components/buttons/submit-button';
import submitMRQ from '@/app/utils/Submissions/submitMRQ';
import saveMRQ from '@/app/utils/Saving/saveMRQ';
import placeInCodeBox from '@/components/codeBoxes/CodeBox';

export default function MRQ(params: any) {
  
  const data = params.data;
  
  const question: string = data.question;
  const part: string = data.part;
  const options: any[] = data.options;
  const points: number = data.points;
  const source = data.source;
  const partOfCompetition: any = data.partOfCompetition;

  let selectedOptions : any[];

  if (partOfCompetition && data.selectedOptions !== undefined) {
    selectedOptions = data.selectedOptions.map((optionSelected: boolean) => useState(optionSelected));
  } else {
    selectedOptions = options.map(() => useState(false));
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
      <span className="text-lg font-bold pr-2">{`(${part})`}</span>
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
      <span className="text-lg font-medium pl-2">{
        !option.language ? option.value : placeInCodeBox(option.value, option.language)
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
      className="hover:text-blue-500 hover:underline cursor-pointer px-2"
      >{source.src}</a>
      </p>
      </div>
      : <div className="text-lg font-medium leading-10">source: {source.src}</div>
      : <></>
    }
    <div className={`flex flex-row justify-between p-2 ${!source ? "m-2" : ""} mb-0`}>
    <SubmitButton
    formAction={partOfCompetition ? handleSave : handleSubmit}
    className="text-lg font-medium bg-blue-500 text-white p-2 rounded-lg"
    pendingText={partOfCompetition ? "Saving..." : "Submitting..."}
    >
    {partOfCompetition ? "Save" : "Submit"}
    </SubmitButton>
    <span className="text-lg font-medium pr-5 pt-2">{
      !submitted || !numOptionsSelected
      ? `[${points} points]` 
      : additionalPoints === points && submitted
      ? `${points} / ${points} ✅`
      : `${additionalPoints} / ${points} ❌`
    }</span> 
    </div>
    </form>
    </div>
    </div>
  );
};
