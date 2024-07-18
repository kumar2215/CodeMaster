"use server";
import Navbar from "@/components/misc/navbar";
import Post from "./post";
import checkInUser from "@/app/utils/Misc/checkInUser";


const thisLink = "/forum";

export default async function Create({params: {topic}}: {params: {topic: string}}) {

  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }

  const username = userData.username;
  const preferences = userData.preferences;

  return (
      <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
        <Navbar thisLink={thisLink} style={preferences.header} />
        <div className="w-full max-w-5xl p-3 border-4 bg-slate-50">
          <h1
              className="text-2xl font-medium"
          >{`Create a new discussion (${topic})`}</h1>
          <br/>
          <Post username={username} topic={topic}/>
        </div>
      </div>
  );
}