import Navbar from "@/components/misc/navbar";
import checkInUser from "@/app/utils/Misc/checkInUser";
import LeaderboardsPage from "@/components/pages/LeaderboardsPage";

const thisLink = "/leaderboards";

export default async function ContestsPage() {
  
  const [supabase, user] = await checkInUser();
  if (supabase === null) {
    console.error(user);
    return;
  }

  const preferences = user.preferences;

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
    sortedByContestXP = [...userData];
    sortedByTotalXP = [...userData];
    sortedByTotalXP.forEach((obj) => {
      obj.total_XP = obj.XP + obj.tournament_XP + obj.contest_XP;
    });
    
  }

  if (err) { console.error(err); }

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <div className="w-full text-xl font-bold">
        <LeaderboardsPage sortedByTournamentXP={sortedByTournamentXP} sortedByContestXP={sortedByContestXP} sortedByTotalXP={sortedByTotalXP}/>
      </div>
    </div>
  );
}