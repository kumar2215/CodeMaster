"use client";
import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import dynamic from 'next/dynamic';
import AddButtonImage from '@/components/images/add_button';
import RemoveButton from '@/components/buttons/RemoveButton';
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
    <div className='flex flex-col w-full gap-5'>

      <div className='flex flex-row gap-3'>
        {remove !== null && 
        <>
          <RemoveButton remove={() => remove(index)} />
          <h1 className='text-3xl text-left text-blue-600'>{`Question ${qnNum}`}</h1>
        </>
        }
      </div>

      <div>
        <div className='flex flex-col gap-4'>

          <div className='flex flex-row gap-2'>
            <p className='pt-1 text-lg'>Title:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
            <input className='h-8 pl-2 input-info' {...register(`questions.${index}.title`)} />
            </label>
          </div>
          
          <div className='flex flex-row gap-2'>
            <p className='pt-1 text-lg'>Question Type:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <select {...register(`questions.${index}.type`)}
                className='h-8 input-info'  
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
            <p className='pt-1 text-lg'>Difficulty:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <select {...register(`questions.${index}.difficulty`)}
                className='h-8 input-info'
              >
                <option value=""></option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
          </div>
          
          <div className='flex flex-row gap-2'>
            <p className='pt-1 text-lg'>Language:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <select {...register(`questions.${index}.language`)}
                className='h-8 input-info'
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
            <h1 className='text-lg'>Source:</h1>
            <p className='text-sm'>
              The source here refers to the who or what you want to give credit to for the question.
              It can be a link or just a brief description. If it is your own work, enter your name 
              or enter "Anonymous" if you do not want to be known.
            </p>
            <label className="leading-5 w-fit" style={{borderWidth: "1.5px"}}>
              <input className='h-8 pl-2 input-info' {...register(`questions.${index}.source.src`)} />
            </label> 
          </div>
        </div>
            
        <div className='flex flex-col gap-2 mt-5'>

          <h1 className='text-lg'>Question Content:</h1>
          <p className='mb-2 text-sm'>
            This is where description of the problem will go. 
            It should provide the context for all parts of the question.
          </p>

          {contents.map((item, idx) => (
            <div key={idx} className='flex flex-row gap-2 my-2'>
              <RemoveButton remove={() => removeContent(idx)} style={{marginBottom: "4px"}}/>
              <div className='w-full'>
                {item.category === "text" ? (
                  <textarea {...register(`questions.${index}.contents.${idx}.value`)} 
                  className='w-full h-8 pt-2 pl-2 leading-4 textarea-bordered'
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
          
          <div className='flex flex-row w-full mt-2 gap-x-3 justify-evenly'>
            <button type="button" className="flex flex-row justify-between w-2/5 gap-2 mt-2" onClick={() => addContent('text')}>
              <AddButtonImage />
              <h1 className="w-full pt-1 text-lg font-medium text-white bg-green-500 rounded-lg hover:bg-green-700">Add text block</h1>
              <h1></h1>
            </button>

            <button type="button" className="flex flex-row justify-between w-2/5 gap-2 mt-2" onClick={() => addContent('code')}>
              <AddButtonImage />
              <h1 className="w-full pt-1 text-lg font-medium text-white bg-green-500 rounded-lg hover:bg-green-700">Add code block</h1>
              <h1></h1>
            </button>
          </div>

        </div>

      </div>
      
      <div className='flex flex-col gap-4'>
        <p className='my-2 text-lg' >Question Parts:</p>

        <div className='flex flex-row justify-between gap-3'>

          <button type="button" className="flex flex-row justify-between gap-2 mt-2" onClick={() => appendPart({
            part: '',
            questionType: "Multiple-Responses", 
            question: '',
            format: '',
            inputs: [],
            points: []
          })}>
            <AddButtonImage style={{marginTop: "5px"}} />
            <h1 className="w-full p-2 text-lg font-medium text-white bg-green-500 rounded-lg hover:bg-green-700">Add Multiple Responses</h1>
          </button>
          
          <button type="button" className="flex flex-row justify-between gap-2 mt-2" onClick={() => appendPart({
            part: '',
            questionType: "MRQ", 
            question: '',
            options: [],
            expected: '',
            points: 0
          })}>
            <AddButtonImage style={{marginTop: "5px"}} />
            <h1 className="w-full p-2 text-lg font-medium text-white bg-green-500 rounded-lg hover:bg-green-700">Add MRQ</h1>
          </button>
          
          <button type="button" className="flex flex-row justify-between gap-2 mt-2" onClick={() => appendPart({
            part: '',
            questionType: "MCQ",
            question: '',
            options: [],
            expected: 0,
            points: 0
          })}>
            <AddButtonImage style={{marginTop: "5px"}} />
            <h1 className="w-full p-2 text-lg font-medium text-white bg-green-500 rounded-lg hover:bg-green-700">Add MCQ</h1>
          </button>
          
          <button type="button" className="flex flex-row justify-between gap-2 mt-2" onClick={() => appendPart({
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
          })}>
            <AddButtonImage style={{marginTop: "5px"}} />
            <h1 className="w-full p-2 text-lg font-medium text-white bg-green-500 rounded-lg hover:bg-green-700">Add Freestyle</h1>
          </button>

        </div>

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
      </div>
    </div>
  );
}

export default QuestionForm;
