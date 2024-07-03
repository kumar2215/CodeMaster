import Navbar from "@/components/misc/navbar";
import topicCard from "@/components/misc/topicCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import contestIcon from "@/assets/contest-icon.jpg";
import tournamentIcon from "@/assets/tournament-icon.jpg";
import problemsetIcon from "@/assets/problem-solving-icon.jpg";

const thisLink = "/profile";

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const username = user.user_metadata.username;

  const { data: userData, error: err } = await supabase
    .from("Users")
    .select(`*`)
    .eq("username", username)
    .single();

  if (err) { console.error(err); }

  const user_type: string = userData.user_type;
  const general_XP:  number = userData.XP;
  const contest_XP: number = userData.contest_XP;
  const tournament_XP: number = userData.tournament_XP;
  const total_XP: number = general_XP + contest_XP + tournament_XP;

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} />
      <div className="w-full max-w-4xl flex flex-col gap-2">

        <div className="w-full flex flex-row gap-40">
          <span className="w-60 h-60 rounded-full overflow-hidden border-2">
              <img src={`https://api.dicebear.com/8.x/personas/svg?seed=${username}`} alt="avatar"
                    className="h-full w-full rounded-full object-cover"/>
          </span>

          <div className="w-full flex flex-col mt-4 gap-2">

            <div className="w-full flex flex-row gap-2">
              <h1 className="text-xl font-bold">Username:</h1>
              <h1 className="text-xl">{username}</h1>
            </div>

            <div className="w-full flex flex-row gap-2">
              <h1 className="text-xl font-bold">Total XP:</h1>
              <h1 className="text-xl">{total_XP}</h1>
            </div>
            
            <div className="w-full flex flex-row gap-2">
              <h1 className="text-xl font-bold">Problems done:</h1>
              <h1 className="text-xl">{userData.questions_done ? userData.questions_done.length : 0}</h1>
            </div>

            <div className="w-full flex flex-row gap-2">
              <h1 className="text-xl font-bold">Contests done:</h1>
              <h1 className="text-xl">{userData.contests_done ? userData.contests_done.length : 0}</h1>
            </div>

            <div className="w-full flex flex-row gap-2">
              <h1 className="text-xl font-bold">Contest XP:</h1>
              <h1 className="text-xl">{contest_XP}</h1>
            </div>

            <div className="w-full flex flex-row gap-2">
              <h1 className="text-xl font-bold">Tournaments done:</h1>
              <h1 className="text-xl">{userData.tournaments_done ? userData.tournaments_done.length : 0}</h1>
            </div>

            <div className="w-full flex flex-row gap-2">
              <h1 className="text-xl font-bold">Tournament XP:</h1>
              <h1 className="text-xl">{tournament_XP}</h1>
            </div>

          </div>
        </div>

        {Array.from({length: 2}).map(x => <br/>)}

        <div className="w-full mb-2" style={{borderBottom: "1px solid black"}}>
          <h1 className="text-xl font-bold mb-2">Notifications</h1>
        </div>
        <h1>You have no notifications so far.</h1> {/* placeholder for now */}

        {Array.from({length: 5}).map(x => <br/>)}

        <div className="w-full flex flex-col gap-8">
          <div className="w-full mb-2" style={{borderBottom: "1px solid black"}}>
            <h1 className="text-xl font-bold mb-2">Create</h1>
          </div>

          {topicCard("Create a question", "/profile/createQuestion", problemsetIcon)}

          {(user_type.includes("admin") || user_type.includes("verified"))  && topicCard("Create a tournament", "/profile/createTournament", tournamentIcon)}

          {user_type.includes("admin") && topicCard("Create a contest", "/profile/createContest", contestIcon)}
        </div>

        <br />

      </div>
    </div>
  );
}