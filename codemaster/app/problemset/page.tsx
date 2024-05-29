import Navbar from "@/components/misc/navbar";
import section from "@/components/misc/card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import debuggingIcon from "@/assets/debugging-icon.jpg";
import codeUnderstandingIcon from "@/assets/Code-understanding-icon.jpg";
import goodCodePracticesIcon from "@/assets/good-coding-principles-icon.jpg";
import codeRefactoringIcon from "@/assets/code-refactoring-icon.jpg";

const thisLink = "/problemset";

export default async function ProblemSet() {
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
      <div 
      className="animate-in w-3/4 h-full grid grid-cols-2 grid-rows-2 gap-20 opacity-0 px-3"
      > 
        {section(
          "Debugging", 
          "Spent countless hours debugging code, only to find silly bugs? Practice your debugging skills here!", 
          "/problemset/debugging", 
          debuggingIcon
        )}
        {section(
          "Code Understanding", 
          "Seen a piece of code that you don't understand? Practice understanding complex code snippets here!", 
          "/problemset/understanding", 
          codeUnderstandingIcon
        )}
        {section(
          "Good Code Principles", 
          "SRP, ISP, DIP? What are they and how can I use them? Learn more about and practice good coding principles here!", 
          "/problemset/principles", 
          goodCodePracticesIcon
        )}
        {section(
          "Code Refactoring", 
          "Ever written code that you know can be improved on but don't know how? Practice refactoring code snippets here!", 
          "/problemset/refactoring", 
          codeRefactoringIcon
        )}
      </div>

    </div>
  );
}
