"use client";
import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import QuestionForm from './QuestionForm';
import { uploadTournament } from '@/app/questionGeneration/uploadTournament';

const TournamentForm = () => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      tournamentName: '',
      questions: [],
      points: 0,
      deadline: null // Initialize deadline field

    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });



  //Data Format is 
  //Array consisting tournamentName, questions, points
  //Questions -> array of questions 
  //Question is format something like 
  //codeContent, defaultValues,difficulty, parts,questionContent,title,type. line 67
  const onSubmit = async (data: any) => {
    console.log(processFormData(data))
    if (data.deadline) {
      const deadlineTimestamp = new Date(data.deadline).getTime();
      console.log("Deadline Timestamp:", deadlineTimestamp);
    }
    const result = await processFormData(data)
    console.log(result, 'processed form')
    const result1 = await uploadTournament(result.questions, result.deadline, 'user123')

    }

  //Process to format form data for submission to database
  function processFormData(formData: any) {
    const processedData = { ...formData };
    processedData.questions = processedData.questions.map((question: any) => {
      const content = [];
      if (question.questionContent) {
        content.push({ value: question.questionContent, category: "text" });
      }
      if (question.codeContent) {
        content.push({ value: question.codeContent, category: "code" });
      }
        
        delete processedData.questionContent;
        delete processedData.codeContent;
  
      return {
        ...question,
        content,
        parts: question.parts.map((part: any) => {
          if (part.questionType === "Multiple-Responses") {
            const pointsArray = part.points.split(',').map(Number); // Convert to numbers
            const formatArray = part.format.split(',').filter((f: string) => f.trim() !== '');
        
            // Function to handle textfield data of any type
            const processTextField = (inputs: any[]) => {
                const newInputs = inputs.map(input => {
                    const value = input.textField;
                    const valuesArray = value.split('|');
                    const newInput: any = {};
        
                    formatArray.forEach((key: string, index: number) => {
                      let parsedValue;
                      try {
                        parsedValue = JSON.parse(valuesArray[index]);
                      } catch (error) {
                        // Handle non-JSON values (like strings)
                        parsedValue = valuesArray[index]?.trim() || ''; // Default to empty string if parsing fails
                      }
                      newInput[key.trim()] = parsedValue;
                    });
        
                    return newInput;
                });
                return newInputs;
            };
        
            const processedInputs = processTextField(part.inputs);
            console.log(processedInputs, 'processed')
            return { ...part, points: pointsArray, format: formatArray, inputs: processedInputs };
        }
         if (part.questionType === "MRQ") {
            const expectedArray = part.expected.split(',').map(Number);
            return { ...part, expected: expectedArray };

          } else if (part.questionType === "Freestyle") {
            const pointsArray = part.points.split(',').map(Number);
            const formatArray = part.format.split(',').filter(f => f.trim() !== '');
            return { ...part, points: pointsArray, format: formatArray };

          } else {
            // Handle other question types or invalid types (optional)
            return part;
          }
        })
      };
    });

    return processedData;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <div className='w-full flex items-center justify-center'>
        <div className='flex flex-col'>
          <label className="input input-bordered flex items-center gap-2 mr-4">
            <input className='input-info' {...register('tournamentName', {
              required: "Tournament name is required"
            })} placeholder="Tournament Name" />
          </label>
          {errors.tournamentName && <p className='text-center text-red-600'>{errors.tournamentName.message}</p>}
        </div>
        <div>
          <label className="input input-bordered flex items-center gap-2">
            <input className='w-1/4' {...register(`points`, {
              required: "Points are required",
              pattern: {
                value: /^\d+$/,
                message: "Points must be a positive number"
              },
              validate: value => parseInt(value) > 0 || "Points must be a positive number"
            })} placeholder="Points" />
          </label>
          {errors.points && <p className='text-center text-red-600'>{errors.points.message}</p>}
        </div>
              {/* Deadline Field */}

      <div className='w-full flex ml-2'>
        <div className='flex flex-col'>
        <h2>Deadline</h2>

          <label className="input input-bordered flex items-center gap-2 ml-4">
            <input
              type="date"
              {...register('deadline')} // Register deadline field
            />
          </label>
        </div>
      </div>
      </div>

      {fields.map((field, index) => (
        <QuestionForm
          key={field.id}
          control={control}
          register={register}
          errors={errors}
          remove={remove}
          watch={watch}
          index={index}
        />
      ))}

      {errors.questions && <p className='text-center text-red-600'>You must add at least one question to submit the form.</p>}

      <button className="btn btn-info mt-4 mr-2 mb-2" type="button" onClick={() => append(
        {
          type: '',
          title: '',
          language: '',
          difficulty: '',
          questionContent: '',
          codeContent: '',
          source: {
            "link": false,
            "src": "Anonymous"
          }
        }
      )}>
        Add Question
      </button>

      <button className='btn btn-success ml-2 mb-2' type="submit" disabled={!fields.length}>Submit Tournament</button>
    </form>
  );
};

export default TournamentForm;
