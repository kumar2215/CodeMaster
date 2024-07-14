"use client";
import React from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';
import AddButtonImage from '@/components/images/add_button';
import RemoveButton from '@/components/buttons/RemoveButton';

const CodeEditor = dynamic(
  () => import('../codeBoxes/CodeEditor'),
  { ssr: false }  // This component will only be imported on the client-side
);

export default function MCQForm({ part, control, register, parentIndex, removePart, watch, qnNum, language}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${qnNum-1}.parts.${parentIndex}.options`
  });
  
  const addOption = (type) => {
    append({ category: type, value: "" });
  };
  
  return (
    <div className='w-full flex flex-col gap-y-4'>
      <div className='flex flex-row gap-2'>
        <RemoveButton remove={() => removePart(parentIndex)} style={{marginTop: "5px"}}/>
        <h2 className='text-xl text-blue-600 pt-2'>{`(${part})`}</h2>
        <p className='text-xl pt-2'>MCQ</p>
      </div>

      <div>
        <h2>Question:</h2>
        <textarea 
          className='w-full h-8 mt-2 pl-2 pt-1' {...register(`questions.${qnNum-1}.parts.${parentIndex}.question`)} />
      </div>
      
      <div className='flex flex-col'>
        <h2>Options:</h2>

        {fields.map((item, index) => (
          <div key={index} className='flex flex-row gap-2 my-2'>
            <RemoveButton remove={() => remove(index)} style={{marginBottom: "5px"}} />
            <div className='w-full'>
              {item.category === "text" ? (
                <textarea {...register(`questions.${qnNum-1}.parts.${parentIndex}.options.${index}.value`)} 
                className='w-full textarea-bordered h-8 leading-4 pl-2 pt-2'
                placeholder={`Enter text`} />
              ) : (
                <Controller
                  name={`questions.${qnNum-1}.parts.${parentIndex}.options.${index}.value`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => {
                    return <CodeEditor
                        language={language}
                        code={field.value}
                        setCode={field.onChange} 
                    />
                  }}
                />
              )}
            </div>

          </div>
        ))}
        
        <div className='w-full flex flex-row gap-3 mt-2 justify-evenly'>
          <button type="button" className="w-2/5 flex flex-row justify-between gap-2 mt-2" onClick={() => addOption('text')}>
            <AddButtonImage />
            <h1 className="w-full bg-green-400 hover:bg-green-700 text-lg text-white font-medium rounded-lg pt-1">Add Text Option</h1>
            <h1></h1>
          </button>

          <button type="button" className="w-2/5 flex flex-row justify-between gap-2 mt-2" onClick={() => addOption('code')}>
            <AddButtonImage />
            <h1 className="w-full bg-green-400 hover:bg-green-700 text-lg text-white font-medium rounded-lg pt-1">Add Code Option</h1>
            <h1></h1>
          </button>
        </div>
      </div>

      <div className='flex flex-row gap-2 mt-2'>
        <p>Right option:</p>
        <label className="leading-5" style={{borderWidth: "1.5px"}}>
          <input
          {...register(`questions.${qnNum-1}.parts.${parentIndex}.expected`)}
          type='number'
          className='input-info h-6 pl-2'
          />
        </label>
      </div>

      <div className='flex flex-row gap-2'>
        <p>Points:</p>
        <label className="leading-5" style={{borderWidth: "1.5px"}}>
          <input
          {...register(`questions.${qnNum-1}.parts.${parentIndex}.points`)}
          type='number'
          className='input-info h-6 pl-2'
          />
        </label>
      </div>
    
    </div>
    );
  };