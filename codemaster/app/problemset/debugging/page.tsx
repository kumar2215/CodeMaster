import Navbar from "../../utils/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const thisLink = "/problemset";

export default async function Debugging() {
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
      <div className="grid grid-rows-2 max-w-4xl max-h-24">
        <h2 className="text-2xl font-bold">Debugging</h2>
        <p className="text-base leading-7">
          Debugging is the process of finding and fixing errors in a computer
          program. It is a crucial step in the development process, as even small
          errors can cause a program to behave unexpectedly or crash. In this
          section, the programming problems provided are code snippets that
          contain bugs and require you to identify and fix the bugs in the
          code to make the program work correctly.
        </p>
      </div>
      <h2/>
      <div>
        <h1 className="text-2xl font-bold">Debugging</h1>
      </div>
    </div>
  );
}
