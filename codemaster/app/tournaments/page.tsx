import Navbar from "../utils/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const thisLink = "/tournaments";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 bg-teal-300 w-full flex flex-col gap-10 items-center">
      {Navbar(thisLink)}
      <div className="text-xl font-bold">
        <h1>Not implemented yet</h1>
      </div>
    </div>
  );
}
