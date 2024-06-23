"use client";
import { useForm } from 'react-hook-form';
import QuestionForm from './QuestionForm';
import processAndValidateQuestion from '@/app/utils/Misc/processQuestion';
import upload from '@/app/questionGeneration/upload';
import { toast } from 'react-toastify';

export default function IndividualQuestionForm({ user_data }) {

  const { register, handleSubmit, control, watch } = useForm({});

  const verified = user_data.user_type.includes("admin");

  async function onSubmit(data) {
    const question = data.questions[0];
    console.log(question);
    const processedQuestion = processAndValidateQuestion(question, null); 
    if (!processedQuestion || processedQuestion.parts.some(q => !q)) return;
    const successful = await upload(processedQuestion, "general", verified); 
    if (successful) {
      if (!verified) {
        toast.success("Question created successfully! Currently awaiting for verification.", {autoClose: 3000});
      } else {
        toast.success("Question created successfully!", {autoClose: 3000});
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='w-full max-w-5xl bg-gray-200 rounded-lg flex flex-col p-5 ml-6'>
        <QuestionForm
          control={control}
          register={register}
          remove={null}
          watch={watch}
          index={0}
          single={true}
        />
      </div>

      <br/>

      <div className='w-full flex flex-row gap-3 p-2 ml-3'>
        <button className='btn btn-success' type="submit">Submit Question</button>
      </div>
    </form>
  );
}