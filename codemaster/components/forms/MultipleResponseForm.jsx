"use client";
import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

const MultipleResponseForm = ({ part, control, register, parentIndex, removePart, watch, qnNum}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${qnNum-1}.parts.${parentIndex}.inputs`
  });

  const format = watch(`questions.${qnNum-1}.parts.${parentIndex}.format`, '');
  
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
        <p className='text-xl pt-2'>Multiple-Responses</p>
      </div>

      <div>
        The Multiple-Response part consists of multiple inputs that are used as arguments to the main function
        specified in the question's content. The format field is used to specify the name of the parameters used 
        in the function. The inputs are the values of the arguments themselves. Users are then asked to give what
        they think the expected output should be given each input.
        <br />
        <p className='pt-2'>
        Eg.
        <a 
          href="/questions/3690c210-43da-4bf1-9f0c-8da06ba548ad"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 hover:underline cursor-pointer pl-1"
        >part a of this question</a>
        </p>
      </div>

      <div>
        <h2>Question:</h2>
        <textarea 
          className='w-full h-8 mt-2 pl-2 pt-1' {...register(`questions.${qnNum-1}.parts.${parentIndex}.question`)} />
      </div>
      
      <Controller
      name={`questions.${qnNum-1}.parts.${parentIndex}.format`}
      control={control}
      render={({ field }) => (
        <div className='flex flex-col gap-2'>
          <h2>Format (enter as a comma-separated list) :</h2>
          <label className="leading-5" style={{borderWidth: "1.5px"}}>
            <input className='w-full h-8 pl-2' {...field} />
          </label>
        </div>
      )}
      />

      {format.length > 0
      ? fields.map((item, index) => (
        <div key={item.id} >
          <div className='flex flex-row gap-2'>
            <button 
              className='bg-white border-black w-6 h-6 my-1' style={{borderWidth: "1px"}}
              onClick={() => remove(index)}
            >
              - 
            </button>
            <h2 className='pt-1'>Input {index+1}</h2>
          </div>
          {format.split(',').map((f, i) => {
            return (
            f.trim() !== '' &&
            <div key={i} className='flex flex-row gap-2 my-2 ml-10'>
              <p>{f.trim()}:</p>
              <label className="leading-5" style={{borderWidth: "1.5px"}}>
                <input
                {...register(`questions.${qnNum-1}.parts.${parentIndex}.inputs.${index}.${f.trim()}`, 
                { required: "Input is required" }
                )}
                className='input-info h-6 pl-2'
                />
              </label>
            </div>
          )})}
          <div className='flex flex-row gap-2 my-2 ml-10'>
            <p>expected:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <input
              {...register(`questions.${qnNum-1}.parts.${parentIndex}.inputs.${index}.expected`, 
              { required: "Input is required" }
              )}
              className='input-info h-6 pl-2'
              />
            </label>
          </div>
          <div className='flex flex-row gap-2 my-2 ml-10'>
            <p>Points:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <input
              {...register(`questions.${qnNum-1}.parts.${parentIndex}.points.${index}`,
              { required: "Points are required",
                validate: value => value >= 0 || "Points cannot be negative"
              })}
              type='number'
              className='input-info h-6 pl-2'
              />
            </label>
          </div>
        </div>
      ))
      : fields.length > 0
      ? <p className='text-red-600'>Please enter a format first.</p>
      : null}
      
      <button className="btn btn-info mt-4 mr-2 mb-2" type="button" onClick={() => {
        const obj = {};
        format.split(',').forEach((f, i) => {
          if (f.trim() !== '') obj[f.trim()] = '';
        });
        append(obj);
      }}>
      Add Input
      </button>

    </div>
  );
  
};

export default MultipleResponseForm;
