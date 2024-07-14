import Navbar from "@/components/misc/navbar";
import Notification from "@/components/misc/notification";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const thisLink = "/profile";

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const username = user.user_metadata.username;

  const { data: userData, error: err } = await supabase
    .from("Users")
    .select(`*`)
    .eq("username", username)
    .single();

  if (err) { console.error(err); }

  const notifications = userData.notifications || [];

  const general_XP:  number = userData.XP;
  const contest_XP: number = userData.contest_XP;
  const tournament_XP: number = userData.tournament_XP;
  const total_XP: number = general_XP + contest_XP + tournament_XP;

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} />
      <div className="w-11/12 max-w-4xl flex flex-col gap-2">

        <div className="w-full flex flex-row ">
          <span className="w-60 h-60 rounded-full overflow-hidden border-2">
              <img src={`https://api.dicebear.com/8.x/personas/svg?seed=${username}`} alt="avatar"
                    className="h-full w-full rounded-full object-cover"/>
          </span>

          <div className="w-full flex flex-col mt-4 gap-2 ml-5 lg:ml-40 md:lg-20">

            <div className="w-full flex flex-row gap-2">
              <h1 className="lg:text-xl text-md font-bold">Username:</h1>
              <h1 className="lg:text-xl text-md">{username}</h1>
            </div>

            <div className="w-full flex flex-row gap-2">
              <h1 className="lg:text-xl text-md font-bold">Total XP:</h1>
              <h1 className="lg:text-xl text-md">{total_XP}</h1>
            </div>
            
            <div className="w-full flex flex-row gap-2">
              <h1 className="lg:text-xl text-md font-bold">Problems done:</h1>
              <h1 className="lg:text-xl text-md">{userData.questions_done ? userData.questions_done.length : 0}</h1>
            </div>

            <div className="w-full flex flex-row gap-2">
              <h1 className="lg:text-xl text-md font-bold">Contests done:</h1>
              <h1 className="lg:text-xl text-md">{userData.contests_done ? userData.contests_done.length : 0}</h1>
            </div>

            <div className="w-full flex flex-row gap-2">
              <h1 className="lg:text-xl text-md font-bold">Contest XP:</h1>
              <h1 className="lg:text-xl text-md">{contest_XP}</h1>
            </div>

            <div className="w-full flex flex-row gap-2">
              <h1 className="lg:text-xl text-md font-bold">Tournaments done:</h1>
              <h1 className="lg:text-xl text-md">{userData.tournaments_done ? userData.tournaments_done.length : 0}</h1>
            </div>

            <div className="w-full flex flex-row gap-2">
              <h1 className="lg:text-xl text-md font-bold">Tournament XP:</h1>
              <h1 className="lg:text-xl text-md">{tournament_XP}</h1>
            </div>

          </div>
        </div>

        {Array.from({length: 2}).map(x => <br/>)}

        <div className="w-full mb-2" style={{borderBottom: "1px solid black"}}>
          <h1 className="lg:text-xl text-md font-bold mb-2">Notifications</h1>
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