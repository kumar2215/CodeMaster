import checkInUser from "@/app/utils/Misc/checkInUser";
import Navbar from "@/components/misc/navbar";
import LeaderboardsTable from "@/components/tables/LeaderboardsTable";
import { redirect } from "next/navigation";

export default async function CompetitionReviewPage(
  { searchParams } : { searchParams: { id: string, type: string, totalQuestions: string } }) {

  const [supabase, userData] = await checkInUser();
  if (supabase == null) { 
    console.error(userData);
    return;
  }

  const thisLink = "/others";
  const preferences = userData.preferences || {};
  const { type, id, totalQuestions } = searchParams;
  const table = searchParams.type === "tournament" ? "Tournaments" : "Contests";

  const res = await supabase.from(table).select("*").eq("id", id).single();
  if (res.error) {
    console.error(res.error);
  }

  const competitionData = res.data;
  if (!competitionData) {
    redirect("/empty");
  }

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-5 lg:gap-10" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <div className="flex flex-col w-full gap-5 p-2 lg:p-0 lg:gap-10">
        
        <h1 className="flex flex-row justify-center text-xl font-semibold lg:text-3xl">
          {`Leaderboard for ${competitionData.name}`}
        </h1>
        
        <LeaderboardsTable 
        data={competitionData.users_completed} xpType="pointsAccumulated" 
        header="XP" link={`/questions/${type}-${id}[1-${totalQuestions}]`} />
        
      </div>
      <br/>
    </div>
  );

}