import checkInUser from "@/app/utils/Misc/checkInUser";
import Navbar from "@/components/misc/navbar";
import QuestionReviewTable from "@/components/tables/QuestionsReviewTable";
import CompetitionReviewTable from "@/components/tables/CompetitionsReviewTable";

export default async function ReviewPage() {

  const thisLink = "/others";

  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.log(userData);
    return;
  }

  const username = userData.username;
  const user_type = userData.user_type;
  const preferences = userData.preferences;

  const res = await supabase.from("Questions").select("*").eq("created_by", username);
  if (res.error) { 
    console.error(res.error);
  }

  const questionsCreatedByUser = res.data.filter((question: any) => question.purpose === "general" && question.verified);
  
  const res2 = await supabase.from("Tournaments").select("*").eq("created_by", username);
  if (res2.error) { 
    console.error(res2.error);
  }

  const tournamentsCreatedByUser = res2.data.filter(
    (tournament: any) => tournament.verified_by !== null && tournament.password !== null
  );

  const res3 = await supabase.from("Contests").select("*").eq("created_by", username);
  if (res3.error) {
    console.error(res3.error);
  }

  const contestsCreatedByUser = res3.data;

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-5 lg:gap-10" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <div className="flex flex-col w-full max-w-4xl gap-5 p-2 lg:p-0 lg:gap-10">
        
        <div className="flex flex-col gap-5">
          <h1 className="flex flex-row text-xl font-bold text-left lg:text-3xl">
            Questions
          </h1>
          <QuestionReviewTable questions={questionsCreatedByUser} />
        </div>

        {user_type.includes("admin") || user_type.includes("verified") &&
        <div className="flex flex-col gap-5">
          <h1 className="flex flex-row text-xl font-bold text-left lg:text-3xl">
            Tournaments
          </h1>
          <CompetitionReviewTable competitions={tournamentsCreatedByUser} type={"tournament"}/>
        </div>}

        {user_type.includes("admin") &&
        <div className="flex flex-col gap-5">
          <h1 className="flex flex-row text-xl font-bold text-left lg:text-3xl">
            Contests
          </h1>
          <CompetitionReviewTable competitions={contestsCreatedByUser} type={"contest"} />
        </div>}
        
      </div>
      <br/>
    </div>
  );

}
