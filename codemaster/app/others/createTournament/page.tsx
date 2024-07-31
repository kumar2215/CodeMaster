import Navbar from "@/components/misc/navbar";
import TournamentForm from "@/components/forms/TournamentForm";
import checkInUser from "@/app/utils/Misc/checkInUser";

const thisLink = "/others";

export default async function CreateContestsPage() {
  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }
  
  const verified = userData.user_type.includes("verified") || userData.user_type.includes("admin");
  const preferences = userData.preferences;

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
        <h2 className="pt-2 text-2xl lg:pt-4 lg:text-4xl">Design your own tournament</h2>
        { verified ? <TournamentForm /> : 
        <h1>You dont have access to create a tournament</h1> }
      <br/>
    </div>
  );
}
