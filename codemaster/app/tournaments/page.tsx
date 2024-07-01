import Navbar from "@/components/misc/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TournamentsTable from "@/components/tables/tournamentsTable";
const thisLink = "/tournaments";

export default async function TournamentsPage() {
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
  
  const tournamentsDoneByUser = userData && userData[0].tournaments_done;
  const tournamentsIdsDoneByUser = tournamentsDoneByUser && tournamentsDoneByUser.map((tournament: { id: any; }) => tournament.id);

  const res = await supabase.from("Tournaments").select("*");
  if (res.error) { console.error(res.error) }
  let tournaments: any = res.data;

  tournaments = tournaments.filter((tournament: any) => tournament.verified_by !== null && Date.now() <= new Date(tournament.deadline).getTime())

  if (tournaments) {
    for (let i = 0; i < tournaments.length; i++) {
      if (tournamentsIdsDoneByUser && tournamentsIdsDoneByUser.includes(tournaments[i].id)) {
        const tournament = tournamentsDoneByUser[tournamentsIdsDoneByUser.indexOf(tournaments[i].id)];
        tournaments[i].status = tournament.status ? tournament.status : "Not Attempted";
        tournaments[i].points = tournament.pointsAccumulated 
          ? `${tournament.pointsAccumulated}/${tournaments[i].points}` 
          : tournaments[i].points;
      } else {
        tournaments[i].status = "Not Attempted";
      }
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
        <Navbar thisLink={thisLink}/>
        <div className="w-full max-w-4xl flex flex-row text-3xl text-left font-bold">
          Tournaments
        </div>
        <TournamentsTable tournaments={tournaments} />
        <br/>
      </div>
  );
}
