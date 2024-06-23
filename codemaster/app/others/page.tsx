import Navbar from "@/components/misc/navbar";
import topicCard from "@/components/misc/topicCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import contestIcon from "@/assets/contest-icon.jpg";
import tournamentIcon from "@/assets/tournament-icon.jpg";
import problemsetIcon from "@/assets/problem-solving-icon.jpg";

const thisLink = "/others";


export default async function OthersPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: userData, error: err } = await supabase
    .from("Users")
    .select(`*`)
    .eq("username", user.user_metadata.username);

  if (err) { console.error(err); }

  const user_type: string = userData && userData[0].user_type;

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} />
      <div className="w-full max-w-4xl flex flex-col gap-2">
        <div className="w-full mb-2" style={{borderBottom: "1px solid black"}}>
          <h1 className="text-xl font-bold mb-2">Notifications</h1>
        </div>
        <h1>You have no notifications so far.</h1> {/* placeholder for now */}

        {Array.from({length: 5}).map(x => <br/>)}

        <div className="w-full flex flex-col gap-8">
          <div className="w-full mb-2" style={{borderBottom: "1px solid black"}}>
            <h1 className="text-xl font-bold mb-2">Create</h1>
          </div>

          {topicCard("Create a question", "/others/createQuestion", problemsetIcon)}

          {(user_type.includes("admin") || user_type.includes("verified"))  && topicCard("Create a tournament", "/others/createTournament", tournamentIcon)}

          {user_type.includes("admin") && topicCard("Create a contest", "/others/createContest", contestIcon)}
        </div>

        <br />

      </div>
    </div>
  );
}