import FreeStyle from "@/components/questionTemplates/FreeStyle";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default async function handleFreestyle(questionPart: any, username: any) {

  const questionId: string = questionPart.questionId;
  const partId: string = questionPart.partId;
  const question: string = questionPart.question;
  const code = questionPart.code;
  const language = questionPart.language;
  const part: string = questionPart.part;
  const format: string[] = questionPart.format;
  const inputs: any[] = questionPart.inputs;
  let points: number[] = questionPart.points;
  const function_name: string = questionPart.function_name;
  const source = questionPart.source;
  
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
    code: code,
    language: language.toLowerCase(),
    format: format,
    inputs: inputs,
    points: points,
    source: source,
    function_name: function_name
  }

  return <FreeStyle data={data}></FreeStyle>;
}