import Navbar from "@/components/misc/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LeaderboardsPage } from "./LeaderboardsPage";

const thisLink = "/leaderboards";

export default async function ContestsPage() {
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
    sortedByTotalXP.sort((a, b) => {
      const totalXP_A = (a.XP) + (a.tournament_XP) + (a.contest_XP);
      const totalXP_B = (b.XP) + (b.tournament_XP) + (b.contest_XP);
      
      return totalXP_B - totalXP_A;
    });

  }


  
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