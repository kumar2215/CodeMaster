"use client";
import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(
    () => import('../codeBoxes/CodeEditor'),
    { ssr: false }  // This component will only be imported on the client-side
);

export const MCQForm = ({ control, register, parentIndex, removeQuestion, watch, errors, qnNum, language}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `questions.${qnNum-1}.parts.${parentIndex}.options`
    });


    const questionType = watch(`questions.${qnNum-1}.parts.${parentIndex}.questionType`);
    const points = watch(`questions.${qnNum-1}.parts.${parentIndex}.points`);
    const expected = watch(`questions.${qnNum-1}.parts.${parentIndex}.expected`);



    const addOption = (type) => {
        append({ category: type, value: "" });
    };

    return (
        <div>
            <h2 className='text-center text-4xl'>Question {qnNum} Part {parentIndex + 1}</h2>
            <div className='w-full flex items-center justify-center'>
                <div className='flex flex-col pt-5'>
                <label className="input input-bordered flex items-center gap-2 mr-4">
                    <input {...register(`questions.${qnNum-1}.parts.${parentIndex}.part`, { required: "Part is required" })} placeholder="Part" />
                </label>
                {errors.questions?.[qnNum-1]?.parts?.[parentIndex]?.part && <p className="error text-red-600 text-center">{errors.questions?.[qnNum-1]?.parts[parentIndex].part.message}</p>}
                </div>

                <div>
                    <label className="input input-bordered flex items-center gap-2 mr-4">
                        <p className="">{questionType || 'Not specified'}</p>
                    </label>
                </div>

                <div className='flex flex-col pr-4'>
                <div className='mr-2 text-center'>Points: </div>

                <label className="flex flex-row items-center justify-center ">
                    <input
                        className='text-center h-12'
                        type="number"
                        {...register(`questions.${qnNum-1}.parts.${parentIndex}.points`, { 
                            required: "Points are required",
                            validate: value => value >= 0 || "Points cannot be negative"
                        })}
                    />
                </label>
                {errors.questions?.[qnNum-1]?.parts?.[parentIndex]?.points && (
                    <p className="text-red-600 text-center">
                        {errors.questions?.[qnNum-1]?.parts[parentIndex].points.message}
                    </p>
                )}
                </div>

                <div className='flex flex-col'>
                <div className='mr-2 text-center'>Expected: </div>

                <label className="flex flex-row items-center justify-center ">
                    <input
                        className='text-center h-12'
                        type="number"
                        {...register(`questions.${qnNum-1}.parts.${parentIndex}.expected`, { 
                            required: "Expected is required",
                            validate: value => value >= 0 || "Expected cannot be negative"
                        })}
                    />
                </label>
                {errors.questions?.[qnNum-1]?.parts?.[parentIndex]?.expected && (
                    <p className="text-red-600 text-center">
                        {errors.questions?.[qnNum-1]?.parts[parentIndex].expected.message}
                    </p>
                )}
                </div>

            </div>

            <textarea className='w-full mt-4' {...register(`questions.${qnNum-1}.parts.${parentIndex}.question`, { required: "Question content is required" })} placeholder="Question" />
            {errors.questions?.[qnNum-1]?.parts?.[parentIndex]?.question && <p className="error text-red-600">{errors.questions?.[qnNum-1]?.parts[parentIndex].question.message}</p>}

            {fields.map((item, index) => (
                <div key={item.id} className='flex flex-col'>
                    <h2 className='text-2xl text-center'>Input {index + 1} ({item.category})</h2>
                    
                    {item.category === "text" ? (
                        <textarea {...register(`questions.${qnNum-1}.parts.${parentIndex}.options.${index}.value`, {
                            required: "This field cannot be empty",
                        })} placeholder={`Enter ${item.category}`} />
                    ) : (
                        <Controller
                            name={`questions.${qnNum-1}.parts.${parentIndex}.options.${index}.value`}
                            control={control}
                            defaultValue=""  
                            render={({ field }) => (
                                <CodeEditor
                                    language={language}  // Assuming the language is static, adjust if dynamic
                                    code={field.value}
                                    setCode={field.onChange}  
                                />
                            )}
                        />
                    )}

                    {errors.questions?.[qnNum-1]?.parts && errors.questions?.[qnNum-1]?.parts[parentIndex] && errors.questions?.[qnNum-1]?.parts[parentIndex].options &&
                    errors.questions?.[qnNum-1]?.parts[parentIndex].options[index] && errors.questions?.[qnNum-1]?.parts[parentIndex].options[index].value &&
                    <p className="error">{errors.questions?.[qnNum-1]?.parts[parentIndex].options[index].value.message}</p>}

                    <button className="btn btn-error w-4/12 self-center mb-4 mt-2" type="button" onClick={() => remove(index)}>Remove Input</button>
                </div>
            ))}



            <button className="btn btn-info mt-4 mr-2 mb-2" type="button" onClick={() => addOption('text')}>
                Add Text Option
            </button>
            <button className="btn btn-info mt-4 mr-2 mb-2" type="button" onClick={() => addOption('code')}>
                Add Code Option
            </button>
            {/* <button className="btn btn-error mt-4 mb-2" type="button" onClick={() => removeQuestion(parentIndex)}>Remove MRQ Question</button> */}
        </div>
    );
};