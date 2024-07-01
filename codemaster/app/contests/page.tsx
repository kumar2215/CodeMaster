import Navbar from "@/components/misc/navbar";
import ContestsTable from "@/components/tables/contestsTable";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const thisLink = "/contests";

export default async function ContestsPage() {
  const supabase = createClient();

  const {
    data: {user},
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
  
  const contestsDoneByUser = userData && userData[0].contests_done;
  const contestsIdsDoneByUser = contestsDoneByUser && contestsDoneByUser.map((contest: { id: any; }) => contest.id);

  const res = await supabase.from("Contests").select("*");
  if (res.error) { console.error(res.error) }
  const contests: any = res.data;

  if (contests) {
    for (let i = 0; i < contests.length; i++) {
      if (contestsIdsDoneByUser && contestsIdsDoneByUser.includes(contests[i].id)) {
        const contest = contestsDoneByUser[contestsIdsDoneByUser.indexOf(contests[i].id)];
        contests[i].status = contest.status ? contest.status : "Not Attempted";
        contests[i].points = contest.pointsAccumulated 
          ? `${contest.pointsAccumulated}/${contests[i].points}` 
          : contests[i].points;
      } else {
        contests[i].status = "Not Attempted";
      }
    }
  }

  return (
      <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
        <Navbar thisLink={thisLink}/>
        <div className="w-full max-w-4xl flex flex-row text-3xl text-left font-bold">
          Contests
        </div>
        <ContestsTable contests={contests} />
        <br/>
      </div>
  );
}