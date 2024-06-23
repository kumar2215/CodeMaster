import processAndValidateQuestion from './processQuestion';
import { toast } from 'react-toastify';

export default function processAndValidateFormData(data, type) {
  const processedData = { ...data };

  // check if name is set
  if (!processedData.name) {
    toast.error(`Please set a name for the ${type.toLowerCase()}`, {autoClose: 3000});
    return false;
  }

  // check if deadline is set
  if (!processedData.deadline) {
    toast.error(`Please set a deadline for the ${type.toLowerCase()}`, {autoClose: 3000});
    return false;
  }
  
  // check if there are any questions
  if (processedData.questions.length < 5) {
    toast.error(`${type}s need to have at least 5 questions`, {autoClose: 3000})
    return false;
  }

  processedData.questions = processedData.questions.map((question, idx) => processAndValidateQuestion(question, idx));
  
  return processedData;
}