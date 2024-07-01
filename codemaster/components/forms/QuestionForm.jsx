"use client";
import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import dynamic from 'next/dynamic';
import MultipleResponseForm from './MultipleResponseForm';
import MRQForm from './MRQForm';
import MCQForm from './MCQForm';
import FreestyleForm from './FreestyleForm';

const CodeEditor = dynamic(
  () => import('../codeBoxes/CodeEditor'),
  { ssr: false }  
);

function QuestionForm({ control, register, remove, watch, index, single }) {
  
  const QUESTION_COMPONENTS = {
    "Multiple-Responses": MultipleResponseForm,
    "MCQ": MCQForm,
    "Freestyle": FreestyleForm,
    "MRQ": MRQForm 
  };
  
  const { fields: parts, append: appendPart, remove: removePart } = useFieldArray({
    control,
    name: `questions.${index}.parts`
  });

  const { fields: contents, append: appendContent, remove: removeContent } = useFieldArray({
    control,
    name: `questions.${index}.contents`
  })

  const addContent = (type) => {
    appendContent({ category: type, value: "" });
  };
  
  const language = watch(`questions.${index}.language`);
  const qnNum = !single ? index + 1 : '';
  
  return (
    <form className='w-full flex flex-col gap-5'>

      <div className='flex flex-row gap-3'>
        {remove !== null && <button 
          className='bg-white border-black w-6 h-6 my-1' style={{borderWidth: "1px"}}
          onClick={() => remove(index)}
        >
          - 
        </button>}
        <h1 className='text-3xl text-left text-blue-600'>{`Question ${qnNum}`}</h1>
      </div>

      <div>
        <div className='flex flex-col gap-4'>

          <div className='flex flex-row gap-2'>
            <p className='text-lg pt-1'>Title:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
            <input className='input-info h-8 pl-2' {...register(`questions.${index}.title`)} />
            </label>
          </div>
          
          <div className='flex flex-row gap-2'>
            <p className='text-lg pt-1'>Question Type:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <select {...register(`questions.${index}.type`)}
                className='input-info h-8'  
              >
                <option value=""></option>
                <option value="Debugging">Debugging</option>
                <option value="Code Understanding">Code Understanding</option>
                <option value="Code Principles">Code Principles</option>
                <option value="Refactoring">Refactoring</option>
              </select>
            </label>
          </div>
          
          <div className='flex flex-row gap-2'>
            <p className='text-lg pt-1'>Difficulty:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <select {...register(`questions.${index}.difficulty`)}
                className='input-info h-8'
              >
                <option value=""></option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
          </div>
          
          <div className='flex flex-row gap-2'>
            <p className='text-lg pt-1'>Language:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <select {...register(`questions.${index}.language`)}
                className='input-info h-8'
              >
                <option value=""></option>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
              </select>
            </label>
          </div>

          <div className='flex flex-col gap-2'>
            <p className='text-lg'>Source:</p>
            <p className='text-sm'>
              The source here refers to the who or what you want to give credit to for the question.
              It can be a link or just a brief description. If it is your own work, enter your name 
              or enter "Anonymous" if you do not want to be known.
            </p>
            <label className="w-fit leading-5" style={{borderWidth: "1.5px"}}>
              <input className='input-info h-8 pl-2' {...register(`questions.${index}.source.src`)} />
            </label>
          </div>
        </div>
            
        <div className='flex flex-col'>

          <p className='text-lg my-5' >Question Content:</p>

          {contents.map((item, idx) => (
            <div key={idx} className='flex flex-row gap-2 my-2'>
              <button 
                className='bg-white border-black w-6 h-6 my-1' style={{borderWidth: "1px"}}
                onClick={() => removeContent(idx)}
              >
                  - 
              </button>
              <div className='w-full'>
                {item.category === "text" ? (
                  <textarea {...register(`questions.${index}.contents.${idx}.value`)} 
                  className='w-full textarea-bordered h-8 leading-4 pl-2 pt-2'
                  placeholder={`Enter text`} />
                ) : (
                  <Controller
                    name={`questions.${index}.contents.${idx}.value`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => {
                      return <CodeEditor
                          language={language.toLowerCase()}  // Assuming the language is static, adjust if dynamic
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
            <button className="btn btn-info" type="button" onClick={() => addContent('text')}>
              Add text content
            </button>
            <button className="btn btn-info" type="button" onClick={() => addContent('code')}>
              Add code content
            </button>
          </div>

        </div>

      </div>
      
      <div className='flex flex-col gap-4'>
        <p className='text-lg my-3' >Question Parts:</p>

        {parts.map((field, idx) => {
          const QuestionComponent = QUESTION_COMPONENTS[field.questionType] || MCQForm; 
          const part = String.fromCharCode(idx + 65).toLowerCase();
          field.part = part;
          return (
            <div key={field.id} className='mb-2'>
            <QuestionComponent
            {...field}
            control={control}
            register={register}
            parentIndex={idx}
            removePart={removePart}
            watch={watch}
            qnNum={!single ? qnNum : 1}
            language={language.toLowerCase()}
            />
            </div>
          );
        })}

        <div className='flex flex-row gap-x-3 justify-between'>
          <button className="btn btn-info" type="button" onClick={() => appendPart({
            part: '',
            questionType: "Multiple-Responses", 
            question: '',
            format: '',
            inputs: [],
            points: []
            
          })}>Add Multiple Responses</button>
          
          <button className="btn btn-info" type="button" onClick={() => appendPart({
            part: '',
            questionType: "MRQ", 
            question: '',
            options: [],
            expected: '',
            points: 0
          })}>Add MRQ</button>
          
          <button className="btn btn-info" type="button" onClick={() => appendPart({
            part: '',
            questionType: "MCQ",
            question: '',
            options: [],
            expected: 0,
            points: 0
          })}>Add MCQ</button>
          
          <button className="btn btn-info" type="button" onClick={() => appendPart({
            part: '',
            questionType: "Freestyle",
            question: '',
            parameters: '',
            inputs: [],
            points: [],
            precode: '',
            code: '',
            postcode: '',
            functionName: ''
          })}>Add Freestyle</button>

        </div>
      </div>
    </form>
  );
}

export default QuestionForm;
