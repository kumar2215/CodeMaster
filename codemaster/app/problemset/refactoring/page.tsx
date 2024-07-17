import Navbar from "@/components/misc/navbar";
import QuestionsTable  from "@/components/tables/questionsTable";
import checkInUser from "@/app/utils/Misc/checkInUser";

const thisLink = "/problemset";

export default async function Debugging() {
  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }

  const preferences = userData.preferences;
  const questionsDoneByUser = userData.questions_done;
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
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
    <Navbar thisLink={thisLink} style={preferences.header} />
    <div className="grid max-w-4xl grid-rows-2 max-h-24">
    <h2 className="text-2xl font-bold">Refactoring</h2>
    <p className="text-base leading-7">
    Refactoring is the process of restructuring existing code without changing its external behavior.
    It is intended to improve the nonfunctional attributes of the software. Refactoring is usually motivated by
    noticing a code smell. In this section, you will be given code snippets that are in need of refactoring. 
    Your task is to identify the code smells and refactor the code to make it more readable and maintainable. 
    Your refactored code should have the same functionality as the original code and is judged upon using a voting system.
    </p>
    </div>
    <h2 className="pt-8 leading-3 max-h-3"/>
    {questions && <QuestionsTable data={questions} />}
    <br/>
    </div>
  );
}
