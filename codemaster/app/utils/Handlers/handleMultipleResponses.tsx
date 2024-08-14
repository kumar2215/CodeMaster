import MultipleResponses from "@/components/questionTemplates/MultipleResponses";
import { createClient } from "@/utils/supabase/client";

export default async function HandleMultipleResponses({questionPart, username}: {questionPart: any, username: string}) {
  const questionId: string = questionPart.questionId;
  const partId: string = questionPart.partId;
  let points: number[] = questionPart.points;

  const supabase = createClient();

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
    ...questionPart,
    username,
    points
  }

  return <MultipleResponses data={data} />;
}