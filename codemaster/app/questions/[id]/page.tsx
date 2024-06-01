import Navbar from "@/components/misc/navbar";
import placeInCodeBox from "@/components/codeBoxes/codeBox";
import handler from "@/app/utils/Handlers/handler";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const thisLink = "/problemset";

async function createSupabase() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return [supabase, user];
}

async function handlePart(questionData: any, part: any, singlePart: boolean = false) { 
  const [Supabase, User] = await createSupabase();
  const supabase: any = Supabase;
  const user: any = User;
  const username = user.user_metadata.username;

  const questionType = part.type;
  const partId = part.part_id;
  const { data: Part, error: err } = await supabase.from(questionType).select(`*`).eq("id", partId);
  if (err) { console.error(err); }
  const partData = Part && Part[0];
  partData.questionId = questionData.id;
  partData.partId = partId;
  partData.language = questionData.language;
  if (singlePart) {
    partData.source = questionData.source;
  }
  let inputs: any[] = partData.inputs;
  if (inputs) {
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
  }
  return handler(questionType, partData, username);
}

export default async function Question({params: {id}}: {params: {id: string}}) {
  
  const [Supabase, User] = await createSupabase();
  const supabase: any = Supabase;
  const user: any = User;
  
  if (!user || !supabase) {
    return redirect("/login");
  }
  
  const { data: question, error: err } = await supabase.from("Questions").select(`*`).eq("id", id);
  if (err) { console.error(err); }
  const questionData = question && question[0];
  
  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
    <Navbar thisLink={thisLink} />
    <div className="w-full max-w-5xl bg-slate-50 p-3 border-4">
    <div className="text-2xl font-bold min-h-10">Question: {questionData.title}</div>
    <div className="text-lg text-gray-500 min-h-10">{
      questionData.content.map((content: any, index: number) => 
        content.category === "text"
        ? <p key={index}>{content.value}</p>
        : placeInCodeBox(content.value, questionData.language)
      )
    }
    <div className="text-base h-fit text-black p-2">
    {questionData.parts.length === 1 && handlePart(questionData, questionData.parts[0], true)}
    </div>
    </div>
    {questionData.parts.length > 1
    ? questionData.source.link
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
    : <></>
    }
    </div>
    {questionData.parts.length > 1 && questionData.parts.map(async (part: any, index: number) =>
      handlePart(questionData, part)
    )}
    <br />
    </div>
  );
}