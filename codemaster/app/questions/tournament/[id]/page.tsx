import Navbar from "@/components/misc/navbar";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import convertDate from "@/app/utils/dateConversion/convertDateV1";
import tournamentIcon from "@/assets/tournament-icon.jpg"
const thisLink = "/tournaments";

export default async function TournamentStartPage({params: {id}}: {params: {id: string}}) {

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const username = user.user_metadata.username;

  const res = await supabase
    .from('Tournaments')
    .select('*')
    .eq('id', id)
    .single();

  if (res.error) { console.error(res.error); }

  const tournamentData = res.data;

  const res2 = await supabase
    .from('Users')
    .select('*')
    .eq('username', username)
    .single();

  if (res2.error) { console.error(res2.error); }

  const userData = res2.data;

  let tournamentsDoneByUser = userData.tournamnets_done;
  tournamentsDoneByUser = tournamentsDoneByUser ? tournamentsDoneByUser : [];
  const tournamentsIdsDoneByUser = tournamentsDoneByUser.map((tournament: { id: any; }) => tournament.id); 

  const idx = tournamentsIdsDoneByUser.indexOf(tournamentData.id);

  if (idx !== -1) {
    const tournament = tournamentsDoneByUser[idx];
    tournamentData.status = tournament.status;
    tournamentData.points = `${tournament.pointsAccumulated}/${tournamentData.points}`;
  } else {
    tournamentData.status = "Not Attempted";
  }

  const questions = tournamentData.questions;
  const link = `/questions/tournament-${tournamentData.id}[1-${questions.length}]`;

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} />
      <div className='w-full max-w-5xl flex flex-col bg-gray-200 rounded-lg p-5 ml-6 gap-5'>
        <div className="flex flex-row gap-20">
          <img src={tournamentIcon.src} alt="contest-icon" className="w-80 h-80 ml-4" />

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

            <div className='flex flex-row gap-2'>
              <p className='text-xl font-semibold'>Status:</p>
              <p className='text-xl'>{tournamentData.status}</p>
            </div>

            {Array.from({length: 5}).map(x => <br/>)}
            
            {/* Need to change this to take in the tournament's password instead */}
            <button 
            className="bg-green-300 text-base font-medium p-2 rounded-2xl hover:bg-green-400 cursor-pointer hover:font-semibold" 
            style={{border: "1px solid black"}}
            >
              <Link href={link}>Start Tournament</Link>
            </button>
          </div>

        </div>  
      </div>
      <br/>
    </div>
  );
};
