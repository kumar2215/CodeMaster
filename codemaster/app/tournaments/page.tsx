import Navbar from "../../components/misc/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TournamentForm from "@/components/forms/TournamentForm";
const thisLink = "/tournaments";

export default async function TournamentsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data, error } = await supabase
  .from('Users')
  .select('*')
  .eq('email', user.email)
  .single();
  
  const verified = data.user_type == 'user' ? false : true
  console.log(verified, data.user_type)

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} />
      <div className="w-8/12 bg-gray-200 rounded-lg min-h-80 flex items-center justify-between pl-2 pr-2 flex-col">
        <h2 className="text-4xl pt-8">Design your own tournament</h2>
        { verified ? <TournamentForm/> : 
        <h1>You dont have access to this create a tournament</h1> }
      </div>
    </div>
  );
}
