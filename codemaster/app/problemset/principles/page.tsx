import Navbar from "@/components/misc/navbar";
import QuestionsTable  from "@/components/misc/questionsTable";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const thisLink = "/problemset";

export default async function Debugging() {
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
  
  const { data: questions, error: err2 } = await supabase.from("Questions").select(`*`).eq("type", "Code Principles");
  if (err2) { console.error(err2); }
  
  if (questions) {
    for (let i = 0; i < questions.length; i++) {
      if (questionIdsDoneByUser && questionIdsDoneByUser.includes(questions[i].id)) {
        const question = questionsDoneByUser[questionIdsDoneByUser.indexOf(questions[i].id)];
        questions[i].status = question.status;
        questions[i].points = `${question.pointsAccumulated}/${questions[i].points}`;
      } else {
        questions[i].status = "Not Attempted";
      }
    }
  }
  
  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
    <Navbar thisLink={thisLink} />
    <div className="grid grid-rows-2 max-w-4xl max-h-24">
    <h2 className="text-2xl font-bold">Good Code Principles</h2>
    <p className="text-base leading-7">
    Good code principles are a set of guidelines that help developers write clean, maintainable, and efficient code. 
    By following these principles, developers can create code that is easy to read, understand, and modify. 
    In this section, you will learn about some of the most important code principles and how to apply them in your own projects.
    </p>
    </div>
    <h2 className="max-h-3 leading-3"/>
    {questions && <QuestionsTable data={questions} />}
    <br/>
    </div>
  );
}
