import Navbar from "@/components/misc/navbar";
import QuestionsTable  from "@/components/tables/questionsTable";
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
  
  const { data: questions, error: err2 } = await supabase
    .from("Questions")
    .select(`*`)
    .eq("type", "Refactoring")
    .eq("purpose", "general")
    .eq("verified", true);
  
  if (err2) { console.error(err2); }
  
  if (questions) { // need to modify this logic // done
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
    <div className="flex flex-col max-w-4xl w-11/12">
      <h2 className="text-2xl font-bold">Refactoring</h2>
      <p className="text-sm leading-7 lg:text-base">
      Refactoring is the process of restructuring existing code without changing its external behavior.
    It is intended to improve the nonfunctional attributes of the software. Refactoring is usually motivated by
    noticing a code smell. In this section, you will be given code snippets that are in need of refactoring. 
    Your task is to identify the code smells and refactor the code to make it more readable and maintainable. 
    Your refactored code should have the same functionality as the original code and is judged upon using a voting system.
    </p>
    </div>
    <div className="w-11/12 lg:w-full flex justify-center ">
     {questions && <QuestionsTable data={questions} />}
    </div>
    <br/>
    </div>
  );
}
