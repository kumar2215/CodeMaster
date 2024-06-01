import MRQ from "@/components/questionTemplates/MRQ";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default async function handleMRQ(questionPart: any, username: any) {
  const questionId: string = questionPart.questionId;
  const partId: string = questionPart.partId;
  const question: string = questionPart.question;
  const part: string = questionPart.part;
  const options: string[] = questionPart.options;
  const expected: number[] = questionPart.expected;
  let points: number = questionPart.points;
  const source: any = questionPart.source;
  
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
            const res2 = await supabase.from("Users").update({questions_done: questionsDone}).eq("username", username);
            if (res2.error) { console.error(res2.error); }
          }
        }
      }
    }
  }
  
  const data = {
    questionId: questionId,
    partId: partId,
    username: username,
    question: question,
    part: part,
    options: options,
    points: points,
    expected: expected,
    source: source
  }
  
  return <MRQ data={data} />;
}