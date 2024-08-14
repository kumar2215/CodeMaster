import Navbar from "@/components/misc/navbar";
import QuestionsTableWithVoting  from "@/components/tables/QuestionsTableWithVoting";
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
  
  const { data: questions, error: err } = await supabase
    .from("Questions")
    .select(`*`)
    .eq("type", "Refactoring")
    .eq("purpose", "general")
    .eq("verified", true);
  
  if (err) { console.error(err); }

  await Promise.all(questions.map(async (question: any) => {
    const freestyle_id = question.parts[0].part_id;
    const { data, error } = await supabase
      .from("Freestyle")
      .select(`*`)
      .eq("id", freestyle_id)
      .single();
    
    if (error) { console.error(error); }
    question.voting_status = new Date().getTime() > new Date(data.voting_deadline).getTime() ? "Closed" : "Open";
    question.voting_deadline = new Date(data.voting_deadline).getTime();
    question.freestyle_id = freestyle_id;
    question.voted_alr = data.voters.includes(userData.username);
  }));
  
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
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
    <Navbar thisLink={thisLink} style={preferences.header} />
    <div className="flex flex-col max-w-4xl gap-6 p-4 mx-auto lg:p-0">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold lg:text-2xl">Refactoring</h2>
        <p className="text-sm leading-7 lg:text-base">
          Refactoring is the process of restructuring existing code without changing its external behavior.
          It is intended to improve the nonfunctional attributes of the software. In this section, you will be 
          given code snippets to refactor. You can refactor the code in any way you want but it can only be submitted
          if it passes the test cases. Your refactored code should have the same functionality as the original code 
          and is judged upon using a voting system. Each user can only vote once for each question and is rewarded
          5 XP for it. The voting deadline is 1 week after the question is posted. Users can submit as many refactored
          versions as they want for each question.
        </p>
      </div>
      {questions && <QuestionsTableWithVoting data={questions}/>}
      <br/>
    </div>
    </div>
  );
}
