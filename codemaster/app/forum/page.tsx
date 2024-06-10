import Navbar from "../../components/misc/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import journalIcon from "@/assets/journal-icon.jpg";
import contestIcon from "@/assets/contest-icon.jpg";
import tournamentIcon from "@/assets/tournament-icon.jpg";
import feedbackIcon from "@/assets/feedback-icon.jpg";
import othersIcon from "@/assets/others-icon.jpg";
import {StaticImageData} from "next/image";

const thisLink = "/forum";

function topicCard(title: string, link: string, image: StaticImageData) {
  return (
    <a href={link}>
      <div
          style={{
            width: "100%",
            height: "200px",
            display: "flex",
            padding: "20px",
            flexDirection: "row",
            gap: "40px",
            justifyContent: "start",
            backgroundColor: "lightgrey",
            border: "1px solid black",
            borderRadius: "10px",
            boxShadow: "3px 3px 2px #888888"
          }}
          className="hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
      >
        <div style={{width: "19%"}}>
          <img src={image.src} alt="icon"/>
        </div>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    </a>
  );
}

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
          className="animate-in w-3/5 flex flex-col gap-10 opacity-0 px-3"
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
