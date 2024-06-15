"use client";
import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

const MultipleResponseForm = ({ control, register, parentIndex, removeQuestion, watch, errors, qnNum}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `questions.${qnNum-1}.parts.${parentIndex}.inputs`
    });
    console.log(fields, 'fields')


    const format = watch(`questions.${qnNum-1}.parts.${parentIndex}.format`, '');

    const questionType = watch(`questions.${qnNum-1}.parts.${parentIndex}.questionType`);



    return (
        <div>
            <h2 className='text-center text-4xl'>Question {qnNum} Part {parentIndex + 1}</h2>
            <div className='w-full flex items-center justify-center'>
                <div className='flex flex-col'>
                    <label className="input input-bordered flex items-center gap-2 mr-4 mt-5">
                        <input {...register(`questions.${qnNum-1}.parts.${parentIndex}.part`, { required: "Part is required" })} placeholder="Part" />
                    </label>
                    {errors.questions?.[qnNum-1]?.parts?.[parentIndex]?.part && (
                        <p className="error text-red-600 text-center">
                            {errors.questions[qnNum-1].parts[parentIndex].part.message}
                        </p>
                    )}
    
                </div>
    
                <div>
                    <label className="input input-bordered flex items-center gap-2 mr-4 mt-5">
                        <p className="">{questionType || 'Not specified'}</p>
                    </label>
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
    
            <textarea className='w-full mt-4' {...register(`questions.${qnNum-1}.parts.${parentIndex}.question`, { required: "Question content is required" })} placeholder="Question" />
            {errors.questions?.[qnNum-1]?.parts?.[parentIndex]?.question && (
                <p className="error text-red-600 text-center">
                    {errors.questions[qnNum-1].parts[parentIndex].question.message}
                </p>
            )}
    
            {fields.map((item, index) => (
                <div key={item.id} className=''>
                    <h2 className='text-2xl text-center'>Input number {index + 1}</h2>
                    <label className="input input-bordered flex items-center gap-2 mb-4">
                        <input
                        className='w-full'
                            {...register(`questions.${qnNum-1}.parts.${parentIndex}.inputs.${index}.textField`)}
                            placeholder="Enter inputs seperated by | , and in the same order as your Format"
                        />
                    </label>
                    <button className="btn btn-error mt-4 mb-2" type="button" onClick={() => remove(index)}>
                        Remove Input
                    </button>
                </div>
            ))}
    
            <button className="btn btn-info mt-4 mr-2 mb-2" type="button" onClick={() => {
                append({ textField: '' });
            }}>
                Add Input
            </button>
        </div>
    );
    
};




export default MultipleResponseForm;


