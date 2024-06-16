"use client";
import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'react-router-dom';

const CodeEditor = dynamic(
    () => import('../codeBoxes/CodeEditor'),
    { ssr: false }  // This component will only be imported on the client-side
);

export const FreestyleForm = ({ control, register, parentIndex, removeQuestion, watch, errors, qnNum, language}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `questions.${qnNum-1}.parts.${parentIndex}.inputs`
    });

    const [code, setCode] = useState('')


    const questionType = watch(`questions.${qnNum-1}.parts.${parentIndex}.questionType`);
    const points = watch(`questions.${qnNum-1}.parts.${parentIndex}.points`);

    const format = watch(`questions.${qnNum-1}.parts.${parentIndex}.format`, '');
    const formatArray = format ? format.split(',').filter(f => f.trim() !== '') : [];

    const addOption = (type) => {
        append({ type: type, value: "" });
    };

    return (
        <div>
            <h2 className='text-center text-4xl'>Question {qnNum} Part {parentIndex + 1}</h2>
            <div className='w-full flex items-center justify-center'>
              <div>
                <label className="input input-bordered flex items-center gap-2 mr-4 mt-5">
                    <input {...register(`questions.${qnNum-1}.parts.${parentIndex}.part`, { required: "Part is required" })} placeholder="Part" />
                </label>
                {errors.questions?.[qnNum-1]?.parts?.[parentIndex]?.part && <p className="error text-red-600 text-center">{errors.questions?.[qnNum-1]?.parts[parentIndex].part.message}</p>}
              </div>

                <div>
                    <label className="input input-bordered flex items-center gap-2 mr-4 mt-5">
                        <p className="">{questionType || 'Not specified'}</p>
                    </label>
                </div>
                <div className="flex items-center justify-center flex-col">
                    <h2>Enter points separated by commas</h2>
                    <label className="input input-bordered flex items-center gap-2 mr-4">
                        <input
                            {...register(`questions.${qnNum-1}.parts.${parentIndex}.points`, {
                                required: "Points are required",
                                pattern: {
                                    value: /^(\d+\s*,\s*)*\d+$/,
                                    message: "Invalid format. Points should be numbers separated by commas."
                                }
                            })}
                            placeholder="Enter points"
                        />
                    </label>
                    {errors.questions?.[qnNum-1]?.parts?.[parentIndex]?.points && (
                        <p className="error text-red-600 text-center">
                            {errors.questions[qnNum-1].parts[parentIndex].points.message}
                        </p>
                    )}
                </div>
            </div>


            <Controller
                    name={`questions.${qnNum-1}.parts.${parentIndex}.format`}
                    control={control}
                    render={({ field }) => (
                        <div className='flex flex-col items-center'>
                            <h3>Enter Format separated by commas</h3>
                            <label className="input input-bordered flex items-center gap-2 mr-4 w-90">
                                <input {...field} placeholder="Input Format" />
                            </label>
                        </div>
                    )}
                />

            <textarea className='w-full mt-4' {...register(`questions.${qnNum-1}.parts.${parentIndex}.question`, { required: "Question content is required" })} placeholder="Question" />
            {errors.questions?.[qnNum-1]?.parts?.[parentIndex]?.question && <p className="error text-red-600" >{errors.questions?.[qnNum-1]?.parts[parentIndex].question.message}</p>}


            <section>
            <h2>Input your question's code</h2>
            <Controller
                name={`questions.${qnNum-1}.parts.${parentIndex}.code`}
                control={control}
                defaultValue=""
                rules={{ required: "Code is required" }}
                render={({ field }) => (
                    <>
                        <CodeEditor
                            language="javascript"
                            code={field.value}
                            setCode={field.onChange}
                        />
                        {errors.questions?.[qnNum-1]?.codeContent && (
                            <span className="text-red-500 text-sm">
                                {errors.questions?.[qnNum-1]?.codeContent.message}
                            </span>
                        )}
                    </>
                )}
            />
            </section>

                            {/*Inputs field */}
                            {fields.map((item, index) => (
                <div key={item.id} className=''>
                    <h2 className='text-2xl text-center'>Input number {index + 1}</h2>
                    {formatArray.map(variable => (
                        <label className="input input-bordered flex items-center gap-2 mb-4">
                            <input 
                                key={`${variable.trim()}-${index}`}
                                {...register(`questions.${qnNum-1}.parts.${parentIndex}.inputs.${index}.${variable.trim()}`)} 
                                placeholder={variable.trim()}
                            />
                        </label>
                    ))}
                     <label className="input input-bordered flex items-center gap-2">
                    <input {...register(`questions.${qnNum-1}.parts.${parentIndex}.inputs.${index}.expected`)} placeholder="Expected" />
                    </label>

                    <button className="btn btn-error mt-4 mb-2" type="button" onClick={() => remove(index)}>Remove Input</button>
                </div>
            ))}

            <button className="btn btn-info mt-4 mr-2 mb-2" type="button" onClick={() => {
                if (formatArray.length > 0) {
                    append(formatArray.reduce((acc, varName) => {
                        acc[varName.trim()] = '';
                        return acc;
                    }, { expected: '' }));
                }
            }}>
                Add Input
            </button>
            {/* <button className="btn btn-error mt-4 mb-2" type="button" onClick={() => removeQuestion(parentIndex)}>Remove MRQ Question</button> */}
        </div>
    );
};