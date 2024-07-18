import Navbar from "@/components/misc/navbar";
import Link from "next/link";
import checkInUser from "@/app/utils/Misc/checkInUser";
import convertDate from "@/app/utils/dateConversion/convertDateV1";
import contestIcon from "@/assets/contest-icon.jpg";
const thisLink = "/contests";

export default async function ContestStartPage({params: {id}}: {params: {id: string}}) {

  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }

  const preferences = userData.preferences;

  const res = await supabase
    .from('Contests')
    .select('*')
    .eq('id', id)
    .single();

  if (res.error) { console.error(res.error); }

  const contestData = res.data;

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
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <div className='flex flex-col w-full max-w-5xl gap-5 p-5 ml-6 bg-gray-200 rounded-lg'>
        <div className="flex flex-row gap-20">
          <img src={contestIcon.src} alt="contest-icon" className="ml-4 w-80 h-80" />

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
              className="p-2 text-base font-medium text-center bg-green-300 cursor-pointer rounded-2xl hover:bg-green-400 hover:font-semibold" 
              style={{border: "1px solid black"}}
              >
                <button>{btnText}</button>
              </Link>
            : <button 
              className="p-2 text-base font-medium text-center bg-green-400 rounded-2xl" 
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
