import Navbar from "@/components/misc/navbar";
import placeInCodeBox from "@/components/codeBoxes/codeBox";
import FreeStyle from "@/components/questionTemplates/freestyle/FreeStyle";
import handleMCQ  from "@/app/utils/Handlers/handleMCQ";
import handleMultipleResponses from "@/app/utils/Handlers/handleMultipleResponses";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const thisLink = "/problemset";

export default async function Question({params: {id}}: {params: {id: string}}) {
  
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/login");
  }
  
  const { data: question, error: err } = await supabase.from("Questions").select(`*`).eq("id", id);
  if (err) { console.error(err); }
  const questionData = question && question[0];
  
  // need to refactor this
  if (questionData.parts.length === 1 && questionData.parts[0].type === "Freestyle") {
    const res = await supabase.from("Freestyle").select("*").eq("id", questionData.parts[0].part_id);
    if (res.error) { console.error(res.error); }
    const partData = res.data && res.data[0];
    let inputs: any[] = partData.inputs;
    inputs = await Promise.all(
      inputs.map(async (inputId: string) => {
        const {data: input, error: err} = await supabase.from("Testcases").select(`*`).eq("id", inputId);
        if (err) {
          console.error(err);
          return; 
        }
        const inputData = input && input[0];
        return inputData?.data;
      })
    );
    partData.inputs = inputs;
    partData.code = questionData.code;
    partData.source = questionData.source;
    return (
      <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} />
      <div className="w-full max-w-5xl bg-slate-50 p-3 border-4">
      <div className="text-2xl font-bold min-h-10">Question: {questionData.title}</div>
      <div className="text-lg text-gray-500 min-h-10">{partData.question}</div>
      <FreeStyle data={partData}></FreeStyle>
      </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
    <Navbar thisLink={thisLink} />
    <div className="w-full max-w-5xl bg-slate-50 p-3 border-4">
    <div className="text-2xl font-bold min-h-10">Question: {questionData.title}</div>
    <div className="text-lg text-gray-500 min-h-10">{questionData.context}</div>
    {placeInCodeBox(questionData.code, questionData.language)}
    { questionData.source.link
      ? <div className="text-lg font-medium leading-10">
      <p>source: 
      <a 
      href={questionData.source.src}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-blue-500 hover:underline cursor-pointer px-2"
      >{questionData.source.src}</a>
      </p>
      </div>
      : <div className="text-lg font-medium leading-10">source: {questionData.source.src}</div>
    }
    </div>
    {questionData.parts.map(async (part: any, index: number) => {
      const questionType = part.type;
      const partId = part.part_id;
      const { data: Part, error: err } = await supabase.from(questionType).select(`*`).eq("id", partId);
      if (err) { console.error(err); }
      const partData = Part && Part[0];
      switch (questionType) {
        case "MultipleResponses":
          let inputs: any[] = partData.inputs;
          inputs = await Promise.all(
            inputs.map(async (inputId: string) => {
              const {data: input, error: err} = await supabase.from("Testcases").select(`*`).eq("id", inputId);
              if (err) {
                console.error(err);
                return; 
              }
              const inputData = input && input[0];
              return inputData?.data;
            })
          );
          return handleMultipleResponses(partData, id, partId, inputs, user.email);
        case "MCQ":
          return handleMCQ(partData, id, partId, user.email);
      }
    })}
    <br />
    </div>
  );
}