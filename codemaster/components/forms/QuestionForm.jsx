"use client";
import React from 'react';
import { useForm,Controller, useFieldArray, FormProvider  } from 'react-hook-form';
import dynamic from 'next/dynamic';
import upload from '@/app/questionGeneration/upload';
import MultipleResponseForm from './MultipleResponseForm';
import {MRQForm }from './MRQForm';
import { MCQForm } from './MCQForm';
import { FreestyleForm } from './FreestyleForm';

const CodeEditor = dynamic(
    () => import('../codeBoxes/CodeEditor'),
    { ssr: false }  
  );
function QuestionForm({ control, register, errors, remove, watch, index }) {
    
    const QUESTION_COMPONENTS = {
        "Multiple-Responses": MultipleResponseForm,
        "MCQ": MCQForm,
        "Freestyle": FreestyleForm,
        "MRQ": MRQForm 
    };

    const { fields, append, remove: removeParts } = useFieldArray({
        control,
        name: `questions.${index}.parts`
    });

    const language = watch(`questions.${index}.language`);
    const qnNum = index + 1


    return (
        <form className='w-full'>
            <h1 className='text-5xl text-center text-green-600'>{`Question ${index + 1}`}</h1>
                <div className='w-full'>
                    <div className='w-full flex items-center justify-center'>

                        <div className='flex flex-col'>
                            <label className="input input-bordered flex items-center gap-2 mr-4">
                                <input className='input-info' {...register(`questions.${index}.title`, {
                                    validate: value => value !== "" || "Title is required"
                                })} placeholder="Title" />
                            </label>
                            {errors.title && <p className='text-center text-red-600'>{errors.title.message}</p>}
                        </div>

                        <div className='flex flex-col'>

                        <label className="input input-bordered flex items-center gap-2 mr-4 ">
                            <select className='' {...register(`questions.${index}.type`, {
                                validate: value => value !== "" || "Type must be selected"
                            })}>
                                <option value="">Select Question Type</option>
                                <option value="MCQ">Code Understanding</option>
                                <option value="Debugging">Debugging</option>
                                <option value="Code Understanding">Code Understanding</option>
                                <option value="Code Principles">Code Principles</option>
                            </select>
                        </label>
                        {errors.type && <p className='text-center text-red-600'>{errors.type.message}</p>}
                        </div>

                        <div className='flex flex-col'>
                            <label className="input input-bordered flex items-center gap-2 mr-4 ">
                                <select className='' {...register(`questions.${index}.difficulty`, {
                                    validate: value => value !== "" || "Difficulty must be selected"
                                })}>
                                    <option value="">Select Question difficulty</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </label>
                            {errors.difficulty && <p className='text-center text-red-600'>{errors.difficulty.message}</p>}
                        </div>

                        <div className='flex flex-col'>
                            <label className="input input-bordered flex items-center gap-2 mr-4">
                                <select className='' {...register(`questions.${index}.language`, {
                                    validate: value => value !== "" || "Language must be selected"
                                })}>
                                    <option value="">Select Language</option>
                                    <option value="Python">Python</option>
                                    <option value="JavaScript">JavaScript</option>
                                    <option value="Java">Java</option>
                                    <option value="C++">C++</option>
                                </select>
                            </label>
                            {errors.language && <p className='text-center text-red-600'>{errors.language.message}</p>}
                        </div>


                    </div>
                    <textarea className='w-full mt-4' {...register(`questions.${index}.questionContent`, {
                        validate: value => value !== "" || "Question content is required"
                    })} placeholder="Question Content" />
                    {errors.questionContent && <p className='text-center text-red-600'>{errors.questionContent.message}</p>}
                    <h2>Input your question's code</h2>
                    <Controller
                        name={`questions.${index}.codeContent`}
                        control={control}
                        defaultValue=""  
                        render={({ field }) => (
                            <CodeEditor
                                language={language != "" ? language?.toLowerCase() : 'javascript'}  
                                code={field.value}
                                setCode={field.onChange} 
                            />
                        )}
                    />
                    {fields.map((field, index) => {
                        const QuestionComponent = QUESTION_COMPONENTS[field.questionType] || MCQForm; 
                        return (
                            <div key={field.id}>
                                <QuestionComponent
                                    control={control}
                                    register={register}
                                    parentIndex={index}
                                    remove={removeParts}
                                    watch={watch}
                                    errors={errors}
                                    qnNum={qnNum}
                                    language= {language}
                                />
                                <button className="btn btn-error mt-4" type="button" onClick={() => removeParts(index)}>
                                    Remove Part
                                </button>
                            </div>
                        );
                    })}


                </div>
                <button className="btn btn-info mt-4 mr-2 mb-2" type="button" onClick={() => append({
                    part: '',
                    questionType: "Multiple-Responses", 
                    question: '',
                    format: '',
                    inputs: [],
                    points: ''

                })}>Add Multiple Responses Part</button>

                <button className="btn btn-info mt-4 mr-2 mb-2" type="button" onClick={() => append({
                    part: '',
                    questionType: "MRQ", 
                    question: '',
                    options: [],
                    expected: '',
                    points: 0
                })}>Add MRQ Part</button>
                
                <button className="btn btn-info mt-4 mr-2 mb-2" type="button" onClick={() => append({
                    part: '',
                    questionType: "MCQ",
                    question: '',
                    options: [],
                    expected: 0,
                    points: 0
                })}>Add MCQ Part</button>

                <button className="btn btn-info mt-4 mr-2 mb-2" type="button" onClick={() => append({
                    part: '',
                    questionType: "Freestyle",
                    question: '',
                    format: '',
                    inputs: [],
                    points: '',
                    code: ''
                })}>Add Freestyle Part</button>
            <button className="btn btn-error mt-4" type="button" onClick={() => remove(index)}>
                Remove Question
            </button>

        </form>
    );
}

export default QuestionForm;


// function isNumeric(str) {
//     return !isNaN(+str);
// }
