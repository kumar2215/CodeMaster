"use client";
import { useForm } from 'react-hook-form';
import QuestionForm from './QuestionForm';
import processAndValidateQuestion from '@/app/utils/Processing/processQuestion';
import { SubmitButton } from '@/components/buttons/SubmitButton';
import upload from '@/app/api/uploadQuestion/upload';
import { toast } from 'react-toastify';

export default function IndividualQuestionForm({ user_data }) {

  const { register, handleSubmit, control, watch } = useForm({});

  const verified = user_data.user_type.includes("admin");
  const username = user_data.username;

  async function onSubmit(data) {
    const question = data.questions[0];
    const processedQuestion = processAndValidateQuestion(question, null);    
    console.log(processedQuestion);
    if (!processedQuestion || processedQuestion.parts.some(q => !q)) return;
    const successful = await upload(processedQuestion, "general", username, verified); 
    if (successful) {
      if (!verified) {
        toast.success("Question created successfully! Currently awaiting for verification.", {autoClose: 3000});
      } else {
        toast.success("Question created successfully!", {autoClose: 3000});
      }
    } else {
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
    }
  };

  return (
    <form>
      <div className='flex flex-col w-full max-w-5xl p-5 ml-6 bg-gray-200 rounded-lg'>
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

      <div className='flex flex-row w-full gap-3 p-2 ml-3'>
        <SubmitButton
        formAction={handleSubmit(onSubmit)}
        type='submit'
        className='bg-green-400 btn btn-success'
        pendingText='Submitting...'
        >
        Submit Question
        </SubmitButton>
      </div>
    </form>
  );
}