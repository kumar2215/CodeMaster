import HandleMCQ from "./handleMCQ";
import HandleMRQ from "./handleMRQ";
import HandleFreestyle from "./handleFreestyle";
import HandleMultipleResponses from "./handleMultipleResponses";

export default function handler(questionType: string, questionData: any, username: any) {
  switch (questionType) {
    case "Multiple-Responses":
      return <HandleMultipleResponses questionPart={questionData} username={username} />;
    case "MCQ":
      return <HandleMCQ questionPart={questionData} username={username} />;
    case "MRQ":
      return <HandleMRQ questionPart={questionData} username={username} />;
    case "Freestyle":
      return <HandleFreestyle questionPart={questionData} username={username} />
  }
}