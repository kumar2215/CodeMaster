import Navbar from "@/components/misc/navbar";
import DiscussionsTable from "@/components/tables/discussionsTable";
import checkInUser from "@/app/utils/Misc/checkInUser";
import { redirect } from "next/navigation";

const thisLink = "/forum";

export default async function Discussions({params: {topic}}: {params: {topic: string}}) {
  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }

  const preferences = userData.preferences;
  const allowed_topics = ["general", "contests", "tournaments", "feedback", "others"];

  const res = await supabase.from("Discussions").select("*").eq("type", topic);
  if (res.error) { console.error(res.error) }
  const discussions: any = res.data;

  if (!allowed_topics.includes(topic)) {
    redirect("/empty");
  }

  return (
      <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
        <Navbar thisLink={thisLink} style={preferences.header} />
        <div className="flex flex-row justify-between w-full max-w-4xl text-xl font-bold">
          <h1 className="text-3xl">{`${topic.charAt(0).toUpperCase() + topic.slice(1)}`}</h1>
          <a href={`/forum/${topic}/create`}>
            <button className="p-2 text-base font-medium bg-green-200 rounded-2xl" style={{border: "1px solid black"}}>
              Create Discussion
            </button>
          </a>
        </div>
        <DiscussionsTable discussions={discussions} />
        <br/>
      </div>
  );
}