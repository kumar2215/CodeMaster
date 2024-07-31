import Navbar from "@/components/misc/navbar";
import VerificationForm from "@/components/forms/VerificationForm";
import checkInUser from "@/app/utils/Misc/checkInUser";

const thisLink = "/others";

export default async function Verify() {

  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }
  
  const username = userData.username;
  const user_type = userData.user_type;
  const preferences = userData.preferences;

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <h2 className="pt-2 text-2xl lg:pt-4 lg:text-4xl">Verification Form</h2>
      {user_type.includes("verified") ? <h1>You are already verified</h1> : <VerificationForm username={username} />}
    </div>
  );
}