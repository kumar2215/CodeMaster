import MultipleResponses from "@/components/questionTemplates/MultipleResponses";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default async function handleMultipleResponses(questionPart: any, username: any) {
  const questionId: string = questionPart.questionId;
  const partId: string = questionPart.partId;
  const question: string = questionPart.question;
  const part: string = questionPart.part;
  const format: string[] = questionPart.format;
  const inputs: any[] = questionPart.inputs;
  let points: number[] = questionPart.points;
  const source: any = questionPart.source;
  const partOfCompetition: any = questionPart.partOfCompetition;
  
  const res = await supabase.from("Users").select("*").eq("username", username);
  if (res.error) { console.error(res.error); }
  
  const questionsDone = res.data && res.data[0].questions_done;
  if (questionsDone) {
    const index = questionsDone.findIndex((question: any) => question.id === questionId);
    if (index !== -1) {
      const questionDone = questionsDone[index];
      const index2 = questionDone.parts.findIndex((partDone: any) => partDone.partId === partId);
      if (index2 !== -1) {
        const partDone = questionDone.parts[index2];
        for (let i = 0; i < partDone.status.length; i++) {
          if (partDone.status[i] === "Correct") {
            points[i] = 0;
          } else {
            points[i] = Math.pow(0.9, partDone.attempts) * points[i];
            if (points[i] >= 1) {
              points[i] = Math.floor(points[i]);
            } else {
              points[i] = 0;
              partDone.status[i] = "Too many wrong attempts";
            }
          }
        }
        questionDone.parts[index2] = partDone;
        questionsDone[index] = questionDone;
        const res2 = await supabase.from("Users").update({questions_done: questionsDone}).eq("username", username);
        if (res2.error) { console.error(res2.error); }
      }
    }
  }
  
  const data = {
    questionId: questionId,
    partId: partId,
    username: username,
    question: question,
    part: part,
    format: format,
    inputs: inputs,
    points: points,
    source: source,
    verified: questionPart.verified,
    partOfCompetition: partOfCompetition,
    savedInputs: questionPart.savedInputs
  }

  return <MultipleResponses data={data} />;
}