import Navbar from "@/components/misc/navbar";
import topicCard from "@/components/misc/topicCard";
import Preferences from "@/components/misc/preferences";
import checkInUser from "@/app/utils/Misc/checkInUser";
import Link from "next/link";
import contestIcon from "@/assets/contest-icon.jpg";
import tournamentIcon from "@/assets/tournament-icon.jpg";
import problemsetIcon from "@/assets/problem-solving-icon.jpg";
import reviewIcon from "@/assets/review-icon.jpg";
import reportIcon from "@/assets/reporting-icon.jpg";

const thisLink = "/others";

export default async function OthersPage() {
  
  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }

  const username = userData.username;
  const preferences = userData.preferences;

  const res = await supabase.from("Verifications").select("*").eq("user", username);
  if (res.error) { console.error(res.error) }

  const appliedAlr = res.data && res.data.length > 0;
  const user_type: string = userData.user_type;

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences?.body}>
      <Navbar thisLink={thisLink} style={preferences?.header} />
      <div className="flex flex-col gap-6 p-2 lg:w-full lg:max-w-4xl">

        {/* Become a verified user section */}
        {!(user_type.includes("admin") || user_type.includes("verified")) &&
        <div className="flex flex-col w-full">
          <div className="w-full mb-2" style={{borderBottom: "1px solid black"}}>
            <h1 className="mb-2 text-lg font-bold lg:text-xl">Apply to become a verified user</h1>
          </div>
          <div className="flex flex-col w-full gap-2">
            <h1 className="text-base lg:text-lg">Verified users have the ability to create tournaments.</h1>
            {appliedAlr 
            ? <h1 className="text-base text-red-600 lg:text-lg">You have already applied.</h1>
            : <Link 
              href="/verify" 
              className="flex items-center justify-center w-1/6 h-10 font-medium text-white bg-green-500 rounded-md hover:bg-green-700"
              >
                Apply
              </Link>}
          </div>
        </div>}
        
        {/* Preferences section */}
        <Preferences preferences={preferences} username={username} />
        
        {/* Create section */}
        <div className="flex flex-col w-full gap-6">
          <div className="w-full mb-2" style={{borderBottom: "1px solid black"}}>
            <h1 className="mb-2 text-lg font-bold lg:text-xl">Create</h1>
          </div>

          {topicCard("Create a question", "/others/createQuestion", problemsetIcon)}

          {(user_type.includes("admin") || user_type.includes("verified")) && topicCard("Create a tournament", "/others/createTournament", tournamentIcon)}

          {user_type.includes("admin") && topicCard("Create a contest", "/others/createContest", contestIcon)}
        </div>
        
        {/* Review section */}
        <div className="flex flex-col w-full gap-6">
          <div className="w-full mb-2" style={{borderBottom: "1px solid black"}}>
            <h1 className="mb-2 text-base font-bold lg:text-xl">Review</h1>
          </div>
          {user_type.includes("user") 
          ? topicCard("View stats for questions you have created", "/review", reviewIcon)
          : user_type.includes("verified")
          ? topicCard("View submissions made to questions and tournaments created by you", "/review", reviewIcon)
          : topicCard("View submissions made to questions, tournaments and contests created by you", "/review", reviewIcon)}
        </div>
        
        {/* Report section */}
        <div className="flex flex-col w-full gap-6">
          <div className="w-full mb-2" style={{borderBottom: "1px solid black"}}>
            <h1 className="mb-2 text-lg font-bold lg:text-xl">Report</h1>
          </div>
          {topicCard("Report an issue", "/forum/reports/create", reportIcon)}
        </div>

        <br />
      </div>
    </div>
  );
}