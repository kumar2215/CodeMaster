"use client";
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import QuestionForm from './QuestionForm';
import processAndValidateFormData from '@/app/utils/Misc/processForm'
import submitForm from '@/app/utils/ServerActions/submitForm';

export default function ContestForm() {

  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: {
      contestName: '',
      questions: [],
      points: 0,
      deadline: null // Initialize deadline field
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });

  async function onSubmit(data) {
    console.log(data);
    const processedData = processAndValidateFormData(data);
    if (!processedData || processedData.questions.some(q => !q) || processedData.questions.some(question => question.parts.some(p => !p))) return;
    const successful = await submitForm(data, "Tournaments");     
    if (successful) {
      toast.success("Tournament created successfully! Currently awaiting for verification.", {autoClose: 3000});
    }
  }

  return (
    <div className="w-full max-w-5xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='w-full flex flex-col bg-gray-200 rounded-lg p-5 ml-6 gap-5'>
          <div className='flex flex-row gap-4'>
            <p className='text-xl pt-1'>Contest name:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <input className='input-info h-8 pl-2' {...register('contestName')} />
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
        </div>
      </form>
    </div>
  );
};
