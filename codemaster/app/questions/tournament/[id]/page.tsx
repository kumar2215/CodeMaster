import Navbar from "@/components/misc/navbar";
import VerifyPassword from "@/components/buttons/VerifyPassword";
import checkInUser from "@/app/utils/Misc/checkInUser";
import Link from "next/link";
import convertDate from "@/app/utils/dateConversion/convertDateV1";
import tournamentIcon from "@/assets/tournament-icon.jpg"
const thisLink = "/tournaments";

export default async function TournamentStartPage({params: {id}}: {params: {id: string}}) {

  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }

  const preferences = userData.preferences;

  const res = await supabase
    .from('Tournaments')
    .select('*')
    .eq('id', id)
    .single();

  if (res.error) { console.error(res.error); }

  const tournamentData = res.data;
  const verified = tournamentData.verified_by !== null;

  let tournamentsDoneByUser = userData.tournaments_done;
  tournamentsDoneByUser = tournamentsDoneByUser ? tournamentsDoneByUser : [];
  const tournamentsIdsDoneByUser = tournamentsDoneByUser.map((tournament: { id: any; }) => tournament.id); 

  const idx = tournamentsIdsDoneByUser.indexOf(tournamentData.id);

  if (idx !== -1) {
    const tournament = tournamentsDoneByUser[idx];
    tournamentData.status = tournament.status;
    tournamentData.points = tournament.pointsAccumulated 
      ? `${tournament.pointsAccumulated}/${tournamentData.points}` 
      : tournamentData.points; ;
  } else {
    tournamentData.status = "Not Attempted";
  }

  // TODO: add functionality to ask for password after successful review
  const questions = tournamentData.questions;
  const link = `/questions/tournament-${tournamentData.id}[1-${questions.length}]`;
  
  const btnText = !verified && !tournamentData.password_hash
    ? "Review tournament"
    : verified && !tournamentData.password_hash
    ? "Review tournament and set password"
    : new Date(tournamentData.deadline).getTime() < new Date().getTime() && tournamentData.status !== "Completed"
    ? "Tournament closed"
    : tournamentData.status === "Not Attempted"
    ? "Start tournament" 
    : tournamentData.status === "Attempted"
    ? "Resume tournament"
    : "View results";

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <div className='flex flex-col w-full max-w-5xl gap-5 p-5 ml-6 bg-gray-200 rounded-lg'>
        <div className="flex flex-row gap-20">
          <img src={tournamentIcon.src} alt="contest-icon" className="ml-4 w-80 h-80" />

          <div className="flex flex-col gap-2">
            <div className='flex flex-row gap-2'>
              <p className='text-xl font-semibold'>Tournament name:</p>
              <p className='text-xl'>{tournamentData.name}</p>
            </div>

            <div className='flex flex-row gap-2'>
              <p className='text-xl font-semibold'>Created by:</p>
              <p className='text-xl'>{tournamentData.created_by}</p>
            </div>

            <div className='flex flex-row gap-2'>
              <p className='text-xl font-semibold'>Closes by:</p>
              <p className='text-xl'>{convertDate(tournamentData.deadline)}</p>
            </div>

            <div className='flex flex-row gap-2'>
              <p className='text-xl font-semibold'>Points:</p>
              <p className='text-xl'>{tournamentData.points}</p>
            </div>

            {verified && tournamentData.password_hash &&
            <div className='flex flex-row gap-2'>
              <p className='text-xl font-semibold'>Status:</p>
              <p className='text-xl'>{tournamentData.status}</p>
            </div>
            }

            {Array.from({length: 5}).map(x => <br/>)}
            
            {verified && tournamentData.password_hash && (tournamentData.status === "Not Attempted" || tournamentData.status === "Attempted")
            ? <VerifyPassword id={id} link={link} btnText={btnText} />
            : btnText !== "Tournament closed"
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
              </button>}
          </div>

        </div>  
      </div>
      <br/>
    </div>
  );
};
