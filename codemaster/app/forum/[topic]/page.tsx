import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import Navbar from "@/components/misc/navbar";
import DiscussionsTable from "@/components/misc/discussionsTable";

const thisLink = "/forum";

export default async function Discussions({params: {topic}}: {params: {topic: string}}) {
  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const res = await supabase.from("Discussions").select("*").eq("type", topic);
  if (res.error) { console.error(res.error) }
  let discussions: any = res.data;

  return (
      <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
        <Navbar thisLink={thisLink}/>
        <div className="w-full max-w-4xl flex flex-row justify-between text-xl font-bold">
          <h1 className="text-3xl">{`${topic.charAt(0).toUpperCase() + topic.slice(1)}`}</h1>
          <a href={`/forum/${topic}/create`}>
            <button className="bg-green-200 text-base font-medium p-2 rounded-2xl" style={{border: "1px solid black"}}>
              Create Discussion
            </button>
          </a>
        </div>
        <DiscussionsTable discussions={discussions} username={user.user_metadata.username} />
        <br/>
      </div>
  );
}