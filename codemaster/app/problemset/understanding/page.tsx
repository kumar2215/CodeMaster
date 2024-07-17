import Navbar from "@/components/misc/navbar";
import QuestionsTable  from "@/components/tables/questionsTable";
import checkInUser from "@/app/utils/Misc/checkInUser";

const thisLink = "/problemset";

export default async function CodeUnderstanding() {
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
    .eq("type", "Code Understanding")
    .eq("purpose", "general")
    .eq("verified", true);
  
  if (err2) { console.error(err2); }

  if (questions) { // need to modify this logic
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
    <h2 className="text-2xl font-bold">Code Understanding</h2>
    <p className="text-base leading-7">
    Code understanding is the ability to read and comprehend code. It is a
    crucial skill for any programmer, as it allows you to understand how
    existing code works and make changes to it. In this section, the programming 
    problems provided require you to read and understand code snippets.
    </p>
    </div>
    <h2 className="leading-3 max-h-3"/>
    {questions && <QuestionsTable data={questions} />}
    <br/>
    </div>
  );
}