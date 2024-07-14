"use client";
import React from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import AddButtonImage from '@/components/images/add_button';
import RemoveButton from '@/components/buttons/RemoveButton';

const MultipleResponseForm = ({ part, control, register, parentIndex, removePart, watch, qnNum}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${qnNum-1}.parts.${parentIndex}.inputs`
  });

  const format = watch(`questions.${qnNum-1}.parts.${parentIndex}.format`, '');
  
  return (
    <div className='w-full flex flex-col gap-y-4'>
      
      <div className='flex flex-row gap-2'>
        <RemoveButton remove={() => removePart(parentIndex)} style={{marginTop: "5px"}}/>
        <h2 className='text-xl text-blue-600 pt-2'>{`(${part})`}</h2>
        <p className='text-xl pt-2'>Multiple-Responses</p>
      </div>

      {/* Description for Multiple-Response */}
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

      {/* Question field */}
      <div>
        <h2>Question:</h2>
        <textarea 
          className='w-full h-8 mt-2 pl-2 pt-1' {...register(`questions.${qnNum-1}.parts.${parentIndex}.question`)} />
      </div>
      
      {/* Format field */}
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

      {/* Input fields */}
      <h2>Inputs:</h2>
      {format.length > 0
      ? fields.map((item, index) => (
        <div key={item.id} >
          <div className='flex flex-row gap-2'>
            {/* Button to remove input */}
            <RemoveButton remove={() => remove(index)} style={{marginTop: "5px"}}/>
            <h2 className='pt-1'>Input {index+1}</h2>
          </div>

          {/* Input fields */}
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
      
      {/* Button to add input */}
      <button type="button" className="w-2/5 flex flex-row justify-between gap-2 mt-2" onClick={() => {
        const obj = {};
        format.split(',').forEach((f, i) => {
          if (f.trim() !== '') obj[f.trim()] = '';
        });
        append(obj);
      }}>
        <AddButtonImage />
        <h1 className="w-full bg-green-400 hover:bg-green-700 text-lg text-white font-medium rounded-lg pt-1">Add Input</h1>
        <h1></h1>
      </button>

    </div>
  );
  
};

export default MultipleResponseForm;
