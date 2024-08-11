import Navbar from "@/components/misc/navbar";
import TournamentsTable from "@/components/tables/TournamentsTable";
import checkInUser from "@/app/utils/Misc/checkInUser";
const thisLink = "/tournaments";

export default async function TournamentsPage() {
  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }
  
  const preferences = userData.preferences;
  const tournamentsDoneByUser = userData.tournaments_done;
  const tournamentsIdsDoneByUser = tournamentsDoneByUser && tournamentsDoneByUser.map((tournament: { id: any; }) => tournament.id);

  const res = await supabase.from("Tournaments").select("*");
  if (res.error) { console.error(res.error) }
  let tournaments: any = res.data;

  tournaments = tournaments.filter((tournament: any) => tournament.verified_by !== null && tournament.password !== null);

  if (tournaments) {
    for (let i = 0; i < tournaments.length; i++) {
      if (tournamentsIdsDoneByUser && tournamentsIdsDoneByUser.includes(tournaments[i].id)) {
        const tournament = tournamentsDoneByUser[tournamentsIdsDoneByUser.indexOf(tournaments[i].id)];
        tournaments[i].status = tournament.status;
        tournaments[i].points = tournament.pointsAccumulated 
          ? `${tournament.pointsAccumulated}/${tournaments[i].points}` 
          : tournaments[i].points;
      } else {
        tournaments[i].status = "Not Attempted";
      }
    }
  }

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-5 lg:gap-10" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <div className="flex flex-col w-full max-w-4xl gap-5 p-2 lg:p-0 lg:gap-10">
        <div className="flex flex-row text-xl font-bold text-left lg:text-3xl">
          Tournaments
        </div>
        <TournamentsTable tournaments={tournaments} />
      </div>
      <br/>
    </div>
  );
}
