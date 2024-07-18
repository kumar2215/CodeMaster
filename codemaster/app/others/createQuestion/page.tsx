import Navbar from "@/components/misc/navbar";
import IndividualQuestionForm from "@/components/forms/IndividualQuestionForm";
import checkInUser from "@/app/utils/Misc/checkInUser";

const thisLink = "/others";

export default async function CreateQuestionsPage() {
  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }

  const preferences = userData.preferences;

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
        <h2 className="pt-4 text-4xl">Create a question</h2>
        <IndividualQuestionForm user_data={userData} />
      <br/>
    </div>
  );
}