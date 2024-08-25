import Navbar from "@/components/misc/navbar";
import Link from "next/link";
import checkInUser from "@/app/utils/Misc/checkInUser";
import convertDate from "@/app/utils/dateConversion/convertDateV1";
import contestIcon from "@/assets/contest-icon.jpg";
import { redirect } from "next/navigation";
import DownloadButton from "@/components/buttons/DownloadButton";
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
  if (!contestData) {
    redirect("/empty");
  }

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

  const links = Array.from({length: 5}).map((x, idx) => `/questions/contest-${contestData.id}[${idx+1}-${questions.length}]?printing=true`);
  const downloadData = {
    name: contestData.name,
    user: userData.username,
    score: contestData.points,
    links: links
  }

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <div className='flex flex-col self-center w-10/12 max-w-5xl p-5 mx-auto bg-gray-200 rounded-lg lg:w-full'>
        <div className="flex flex-col lg:flex-row">
          <img src={contestIcon.src} alt="contest-icon" className="mx-auto lg:w-80 lg:h-80 lg:mx-0 h-60 w-60" />

          <div className="flex flex-col gap-2 mx-auto mt-4 lg:mt-0 lg:ml-10">
            <div className='flex flex-row gap-2'>
              <p className='text-lg font-semibold lg:text-xl'>Contest name:</p>
              <p className='text-lg lg:text-xl'>{contestData.name}</p>
            </div>

            <div className='flex flex-row gap-2'>
              <p className='text-lg font-semibold lg:text-xl'>Closes by:</p>
              <p className='text-lg lg:text-xl'>{convertDate(contestData.deadline)}</p>
            </div>

            <div className='flex flex-row gap-2'>
              <p className='text-lg font-semibold lg:text-xl'>Points:</p>
              <p className='text-lg lg:text-xl'>{contestData.points}</p>
            </div>

            <div className='flex flex-row gap-2'>
              <p className='text-lg font-semibold lg:text-xl'>Status:</p>
              <p className='text-lg lg:text-xl'>{contestData.status}</p>
            </div>

            {Array.from({length: btnText === "View results" ? 3 : 5}).map(x => <br/>)}

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

            {btnText === "View results" && <DownloadButton data={downloadData} />}

          </div>
        </div>  
      </div>
      <br/>
    </div>
  );
};
