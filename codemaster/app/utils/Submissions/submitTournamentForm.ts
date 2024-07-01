import processAndValidateFormData from '@/app/utils/Processing/processForm';
import submitForm from '@/app/api/submitForm';
import { toast } from 'react-toastify';

export default async function submitTournamentForm(data: any) {
  const processedData = processAndValidateFormData(data, "Tournament");
  if (!processedData || processedData.questions.some((q: any) => !q) || 
    processedData.questions.some((question: any) => question.parts.some((p: any) => !p))) return;
  const successful = await submitForm(processedData, "Tournaments");     
  if (successful) {
    toast.success("Tournament created successfully! Currently awaiting for verification.", {autoClose: 3000});
  }
}