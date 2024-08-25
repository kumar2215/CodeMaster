import Navbar from "@/components/misc/navbar";
import placeInCodeBox from "@/components/codeBoxes/CodeBox";
import handler from "@/app/utils/Handlers/handler";
import Pagination from "@/components/misc/pagination";
import ReviewPart from "@/components/misc/reviewPart";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import getUsername from "@/app/utils/Misc/getUsername";

let previewMode: boolean = false;

async function createSupabase() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return [supabase, user];
}

async function handlePart(questionData: any, part: any, singlePart: boolean = false, last: boolean = false) { 
  const [Supabase, User] = await createSupabase();
  const supabase: any = Supabase;
  const user: any = User;
  const username = getUsername(user);

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
  partData.printing = questionData.printing;
  partData.last = last;

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

export default async function Question(
  {params: {id}, searchParams} : 
  {params: {id: string}, 
  searchParams: {user: string, printing: boolean}}
) {
  
  const [Supabase, User] = await createSupabase();
  const supabase: any = Supabase;
  const user: any = User;
  
  if (!user || !supabase) {
    return redirect("/login");
  }

  const username = searchParams.user ? searchParams.user : getUsername(user);
  const printing = searchParams.printing;

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
        nextId = `/questions/${competition}[${current+1}-${totalQuestions}]` + (searchParams.user ? `?user=${username}` : '');
        nextText = "Next question";
      }
      if (current > 1) {
        prevId = `/questions/${competition}[${current-1}-${totalQuestions}]` + (searchParams.user ? `?user=${username}` : '');
        prevText = "Previous question";
      } else {
        prevId = !searchParams.user ? `${type}/${Id}` : `/review/competition?type=${type}&id=${Id}&totalQuestions=${totalQuestions}`;
        prevText = !searchParams.user ? "Go back to start page" : "Go back to review page";
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

  if (!questionData) {
    return redirect("/empty");
  }

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

  questionData.printing = printing;

  if (!single && competitionDone.status === "Completed" && current === totalQuestions) {
    nextId = `/questions/${type}/${Id}`;
    nextText = "Go back to start page";
  }

  if (!single && searchParams.user && current === totalQuestions) {
    nextId = `/review/competition?type=${type}&id=${Id}&totalQuestions=${totalQuestions}`;
    nextText = "Go back to review page";
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
    <div className="flex flex-col items-center flex-1 w-full gap-4 lg:w-full lg:gap-8" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <div id="Question" className={`flex flex-col w-full ${!printing && "gap-4"} p-2 lg:p-0 lg:max-w-5xl`}>
      <div className={`p-3 border-4 ${printing && questionData.parts.length > 1 && "border-b-0"} bg-slate-50`}>
        <div className="text-lg font-bold lg:text-2xl min-h-10">{`Question ${current ? current : ""}: ${questionData.title}`}</div>

        {!questionData.partOfCompetition &&
        <div className="flex flex-row gap-2">
          <div className="text-base font-medium lg:text-lg min-h-10">Difficulty:</div>
          <div className={`text-base lg:text-lg font-medium min-h-10 ${color}`}>{questionData.difficulty}</div>
        </div>}

        <div className="text-base text-gray-500 lg:text-lg min-h-10">
          {questionData.content.map((content: any, index: number) => 
            content.category === "text"
            ? <p key={index}>{content.value}</p>
            : placeInCodeBox(content.value, questionData.language, preferences.codeColorTheme)
          )}

          <div className="text-base text-black lg:p-2 h-fit">
            {questionData.parts.length === 1 && await handlePart(questionData, questionData.parts[0], true)}
          </div>
        </div>

        {questionData.parts.length > 1
        ? questionData.source.link
        ? <div className="text-base font-medium leading-10 lg:text-lg">
          <p>source: 
          <a 
          href={questionData.source.src}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 cursor-pointer hover:text-blue-500 hover:underline"
          >{questionData.source.src}</a>
          </p>
          </div>
        : <div className="text-base font-medium leading-10 lg:text-lg">source: {questionData.source.src}</div>
        : <></>}
      </div>
      
      
      {questionData.parts.length > 1 && questionData.parts.map(async (part: any, index: number) =>
        await handlePart(questionData, part, false, questionData.parts.length-1 === index)
      )}
      </div>

      {/* pagination */}
      {!single && <Pagination paginationData={paginationData} />}
      <br/>
    </div>
  );
}