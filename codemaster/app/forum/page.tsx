import Navbar from "@/components/misc/navbar";
import topicCard from "@/components/misc/topicCard";
import checkInUser from "@/app/utils/Misc/checkInUser";
import journalIcon from "@/assets/journal-icon.jpg";
import contestIcon from "@/assets/contest-icon.jpg";
import tournamentIcon from "@/assets/tournament-icon.jpg";
import feedbackIcon from "@/assets/feedback-icon.jpg";
import othersIcon from "@/assets/others-icon.jpg";

const thisLink = "/forum";

export default async function Forum() {
  
  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }

  const preferences = userData.preferences;

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <div
          className="flex flex-col gap-10 px-3 opacity-0 lg:w-3/5 animate-in"
      >
        {topicCard("General", "/forum/general", journalIcon)}
        {topicCard("Contests", "/forum/contests", contestIcon)}
        {topicCard("Tournaments", "/forum/tournaments", tournamentIcon)}
        {topicCard("Feedback", "/forum/feedback", feedbackIcon)}
        {topicCard("Others", "/forum/others", othersIcon)}
      </div>
     <br/>
    </div>
  );
}
