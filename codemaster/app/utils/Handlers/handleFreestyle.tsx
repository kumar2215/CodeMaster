import FreeStyle from "@/components/questionTemplates/FreeStyle";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default async function handleFreestyle(questionPart: any, username: any) {

  const questionId: string = questionPart.questionId;
  const partId: string = questionPart.partId;
  const question: string = questionPart.question;
  const precode = questionPart.pre_code;
  const code = questionPart.code;
  const postcode = questionPart.post_code;
  const language = questionPart.language;
  const part: string = questionPart.part; 
  const parameters: any = questionPart.parameters; 
  const inputs: any[] = questionPart.inputs;
  let points: number[] = questionPart.points;
  const function_name: string = questionPart.function_name;
  const source = questionPart.source;
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
    precode: precode ? precode : "",
    postcode: postcode ? postcode : "",
    language: language.toLowerCase(),
    parameters: parameters,
    inputs: inputs,
    points: points,
    source: source,
    function_name: function_name,
    class_name: questionPart.class_name,
    return_type: questionPart.return_type,
    run_configuration: questionPart.run_configuration,
    verified: questionPart.verified,
    partOfCompetition: partOfCompetition,
    savedCode: questionPart.savedCode
  }

  return <FreeStyle data={data}></FreeStyle>;
}