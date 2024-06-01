import handleMCQ from "./handleMCQ";
import handleMRQ from "./handleMRQ";
import handleFreestyle from "./handleFreestyle";
import handleMultipleResponses from "./handleMultipleResponses";

export default function handler(questionType: string, questionData: any, username: any) {
  switch (questionType) {
    case "Multiple-Responses":
      return handleMultipleResponses(questionData, username);
    case "MCQ":
      return handleMCQ(questionData, username);
    case "MRQ":
      return handleMRQ(questionData, username);
    case "Freestyle":
      return handleFreestyle(questionData, username);
  }
}