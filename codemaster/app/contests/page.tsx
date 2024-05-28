import Navbar from "../../components/misc/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const thisLink = "/contests";

export default async function ContestsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      {Navbar(thisLink)}
      <div className="text-xl font-bold">
        <h1>Not implemented yet</h1>
      </div>
    </div>
  );
}