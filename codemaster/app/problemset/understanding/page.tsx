import Navbar from "../../utils/navbar";
import React from 'react';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link  from "next/link";
import completedLogo from "../../../assets/completed-mark.jpg"
import attemptedLogo from "../../../assets/attempted-mark.jpg"

const thisLink = "/problemset";

function table(questions: any[]) {
  return (
    <div className="flex flex-col w-full max-w-4xl border-2 border-gray-400">
      <div
      style={{
        display: 'grid',
        gridTemplateColumns: '0.8fr 6.5fr 1.2fr 1.1fr',
        width: '100%',
        maxWidth: '56rem',
        minHeight: '2rem',
        lineHeight: '2rem',
        textAlign: 'center',
        alignItems: 'center',
        fontSize: '1rem',
        fontWeight: '600',
        backgroundColor: '#f0f0f0'
      }}>
        <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>Status</div>
        <div style={{ borderRight: '1px solid rgb(156 163 175)', textAlign: 'left', paddingLeft: '1rem'}}>Title</div>
        <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>Difficulty</div>
        <div>Points</div>
      </div>
      
      {questions.map((entry, index) => {
        const color = entry.difficulty === "Easy" 
          ? "text-green-500" 
          : entry.difficulty === "Medium" 
          ? "text-yellow-500" 
          : entry.difficulty === "Hard" 
          ? "text-red-400" 
          : "text-gray-400";
        const link = `/questions/${entry.id}`;
        return <div
        key={index}
        style={{
          display: 'grid',
          gridTemplateColumns: '0.8fr 6.5fr 1.2fr 1.1fr',
          width: '100%',
          maxWidth: '56rem',
          minHeight: '2rem',
          lineHeight: '2rem',
          textAlign: 'center',
          alignItems: 'center',
          fontSize: '0.875rem',
          fontWeight: '400',
          backgroundColor: 'white',
          borderTop: '1px solid rgb(156 163 175)'
        }}>
          <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>
            {entry.status === "Completed" 
            ? <img src={completedLogo.src} alt="Completed" width={0.6 * completedLogo.width}/>
            : entry.status === "Attempted" 
            ? <img src={attemptedLogo.src} alt="Attempted" width={0.6 * attemptedLogo.width}/>
            : <div className="text-gray-400">-</div>
          }</div>
          <div 
          className="hover:text-blue-500 hover:leading-8 hover:font-medium cursor-pointer"
          style={{ 
            borderRight: '1px solid rgb(156 163 175)', 
            textAlign: 'left', 
            paddingLeft: '1rem'
            }}>
            <Link href={link}>{entry.title}</Link>
          </div>
          <div style={{ borderRight: '1px solid rgb(156 163 175)', fontWeight: "600" }}>{
            <div className={color}>{entry.difficulty}</div>
          }</div>
          <div>{entry.points}</div>
        </div>
      })}
    </div>
  );
};

export default async function CodeUnderstanding() {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/login");
  }
  
  const { data: userData, error: err } = 
  await supabase
  .from("Users")
  .select(`*`)
  .eq("username", user.user_metadata.username);
  
  if (err) { console.error(err); }
  const questionsDoneByUser = userData && userData[0].questions_done;
  const questionIdsDoneByUser = questionsDoneByUser && questionsDoneByUser.map((question: { id: any; }) => question.id);
  
  const { data: questions, error: err2 } = await supabase.from("Questions").select(`*`).eq("type", "Code Understanding");
  if (err2) { console.error(err2); }

  if (questions) {
    for (let i = 0; i < questions.length; i++) {
      if (questionIdsDoneByUser && questionIdsDoneByUser.includes(questions[i].id)) {
        const question = questionsDoneByUser[questionIdsDoneByUser.indexOf(questions[i].id)];
        questions[i].status = question.status;
        questions[i].points = question.points;
      } else {
        questions[i].status = "Not Attempted";
      }
    }
  }
  
  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
    {Navbar(thisLink)}
    <div className="grid grid-rows-2 max-w-4xl max-h-24">
    <h2 className="text-2xl font-bold">Code Understanding</h2>
    <p className="text-base leading-7">
    Code understanding is the ability to read and comprehend code. It is a
    crucial skill for any programmer, as it allows you to understand how
    existing code works and make changes to it. In this section, the programming 
    problems provided require you to read and understand code snippets.
    </p>
    </div>
    <h2 className="max-h-3 leading-3"/>
    {questions && table(questions)}
    </div>
  );
}