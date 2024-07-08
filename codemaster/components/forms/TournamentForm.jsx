"use client";
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import QuestionForm from './QuestionForm';
import submitTournamentForm from '@/app/utils/Submissions/submitTournamentForm';

export default function TournamentForm() {

  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: {
      name: '',
      questions: [],
      points: 0,
      deadline: null // Initialize deadline field
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });

  return (
    <div className="w-11/12 max-w-5xl flex flex-col justify-center items-center">
      <form className='w-full' onSubmit={handleSubmit(submitTournamentForm)}>
        <div className='w-full flex flex-col bg-gray-200 rounded-lg p-5 gap-5 overflow-x-auto'>
          {/* Tournament name field */}
          <div className='flex flex-row gap-4 '>
            <p className='text-xl pt-1'>Tournament name:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <input className='input-info h-8 pl-2' {...register('name')} />
            </label>
          </div>

          {/* Deadline field */}
          <div className='flex flex-row gap-4 h-10'>
            <p className='text-xl pt-2'>Deadline:</p>
            <label className="items-center gap-2">
              <input
                className='p-2'
                style={{borderWidth: "1.5px"}}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                {...register('deadline')}
              />
            </label>
          </div>
        </div>

        <br/>

        {/* Question fields */}
        {fields.length > 0 &&
          fields.map((field, index) => (
            <>
            <br/>
            <div key={field.id} className='bg-gray-200 rounded-lg flex flex-col p-5  overflow-x-auto'>
              <QuestionForm
                key={field.id}
                control={control}
                register={register}
                remove={remove}
                watch={watch}
                index={index}
                single={false}
              />
            </div>
            </>
          ))
        }

        <div className='w-full flex flex-row gap-3 p-5 '>
          {/* Button to add Questions*/}
          <button className="btn btn-info bg-blue-600" type="button" onClick={() => append(
            {
              type: '',
              title: '',
              language: '',
              difficulty: '',
              source: {}
            }
          )}>
            Add Question
          </button>

          {/* Button to submit Tournament */}
          <button className='btn btn-success' type="submit" disabled={!fields.length}>Submit Tournament</button>
        </div>
      </form>
    </div>
  );
};
