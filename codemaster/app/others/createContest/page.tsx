import Navbar from "@/components/misc/navbar";
import ContestForm from "@/components/forms/ContestForm";
import checkInUser from "@/app/utils/Misc/checkInUser";

const thisLink = "/others";

export default async function CreateContestsPage() {
  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }
  
  const preferences = userData.preferences;
  const verified = userData.user_type.includes("admin");

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} style={preferences.header} />
        <h2 className="pt-8 text-4xl">Design a contest</h2>
        { verified ? <ContestForm /> : 
        <h1>You dont have access to create a contest</h1> }
      <br/>
    </div>
  );
}
