import Navbar from "@/components/misc/navbar";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import convertDate from "@/app/utils/dateConversion/convertDateV1";
import contestIcon from "@/assets/contest-icon.jpg";
const thisLink = "/contests";

export default async function ContestStartPage({params: {id}}: {params: {id: string}}) {

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const username = user.user_metadata.username;

  const res = await supabase
    .from('Contests')
    .select('*')
    .eq('id', id)
    .single();

  if (res.error) { console.error(res.error); }

  const contestData = res.data;

  const res2 = await supabase
    .from('Users')
    .select('*')
    .eq('username', username)
    .single();

  if (res2.error) { console.error(res2.error); }

  const userData = res2.data;

  let contestsDoneByUser = userData.contests_done;
  contestsDoneByUser = contestsDoneByUser ? contestsDoneByUser : [];
  const contestsIdsDoneByUser = contestsDoneByUser.map((contest: { id: any; }) => contest.id); 

  const idx = contestsIdsDoneByUser.indexOf(contestData.id);

  if (idx !== -1) {
    const contest = contestsDoneByUser[idx];
    contestData.status = contest.status;
    contestData.points =  contest.pointsAccumulated ? `${contest.pointsAccumulated}/${contestData.points}` : contestData.points;
  } else {
    contestData.status = "Not Attempted";
  }

  const questions = contestData.questions;
  const link = `/questions/contest-${contestData.id}[1-${questions.length}]`;
  const btnText = new Date(contestData.deadline).getTime() < new Date().getTime() && contestData.status !== "Completed"
    ? "Contest closed"
    : contestData.status === "Not Attempted"
    ? "Start contest" 
    : contestData.status === "Attempted"
    ? "Resume contest"
    : "View results";

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} />
      <div className='w-full max-w-5xl flex flex-col bg-gray-200 rounded-lg p-5 ml-6 gap-5'>
        <div className="flex flex-row gap-20">
          <img src={contestIcon.src} alt="contest-icon" className="w-80 h-80 ml-4" />

          <div className="flex flex-col gap-2">
            <div className='flex flex-row gap-2'>
              <p className='text-xl font-semibold'>Contest name:</p>
              <p className='text-xl'>{contestData.name}</p>
            </div>

            <div className='flex flex-row gap-2'>
              <p className='text-xl font-semibold'>Closes by:</p>
              <p className='text-xl'>{convertDate(contestData.deadline)}</p>
            </div>

            <div className='flex flex-row gap-2'>
              <p className='text-xl font-semibold'>Points:</p>
              <p className='text-xl'>{contestData.points}</p>
            </div>

            <div className='flex flex-row gap-2'>
              <p className='text-xl font-semibold'>Status:</p>
              <p className='text-xl'>{contestData.status}</p>
            </div>

            {Array.from({length: 5}).map(x => <br/>)}

            {btnText !== "Contest closed"
            ? <Link
              href={link} 
              className="bg-green-300 text-base text-center font-medium p-2 rounded-2xl hover:bg-green-400 cursor-pointer hover:font-semibold" 
              style={{border: "1px solid black"}}
              >
                <button>{btnText}</button>
              </Link>
            : <button 
              className="bg-green-400 text-base text-center font-medium p-2 rounded-2xl" 
              style={{border: "1px solid black"}} 
              disabled={true}
              >
                {btnText}
              </button>
            }
          </div>

        </div>  
      </div>
      <br/>
    </div>
  );
};
