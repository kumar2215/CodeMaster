import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/misc/navbar";
import VerificationForm from "@/components/forms/VerificationForm";

const thisLink = "/others";

export default async function Verify() {

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const username = user.user_metadata.username;

  const res = await supabase.from("Users").select('*').eq("username", username).single();
  if (res.error) { console.error(res.error); }
  
  const user_type = res.data.user_type;

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} />
      <h2 className="text-4xl pt-2">Verification Form</h2>
      {user_type.includes("verified") ? <h1>You are already verified</h1> : <VerificationForm username={username} />}
    </div>
  );
}