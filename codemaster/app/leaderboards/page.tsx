import Navbar from "@/components/misc/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LeaderboardsTable } from "./LeaderboardsTable";
import { LeaderboardsPage } from "./LeaderboardsPage";

const thisLink = "/leaderboards";

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  //Fetching Users from db
  const { data: userData, error: err } = 
  await supabase
  .from("Users")
  .select('XP, username, tournament_XP, contest_XP')
  .limit(100)

  let sortedByTournamentXP: any[] = []
  let sortedByContestXP: any[]  = []
  let sortedByTotalXP: any[] = []

  if (userData != null) {

    sortedByTournamentXP = [...userData];
    sortedByTournamentXP.sort((a, b) => (b.tournament_XP) - (a.tournament_XP));

    sortedByContestXP = [...userData];
    sortedByContestXP.sort((a, b) => (b.contest_XP) - (a.contest_XP));

    sortedByTotalXP = [...userData];
    sortedByTotalXP.forEach((obj) => {
      obj.total_XP = obj.XP + obj.tournament_XP + obj.contest_XP;
    });
    
    sortedByTotalXP.sort((a, b) => b.total_XP - a.total_XP);

  }
  console.log(sortedByTotalXP)

  if (err) { console.error(err); }

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} />
      <div className="text-xl font-bold w-full">
        <LeaderboardsPage sortedByTournamentXP={sortedByTournamentXP} sortedByContestXP={sortedByContestXP} sortedByTotalXP={sortedByTotalXP}/>
      </div>
    </div>
  );
}