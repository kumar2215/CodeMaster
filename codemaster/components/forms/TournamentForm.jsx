"use client";
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import QuestionForm from './QuestionForm';
import submitTournamentForm from '@/app/utils/Submissions/submitTournamentForm';
import { SubmitButton } from '@/components/buttons/SubmitButton';

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
    <form className="w-full max-w-5xl">
      <div className='flex flex-col w-full gap-5 p-5 ml-6 bg-gray-200 rounded-lg'>
        {/* Tournament name field */}
        <div className='flex flex-row gap-4'>
          <p className='pt-1 text-xl'>Tournament name:</p>
          <label className="leading-5" style={{borderWidth: "1.5px"}}>
            <input className='h-8 pl-2 input-info' {...register('name')} />
          </label>
        </div>

        {/* Deadline field */}
        <div className='flex flex-row h-10 gap-4'>
          <p className='pt-2 text-xl'>Deadline:</p>
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
          <div key={field.id} className='flex flex-col p-5 ml-6 bg-gray-200 rounded-lg'>
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

      <div className='flex flex-row w-full gap-3 p-5 ml-6'>
        {/* Button to add Questions*/}
        <button className="bg-blue-500 btn btn-info" type="button" onClick={() => append(
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
        <SubmitButton
          formAction={handleSubmit(submitTournamentForm)}
          className='bg-green-500 btn btn-success'
          disabled={!fields.length}
          pendingText='Submitting...'
        >
        Submit Tournament
        </SubmitButton>
      </div>
    </form>
  );
};
