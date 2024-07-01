import Navbar from "@/components/misc/navbar";
import placeInCodeBox from "@/components/codeBoxes/CodeBox";
import handler from "@/app/utils/Handlers/handler";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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

  // retrieve any saved data
  if (questionData.partOfCompetition) {
    const type = questionData.partOfCompetition.type;
    const id = questionData.partOfCompetition.id;
    
    partData.partOfCompetition = questionData.partOfCompetition;

    const field = type === "Contests" ? "contests_done" : "tournaments_done";
    const res = await supabase.from("Users").select(`${field}`).eq("username", username).single();
    if (res.error) { console.error(res.error); }

    let competitionsDone = res.data && res.data[field];
    competitionsDone = competitionsDone ? competitionsDone : [];

    const index = competitionsDone.findIndex((competition: any) => competition.id === id);
    if (index !== -1) {
      const competitionDone = competitionsDone[index];
      const index2 = competitionDone.questions.findIndex((q: any) => q.id === questionData.id);
      if (index2 !== -1) {
        const questionDone = competitionDone.questions[index2];
        const index3 = questionDone.parts.findIndex((p: any) => p.partId === partId);
        if (index3 !== -1) {
          const partDone = questionDone.parts[index3];
          if (partDone.status !== undefined) {
            switch (questionType) {
              case "MCQ":
                partData.selectedOption = partDone.selectedOption;
                break;
              case "MRQ":
                partData.selectedOptions = partDone.selectedOptions;
                break;
              case "Multiple-Responses":
                partData.savedInputs = partDone.savedInputs;
                break;
              case "Freestyle":
                partData.savedCode = partDone.savedCode;
                break;
            }
          }
        }
      }
    }
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

  let ID = id;
  id  = id.replaceAll("%5E", "^");
  id = id.replace("%5B", "[");
  id = id.replace("%5D", "]");

  let single: boolean = !id.includes("[");
  let prevId: string = "";
  let prevText: string = "";
  let nextId: string = "";
  let nextText: string = "";
  let type, Id, current;

  if (!single) {
    const regex = /(.*)\[(\d+)\-(\d+)\](.*)/;
    const match = id.match(regex);
    if (match) {
      const competition = match[1];
      const competitionInfo = competition.split("-");
      type = competitionInfo[0];
      Id = competitionInfo.slice(1).join("-");
      current = parseInt(match[2]);
      const total = parseInt(match[3]);
      const ids = match[4].split("^");
      if (current < total) {
        nextId = `${competition}[${current+1}-${total}]${ids.join("^")}`
        nextText = "Next question";
      } else {
        nextText = "Submit contest";
      }
      if (current > 1) {
        prevId = `${competition}[${current-1}-${total}]${ids.join("^")}`;
        prevText = "Previous question";
      } else {
        prevId = `${type}/${Id}`;
        prevText = "Go back to start page";
      }
      ID = ids[current-1];
    }
  }
    
  const { data: question, error: err } = await supabase.from("Questions").select(`*`).eq("id", ID);
  if (err) { console.error(err); }
  const questionData = question && question[0];

  if (questionData.purpose !== "general" && single) { 
    return redirect("/problemset");
  }

  questionData.partOfCompetition = single
  ? false
  : {
    type: type === "contest" ? "Contests" : "Tournaments",
    id: Id
  }; // need to retrieve this in the handler

  const color = questionData.difficulty === "Easy" 
    ? "text-green-500" 
    : questionData.difficulty === "Medium" 
    ? "text-yellow-500" 
    : questionData.difficulty === "Hard" 
    ? "text-red-400" 
    : "text-gray-400";

  const thisLink = single 
    ? "/problemset"
    : type === "contest"
    ? "/contests"
    : "/tournaments";
  
  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} />
      <div className="w-full max-w-5xl bg-slate-50 p-3 border-4">
        <div className="text-2xl font-bold min-h-10">Question: {questionData.title}</div>

        <div className="flex flex-row gap-2">
          <div className="text-lg font-medium min-h-10">Difficulty:</div>
          <div className={`text-lg font-medium min-h-10 ${color}`}>{questionData.difficulty}</div>
        </div>

        <div className="text-lg text-gray-500 min-h-10">
          {questionData.content.map((content: any, index: number) => 
            content.category === "text"
            ? <p key={index}>{content.value}</p>
            : placeInCodeBox(content.value, questionData.language)
          )}

          <div className="text-base h-fit text-black p-2">
            {questionData.parts.length === 1 && await handlePart(questionData, questionData.parts[0], true)}
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
        : <></>}
      </div>
      
      {questionData.parts.length > 1 && questionData.parts.map(async (part: any, index: number) =>
        handlePart(questionData, part)
      )}

      {!single &&
        <div className="w-full max-w-5xl flex flex-row justify-between">
        {prevId && 
          <button 
          className="bg-green-300 text-base font-medium p-3 rounded-lg hover:bg-green-400 cursor-pointer hover:font-semibold"
          style={{border: "1px solid black"}}
          >
            <a href={`/questions/${prevId}`}>{prevText}</a>
          </button>
        }
        {nextId &&
          <button 
          className="bg-green-300 text-base font-medium p-3 rounded-lg hover:bg-green-400 cursor-pointer hover:font-semibold"
          style={{border: "1px solid black"}}
          // onClick={() => nextId === ''}
          >
            {nextId
              ? <a href={`/questions/${nextId}`}>{nextText}</a>
              : nextText
            }
          </button>
        }
        </div>
      }
      <br/>
    </div>
  );
}