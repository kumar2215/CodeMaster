import Navbar from "@/components/misc/navbar";
import placeInCodeBox from "@/components/codeBoxes/CodeBox";
import handler from "@/app/utils/Handlers/handler";
import Pagination from "@/components/misc/pagination";
import ReviewPart from "@/components/misc/reviewPart";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

let previewMode: boolean = false;

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

  partData.partOfCompetition = questionData.partOfCompetition;

  if (partData.review) {
    const commentId = partData.review.commentId;
    const {data: comment, error: err} = await supabase.from("Comments").select(`*`).eq("id", commentId).single();
    if (err) {
      console.error(err);
      return;
    }
    partData.review.content = comment && comment.content;
    partData.review.written_by = comment && comment.written_by;
    partData.review.created_at = comment && comment.created_at;
    delete partData.review.commentId;
  }

  return (
    <div>
      {handler(questionType, partData, username)}
      {previewMode && <ReviewPart username={username} partData={partData} questionType={questionType} />}
    </div>
  );
}

export default async function Question({params: {id}}: {params: {id: string}}) {
  
  const [Supabase, User] = await createSupabase();
  const supabase: any = Supabase;
  const user: any = User;
  
  if (!user || !supabase) {
    return redirect("/login");
  }

  const username = user.user_metadata.username;

  let ID = id;
  id = id.replace("%5B", "[");
  id = id.replace("%5D", "]");

  let single: boolean = !id.includes("[");
  let prevId: string = "";
  let prevText: string = "";
  let nextId: string = "";
  let nextText: string = "";
  let type: any, Id: any, current: any, totalQuestions: any;
  let reviewed: boolean = false;
  let password: string | null = null;

  if (!single) {
    const regex = /(.*)\[(\d+)\-(\d+)\]/;
    const match = id.match(regex);
    if (match) {
      const competition = match[1];
      const competitionInfo = competition.split("-");
      type = competitionInfo[0];
      Id = competitionInfo.slice(1).join("-");
      current = parseInt(match[2]);
      totalQuestions = parseInt(match[3]);
      if (current < totalQuestions) {
        nextId = `${competition}[${current+1}-${totalQuestions}]`
        nextText = "Next question";
      }
      if (current > 1) {
        prevId = `${competition}[${current-1}-${totalQuestions}]`;
        prevText = "Previous question";
      } else {
        prevId = `${type}/${Id}`;
        prevText = "Go back to start page";
      }
      const table = type === "contest" ? "Contests" : "Tournaments";
      const { data: competitionData, error: err } = await supabase.from(table).select(`*`).eq("id", Id).single();
      if (err) { console.error(err); }
      const questions = competitionData && competitionData.questions;
      if (questions) {
        ID = questions[current-1];
      }
      if (type === "tournament") {
        previewMode = competitionData.verified_by === null;
        reviewed = competitionData.reviewed;
        password = competitionData.password;
      }
    }
  }
    
  const { data: questionData, error: err } = await supabase.from("Questions").select(`*`).eq("id", ID).single();
  if (err) { console.error(err); }

  // prevent users from accessing questions that are not part of a competition
  if (questionData === null || (questionData.purpose !== "general" && single)) { 
    return redirect("/problemset");
  }

  if (single) previewMode = !questionData.verified;

  const res = await supabase.from("Users").select(`*`).eq("username", username).single();
  if (res.error) { console.error(res.error); }

  // prevent users from accessing questions that are not published yet
  const user_type = res.data && res.data.user_type;
  const created_by = questionData.created_by;
  if (previewMode && !(user_type.includes("admin") || username === created_by)) {
    return redirect("/problemset");
  }

  const preferences = res.data && res.data.preferences;

  let competitionsDone: any;
  if (type === "contest") {
    competitionsDone = res.data && res.data.contests_done;
  } else if (type === "tournament") {
    competitionsDone = res.data && res.data.tournaments_done;
  }

  competitionsDone = competitionsDone ? competitionsDone : [];
  const index = competitionsDone.findIndex((competition: any) => competition.id === Id);
  const competitionDone = index !== -1 ? competitionsDone[index] : {};

  questionData.partOfCompetition = single
  ? false
  : {
    type: type === "contest" ? "Contests" : "Tournaments",
    id: Id,
    questionNumber: current,
    totalQuestions,
    data: (competitionDone.questions && competitionDone.questions[current-1]) || {},
    status: competitionDone.status || "Not Attempted",
    verified: !previewMode,
  };

  if (!single && competitionDone.status === "Completed" && current === totalQuestions) {
    nextId = `${type}/${Id}`;
    nextText = "Go back to start page";
  }

  const paginationData = {
    type,
    id: Id,
    username,
    prevId,
    prevText,
    nextId,
    nextText
  };

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
    <div className="flex flex-col items-center flex-1 w-full gap-8" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <div className="w-full max-w-5xl p-3 border-4 bg-slate-50">
        <div className="text-2xl font-bold min-h-10">{`Question ${current ? current : ""}: ${questionData.title}`}</div>

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

          <div className="p-2 text-base text-black h-fit">
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
          className="px-2 cursor-pointer hover:text-blue-500 hover:underline"
          >{questionData.source.src}</a>
          </p>
          </div>
        : <div className="text-lg font-medium leading-10">source: {questionData.source.src}</div>
        : <></>}
      </div>
      
      {questionData.parts.length > 1 && questionData.parts.map(async (part: any, index: number) =>
        await handlePart(questionData, part)
      )}

      {/* pagination */}
      {!single && <Pagination paginationData={paginationData} />}
      <br/>
    </div>
  );
}