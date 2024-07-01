import processAndValidateFormData from '@/app/utils/Processing/processForm'
import submitForm from '@/app/api/submitForm';
import { toast } from 'react-toastify';

export default async function submitContestForm(data: any) {
  const processedData = processAndValidateFormData(data, "Contest");
  if (!processedData || processedData.questions.some((q: any) => !q) || 
    processedData.questions.some((question: any) => question.parts.some((p: any) => !p))) return;
  const successful = await submitForm(processedData, "Contests");     
  if (successful) {
    toast.success("Contest created successfully!", {autoClose: 3000});
  }
}
