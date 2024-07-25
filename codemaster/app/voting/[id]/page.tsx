import checkInUser from "@/app/utils/Misc/checkInUser";
import sendNotification from "@/app/utils/Misc/sendNotification";
import placeInCodeBox from "@/components/codeBoxes/CodeBox";
import Navbar from "@/components/misc/navbar";
import Voting from "@/components/misc/voting";
import VotingResults from "@/components/misc/votingResults";

export default async function VotingPage({params: {id}}: {params: {id: string}}) {

  const [supabase, userData] = await checkInUser();

  if (supabase === null) {
    console.error(userData);
    return;
  }
  const thisLink = `/problemset`
  const preferences = userData.preferences;

  const res = await supabase
    .from("Freestyle")
    .select("*")
    .eq("id", id)
    .single();
  
  if (res.error) { console.error(res.error); }

  const data = res.data;
  const voting_status = new Date().getTime() > new Date(data.voting_deadline).getTime() ? "Closed" : "Open";
  const voted_alr = data.voters.includes(userData.username);
  let winingData: any[] = [];

  const {data: refactorings, error} = await supabase
    .from("Votes")
    .select("*")
    .eq("freestyle_id", id);
  
  if (error) { console.error(error); }

  if (voting_status === "Closed") {
    const points = data.points;
    const scores: any = {};
    for (let i = 0; i < refactorings.length; i++) {
      const rankings = refactorings[i].rankings;
      const keys = Object.keys(rankings);
      let score = 0;
      let votes = 0;
      for (let j = 0; j < keys.length; j++) {
        score += rankings[keys[j]] * Number(keys[j]);
        votes += rankings[keys[j]];
      }
      scores[refactorings[i].id] = score / votes;
    }
    const sortedScores = Object.entries(scores).sort((a, b) => scores[a[0]] - scores[b[0]]);
    for (let i = 0; i < 3; i++) {
     const res = await supabase
      .from("Votes")
      .select("code, submitted_by")
      .eq("id", sortedScores[i][0])
      .single();
      
      if (res.error) { console.error(res.error); }
      const user = res.data.submitted_by;

      winingData[i] = {username: user, score: points[i], code: res.data.code};

      if (!data.closed) {
        const res2 = await supabase
          .from("Users")
          .select("XP")
          .eq("username", user)
          .single();
        if (res2.error) { console.error(res.error); }
        const XP = res2.data.XP;

        const res3 = await supabase
          .from("Users")
          .update({XP: XP + points[i]})
          .eq("username", user);
        if (res3.error) { console.error(res3.error); }

        const place = ["1st", "2nd", "3rd"];
        const notification = {
          from: "Admin",
          message: `Congratulations ${user}! You have earned ${points[i]} XP for coming ${place[i]} place for this refactoring problem.`,
          type: "View",
          link: `/voting/${id}`,
        }

        await sendNotification(user, notification);
      }
    }

    if (!data.closed) {
      const res4 = await supabase
        .from("Freestyle")
        .update({closed: true})
        .eq("id", id);
      if (res4.error) { console.error(res4.error); }
    }
  }

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-6" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <div className="flex flex-col w-full max-w-4xl gap-2 mt-4">
        <h1 className="text-2xl font-semibold text-left">Original code:</h1>
        {placeInCodeBox(data.code, data.language, preferences.codeColorTheme)}
      </div>
      {voting_status === "Open" 
      ? <Voting 
        freestyle_id={id} refactorings={refactorings} language={data.language} 
        username={userData.username} colorTheme={preferences.codeColorTheme}
        voted_alr={voted_alr}
        />
      : <VotingResults winingData={winingData} language={data.language} colorTheme={preferences.codeColorTheme} />}
      <br/>
    </div>
  );

}