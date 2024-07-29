import Navbar from "@/components/misc/navbar";
import SetProfilePic from "@/components/buttons/SetProfilePic";
import Notification from "@/components/misc/notification";
import checkInUser from "@/app/utils/Misc/checkInUser";

const thisLink = "/profile";

export default async function ProfilePage() {

  const [supabase, userData] = await checkInUser();
  if (supabase == null) { 
    console.error(userData);
    return;
  }
  
  const username = userData.username;
  const preferences = userData.preferences || {};
  const notifications = userData.notifications || [];
  const comments_written = userData.comments_written || [];

  const general_XP:  number = userData.XP;
  const contest_XP: number = userData.contest_XP;
  const tournament_XP: number = userData.tournament_XP;
  const total_XP: number = general_XP + contest_XP + tournament_XP;

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <div className="flex flex-col w-full max-w-4xl gap-2 p-12 lg:p-0">
        <div className="flex flex-col w-full md:justify-between lg:justify-between md:flex-row lg:flex-row">
          <SetProfilePic username={username} />

          <div className="flex flex-col w-full gap-2 mt-4">

            <div className="flex flex-row w-full gap-2">
              <h1 className="text-base font-bold lg:text-xl">Username:</h1>
              <h1 className="text-base lg:text-xl">{username}</h1>
            </div>

            <div className="flex flex-row w-full gap-2">
              <h1 className="text-base font-bold lg:text-xl">Total XP:</h1>
              <h1 className="text-base lg:text-xl">{total_XP}</h1>
            </div>
            
            <div className="flex flex-row w-full gap-2">
              <h1 className="text-base font-bold lg:text-xl">Problems done:</h1>
              <h1 className="text-base lg:text-xl">{userData.questions_done ? userData.questions_done.length : 0}</h1>
            </div>

            <div className="flex flex-row w-full gap-2">
              <h1 className="text-base font-bold lg:text-xl">Contests done:</h1>
              <h1 className="text-base lg:text-xl">{userData.contests_done ? userData.contests_done.length : 0}</h1>
            </div>

            <div className="flex flex-row w-full gap-2">
              <h1 className="text-base font-bold lg:text-xl">Contest XP:</h1>
              <h1 className="text-base lg:text-xl">{contest_XP}</h1>
            </div>

            <div className="flex flex-row w-full gap-2">
              <h1 className="text-base font-bold lg:text-xl">Tournaments done:</h1>
              <h1 className="text-base lg:text-xl">{userData.tournaments_done ? userData.tournaments_done.length : 0}</h1>
            </div>

            <div className="flex flex-row w-full gap-2">
              <h1 className="text-base font-bold lg:text-xl">Tournament XP:</h1>
              <h1 className="text-base lg:text-xl">{tournament_XP}</h1>
            </div>

            <div className="flex flex-row w-full gap-2">
              <h1 className="text-base font-bold lg:text-xl">Comments written:</h1>
              <h1 className="text-base lg:text-xl">{comments_written ? comments_written.length : 0}</h1>
            </div>

          </div>
        </div>

        {Array.from({length: 2}).map(x => <br/>)}

        <div className="flex flex-row w-full gap-3 mb-2" style={{borderBottom: "1px solid black"}}>
          <h1 className="mb-2 text-base font-bold lg:text-xl">Notifications</h1>
          <div className="w-6 h-6 mt-1 text-center align-middle bg-red-300 rounded-full">
            <h1 className="text-base font-semibold">{notifications?.length}</h1>
          </div>
        </div>
        {notifications?.length === 0
        ? <h1>You have no notifications so far.</h1> 
        : notifications?.map((notification: any) => <Notification notification={notification} username={username} />)
        }

        <br/>
      </div>
    </div>
  );
}