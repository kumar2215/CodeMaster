"use client";
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import QuestionForm from './QuestionForm';
import submitContestForm from '@/app/utils/Submissions/submitContestForm';
import { SubmitButton } from '@/components/buttons/submit-button';

export default function ContestForm() {

  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: {
      name: '',
      questions: [],
      points: 0,
      deadline: null
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });

  return (
<<<<<<< HEAD
    <div className="w-11/12 max-w-5xl flex flex-col justify-center items-center">
      <form className='w-full' onSubmit={handleSubmit(submitContestForm)}>
      <div className='w-full flex flex-col bg-gray-200 rounded-lg p-5 gap-5 overflow-x-auto'>
      <div className='flex flex-row gap-4'>
            <p className='text-xl pt-1'>Contest name:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <input className='input-info h-8 pl-2' {...register('name')} />
            </label>
          </div>

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

        <div className='w-full flex flex-row gap-3 p-5'>
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

          <button className='btn btn-success' type="submit" disabled={!fields.length}>Submit Contest</button>
=======
    <form className="w-full max-w-5xl">
      <div className='w-full flex flex-col bg-gray-200 rounded-lg p-5 ml-6 gap-5'>
        <div className='flex flex-row gap-4'>
          <p className='text-xl pt-1'>Contest name:</p>
          <label className="leading-5" style={{borderWidth: "1.5px"}}>
            <input className='input-info h-8 pl-2' {...register('name')} />
          </label>
        </div>

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
>>>>>>> main
        </div>
      </div>

      <br/>
    
      {fields.length > 0 &&
        fields.map((field, index) => (
          <>
          <br/>
          <div key={field.id} className='bg-gray-200 rounded-lg flex flex-col p-5 ml-6'>
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

      <div className='w-full flex flex-row gap-3 p-5 ml-6'>
        <button className="btn btn-info bg-blue-500" type="button" onClick={() => append(
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

        <SubmitButton
          formAction={handleSubmit(submitContestForm)}
          className='btn btn-success'
          disabled={!fields.length}
          pendingText='Submitting...'
        >
        Submit Contest
        </SubmitButton>
      </div>
    </form>
  );
};
