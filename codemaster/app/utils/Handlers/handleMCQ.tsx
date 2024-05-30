import MCQ from "@/components/questionTemplates/MCQ";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default async function handleMCQ(questionPart: any, questionId: string, partId: string, userEmail: any) {
  const part: string = questionPart.part;
  const question: string = questionPart.question;
  const options: string[] = questionPart.options;
  const expected: string = questionPart.expected;
  let points: number = questionPart.points;
  
  const res = await supabase.from("Users").select("*").eq("email", userEmail);
  if (res.error) { console.error(res.error); }

  const questionsDone = res.data && res.data[0].questions_done;
  if (questionsDone) {
    const index = questionsDone.findIndex((question: any) => question.id === questionId);
    if (index !== -1) {
      const questionDone = questionsDone[index];
      const index2 = questionDone.parts.findIndex((partDone: any) => partDone.partId === partId);
      if (index2 !== -1) {
        const partDone = questionDone.parts[index2];
        if (partDone.status === "Correct") {
          points = 0;
        } else {
          points = Math.pow(0.75, partDone.attempts) * points;
          if (points >= 1) {
            points = Math.floor(points);
          } else {
            points = 0;
            partDone.status = "Too many wrong attempts";
            questionDone.parts[index2] = partDone;
            questionsDone[index] = questionDone;
            const res2 = await supabase.from("Users").update({questions_done: questionsDone}).eq("email", userEmail);
            if (res2.error) { console.error(res2.error); }
          }
        }
      }
    }
  }
  
  const data = {
    questionId: questionId,
    partId: partId,
    userEmail: userEmail,
    question: question,
    part: part,
    options: options,
    points: points,
    expected: expected,
  }
  
  return <MCQ data={data} />;
}