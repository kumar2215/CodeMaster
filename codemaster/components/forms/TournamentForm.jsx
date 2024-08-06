"use client";
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import QuestionForm from './QuestionForm';
import submitTournamentForm from '@/app/utils/Submissions/submitTournamentForm';
import SubmitButton from '@/components/buttons/SubmitButton';

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
    <form className="w-full p-2 lg:p-0 lg:max-w-5xl">
      <div className='flex flex-col w-full gap-5 p-2 bg-gray-200 rounded-lg lg:p-5 lg:ml-6'>
        {/* Tournament name field */}
        <div className='flex flex-row gap-2 lg:gap-4'>
          <p className='pt-1 text-lg lg:text-xl text-nowrap'>Tournament name:</p>
          <label className="mt-[6px] leading-5 lg:mt-0 h-fit" style={{borderWidth: "1.5px"}}>
            <input className='w-full pl-1 lg:pl-2 lg:h-8 input-info' {...register('name')} />
          </label>
        </div>

        {/* Deadline field */}
        <div className='flex flex-row gap-4 h-fit lg:h-10'>
          <p className='pt-2 text-lg lg:text-xl'>Deadline:</p>
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
          <div key={field.id} className='flex flex-col p-3 bg-gray-200 rounded-lg lg:p-5 lg:ml-6'>
            <QuestionForm
              key={field.id}
              control={control}
              register={register}
              remove={remove}
              watch={watch}
              index={index}
              single={false}
              partOfCompetition={true}
            />
          </div>
          </>
        ))
      }

      <div className='flex flex-row justify-between w-full mt-4 lg:mt-0 lg:gap-3 lg:p-5 lg:ml-6 lg:justify-normal'>
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
