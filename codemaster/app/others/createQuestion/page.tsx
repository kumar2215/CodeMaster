import Navbar from "@/components/misc/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import IndividualQuestionForm from "@/components/forms/IndividualQuestionForm";

const thisLink = "/others";

export default async function CreateQuestionsPage() {
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

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink} />
        <h2 className="text-4xl pt-8">Create a question</h2>
        <IndividualQuestionForm user_data={data} />
      <br/>
    </div>
  );
}