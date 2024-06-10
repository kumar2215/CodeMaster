import Navbar from "@/components/misc/navbar";
import Post from "./post";

const thisLink = "/forum";

export default async function Create({params: {topic}}: {params: {topic: string}}) {

  return (
      <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
        <Navbar thisLink={thisLink}/>
        <div className="w-full max-w-5xl bg-slate-50 p-3 border-4">
          <h1
              className="text-2xl font-medium"
          >{`Create a new discussion (${topic})`}</h1>
          <br/>
          <Post topic={topic}/>
        </div>
      </div>
  );
}