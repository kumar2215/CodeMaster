import Navbar from "@/components/misc/navbar";
import ContestsTable from "@/components/tables/ContestsTable";
import checkInUser from "@/app/utils/Misc/checkInUser";

const thisLink = "/contests";

export default async function ContestsPage() {

  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }
  
  const preferences = userData.preferences;
  const contestsDoneByUser = userData.contests_done;
  const contestsIdsDoneByUser = contestsDoneByUser && contestsDoneByUser.map((contest: { id: any; }) => contest.id);

  const res = await supabase.from("Contests").select("*");
  if (res.error) { console.error(res.error) }
  const contests: any = res.data;

  if (contests) {
    for (let i = 0; i < contests.length; i++) {
      if (contestsIdsDoneByUser && contestsIdsDoneByUser.includes(contests[i].id)) {
        const contest = contestsDoneByUser[contestsIdsDoneByUser.indexOf(contests[i].id)];
        contests[i].status = contest.status;
        contests[i].points = contest.pointsAccumulated 
          ? `${contest.pointsAccumulated}/${contests[i].points}` 
          : contests[i].points;
      } else {
        contests[i].status = "Not Attempted";
      }
    }
  }

  return (
      <div className="flex flex-col items-center flex-1 w-full gap-5 lg:gap-10" style={preferences.body}>
        <Navbar thisLink={thisLink} style={preferences.header} />
        <div className="flex flex-col w-full max-w-4xl gap-5 p-2 lg:p-0 lg:gap-10">
          <div className="flex flex-row text-xl font-bold text-left lg:text-3xl">
            Contests
          </div>
          <ContestsTable contests={contests} />
        </div>
        <br/>
      </div>
  );
}