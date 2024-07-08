import Navbar from "@/components/misc/navbar";
import topicCard from "@/components/misc/topicCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import journalIcon from "@/assets/journal-icon.jpg";
import contestIcon from "@/assets/contest-icon.jpg";
import tournamentIcon from "@/assets/tournament-icon.jpg";
import feedbackIcon from "@/assets/feedback-icon.jpg";
import othersIcon from "@/assets/others-icon.jpg";

const thisLink = "/forum";

export default async function Forum() {
  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink}/>
      <div
          className="animate-in w-10/12 flex flex-col gap-10 opacity-0 px-3 lg:w-3/5"
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
