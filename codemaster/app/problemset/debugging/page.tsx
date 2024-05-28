import Navbar from "@/components/misc/navbar";
import Table  from "@/components/misc/questionsTable";
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
  
  const { data: questions, error: err2 } = await supabase.from("Questions").select(`*`).eq("type", "Debugging");
  if (err2) { console.error(err2); }
  
  if (questions) { // need to modify this logic
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
    <h2 className="text-2xl font-bold">Debugging</h2>
    <p className="text-base leading-7">
    Debugging is the process of finding and fixing errors in a computer
    program. It is a crucial step in the development process, as even small
    errors can cause a program to behave unexpectedly or crash. In this
    section, the programming problems provided are code snippets that
    contain bugs and require you to identify and fix the bugs in the
    code to make the program work correctly.
    </p>
    </div>
    <h2 className="max-h-3 leading-3"/>
    {questions && <Table data={questions} />}
    </div>
  );
}
