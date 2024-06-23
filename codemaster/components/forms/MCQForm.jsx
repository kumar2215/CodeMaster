"use client";
import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';

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
        <button 
        className='bg-white border-black w-6 h-6 my-2' style={{borderWidth: "1px"}}
        onClick={() => removePart(parentIndex)}
        >
        - 
        </button>
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
            <button 
              className='bg-white border-black w-6 h-6 my-1' style={{borderWidth: "1px"}}
              onClick={() => remove(index)}
            >
                - 
            </button>
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
                        language={language}  // Assuming the language is static, adjust if dynamic
                        code={field.value}
                        setCode={field.onChange} 
                    />
                  }}
                />
              )}
            </div>

          </div>
        ))}
        
        <div className='w-full flex flex-row gap-x-3 mt-2 justify-evenly'>
          <button className="btn btn-info" type="button" onClick={() => addOption('text')}>
            Add Text Option
          </button>
          <button className="btn btn-info" type="button" onClick={() => addOption('code')}>
            Add Code Option
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