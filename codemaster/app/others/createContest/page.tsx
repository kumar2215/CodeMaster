import Navbar from "@/components/misc/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ContestForm from "@/components/forms/ContestForm";
const thisLink = "/others";

export default async function CreateContestsPage() {
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

  if (error) { console.error(error); }
  
  const verified = data.user_type.includes("admin");

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} />
        <h2 className="text-4xl pt-8">Design a contest</h2>
        { verified ? <ContestForm /> : 
        <h1>You dont have access to create a contest</h1> }
      <br/>
    </div>
  );
}
