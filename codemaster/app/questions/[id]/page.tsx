import Navbar from "../../../components/misc/navbar";
import placeInCodeBox from "@/components/codeBoxes/codeBox";
import CodeEditor from "@/components/codeBoxes/CodeEditor";
import MCQ from "@/components/questionTemplates/MCQ";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const thisLink = "/problemset";

async function Supabase() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return [supabase, user];
}

function handleMultipleResponses(questionPart: any, inputs: any[]) {
  const part: string = questionPart.part;
  const question: string = questionPart.question;
  const format: string[] = questionPart.format;
  const points: number[] = questionPart.points;
  
  return (
    <div className="w-full max-w-5xl flex flex-col bg-slate-50 p-3 border-4">
      <div className="flex flex-row p-2">
        <span className="text-lg font-bold pr-2">{`(${part})`}</span>
        <p className="text-lg font-medium">{question}</p>
      </div>
      <div 
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${format.length+1}, 1fr)`,
        paddingLeft: "2rem",
        paddingRight: "2rem"
      }}
      >
        {format.map((header: string, index: number) => (
          <div key={index} 
          className="flex flex-row justify-center text-lg font-bold"
          style={{
            border: "2px solid black", 
            borderRight: index === format.length ? "2px solid black" : "none", 
          }}
          >
            {header}
          </div>
        ))}
        <div 
        className="flex flex-row justify-center text-lg font-bold"
        style={{border: "2px solid black", borderRight: "2px solid black"}}
        >expected</div>
      </div>
      <div
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${inputs.length}, 1fr)`,
        paddingLeft: "2rem",
        paddingRight: "2rem"
      }}
      >
      {inputs.map((input: any, idx: number) => {
       return (
        <div
        key={idx}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${format.length+1}, 1fr)`,
        }}
        >
          {Object.values(input).slice(0, format.length).map((value: any, idx2: number) => (
            <div key={idx2} 
            className="flex flex-row justify-center text-lg font-medium" 
            style={{
              border: "2px solid black",
              borderRight: idx2 === format.length ? "2px solid black" : "none",
              borderBottom: idx === inputs.length-1 ? "2px solid black" : "none",
              borderTop: idx === 0 ? "none" : "2px solid black",
            }}>
              {typeof value === "object" ? JSON.stringify(value).split(",").join(", ") : value}
            </div>
          ))}
          <div 
          key={idx}
          style={{
            border: "2px solid black", 
            borderBottom: idx === inputs.length ? "none" : "2px solid black", 
            borderTop: "none"}}
          >
            <input 
            className="w-full h-full bg-gray-200 text-lg text-center font-medium"
            placeholder={`[${points[idx]} points]`}
            >
            </input>
          </div>
        </div>
       )
      })}
      </div>
      <div className="flex flex-row justify-between p-2 pl-4 m-2 mb-0">
        <button className="text-lg font-medium bg-blue-500 text-white p-2 rounded-lg">Submit</button> 
        <span className="text-lg font-medium pr-5 pt-2">{`[${points.reduce((a: number, b: number) => a + b, 0)} points]`}</span>
      </div>
    </div>
  );
}

async function handleMCQ(questionPart: any, questionId: string, partId: string) {
  const part: string = questionPart.part;
  const question: string = questionPart.question;
  const options: string[] = questionPart.options;
  const expected: string = questionPart.expected;
  let points: number = questionPart.points;

  const [supabase, user] = await Supabase() as [SupabaseClient<any, "public", any>, User];
  const res = await supabase.from("Users").select("*").eq("email", user.email);
  if (res.error) { console.error(res.error); }

  const questionsDone = res.data && res.data[0].questions_done;
  if (questionsDone) {
    const index = questionsDone.findIndex((question: any) => question.id === questionId && question.part === part);
    if (index !== -1) {
      const questionDone = questionsDone[index];
      if (questionDone.status === "Correct") {
        points = 0;
      } else {
        points = Math.pow(0.75, questionDone.attempts) * points;
        if (points >= 1) {
          points = Math.floor(points);
        } else {
          points = 0;
          questionDone.status = "Too many wrong attempts";
          questionsDone[index] = questionDone;
          const res2 = await supabase.from("Users").update({questions_done: questionsDone}).eq("email", user.email);
          if (res2.error) { console.error(res2.error); }
        }
      }
    }
  }

  const data = {
    questionId: questionId,
    partId: partId,
    userEmail: user.email,
    question: question,
    part: part,
    options: options,
    points: points,
    expected: expected,
  }

  return (<MCQ data={data} />);
}

export default async function Question({params: {id}}: {params: {id: string}}) {

  const [supabase, user] = await Supabase() as [SupabaseClient<any, "public", any>, User];

  if (!user || !supabase) {
    return redirect("/login");
  }

  const { data: question, error: err } = await supabase.from("Questions").select(`*`).eq("id", id);
  if (err) { console.error(err); }
  const questionData = question && question[0];

  // testing actual links
  // questionData.source = {
  //   link: true,
  //   src: "https://leetcode.com/problems/maximum-product-of-three-numbers/"
  // }

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      {Navbar(thisLink)}
      <div className="w-full max-w-5xl bg-slate-50 p-3 border-4">
        <div className="text-2xl font-bold min-h-10">Question: {questionData.title}</div>
        <div className="text-lg text-gray-500 min-h-10">{questionData.context}</div>
        {questionData.parts.length === 1 && questionData.parts[0].type === "Freestyle"
        ? <CodeEditor codeData={questionData.code} language={questionData.language} />
        : placeInCodeBox(questionData.code, questionData.language)}
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
          case "Multiple-Responses":
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
            return handleMultipleResponses(partData, inputs);
          case "MCQ":
            return handleMCQ(partData, id, partId);
        }
      })}
      <br />
    </div>
  );
}