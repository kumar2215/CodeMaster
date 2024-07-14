"use client";
import processAndValidateFormData from '@/app/utils/Processing/processForm'
import submitForm from '@/app/api/submitForm/submit';
import { toast } from 'react-toastify';

export default async function submitContestForm(data: any) {
  const processedData = processAndValidateFormData(data, "Contest");
  if (!processedData || processedData.questions.some((q: any) => !q) || 
    processedData.questions.some((question: any) => question.parts.some((p: any) => !p))) return;
  const [successful, error] = await submitForm(processedData, "Contests");     
  if (successful && !error) {
    toast.success("Contest created successfully!", {autoClose: 3000});
  } else {
    toast.error(error, {autoClose: 3000});
  }
}
