import Navbar from "@/components/misc/navbar";
import topicCard from "@/components/misc/topicCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import contestIcon from "@/assets/contest-icon.jpg";
import tournamentIcon from "@/assets/tournament-icon.jpg";
import problemsetIcon from "@/assets/problem-solving-icon.jpg";

const thisLink = "/others";

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

  const res = await supabase.from("Verifications").select("*").eq("user", username);
  if (res.error) { console.error(res.error) }

  const appliedAlr = res.data && res.data.length > 0;

  const user_type: string = userData.user_type;

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} />
      <div className="w-full max-w-4xl flex flex-col gap-4">

        {!(user_type.includes("admin") || user_type.includes("verified")) &&
        <div className="w-full flex flex-col">
          <div className="w-full mb-2" style={{borderBottom: "1px solid black"}}>
            <h1 className="text-xl font-bold mb-2">Apply to become a verified user</h1>
          </div>
          <div className="w-full flex flex-col gap-2">
            <h1 className="text-lg">Verified users have access to more features and can create tournaments.</h1>
            {appliedAlr 
            ? <h1 className="text-lg text-red-600">You have already applied.</h1>
            : <button className="w-32 h-10 bg-green-500 font-medium text-white rounded-md hover:bg-green-700">
                <Link href="/verify">Apply</Link>
              </button>}
          </div>
        </div>}
        
        <div className="w-full flex flex-col">
          <div className="w-full mb-2" style={{borderBottom: "1px solid black"}}>
            <h1 className="text-xl font-bold mb-2">Preferences</h1>
          </div>
        </div>

        <div className="w-full flex flex-col gap-6">
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