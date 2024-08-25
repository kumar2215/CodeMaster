import Navbar from "@/components/misc/navbar";
import section from "@/components/misc/card";
import checkInUser from "@/app/utils/Misc/checkInUser";
import debuggingIcon from "@/assets/debugging-icon.jpg";
import codeUnderstandingIcon from "@/assets/Code-understanding-icon.jpg";
import goodCodePracticesIcon from "@/assets/good-coding-principles-icon.jpg";
import codeRefactoringIcon from "@/assets/code-refactoring-icon.jpg";

const thisLink = "/problemset";

export default async function ProblemSet() {
  
  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }

  const preferences = userData.preferences;

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <div className="grid w-3/4 h-full grid-cols-1 grid-rows-4 gap-20 px-3 mb-4 opacity-0 lg:mb-0 animate-in lg:grid-cols-2 lg:grid-rows-2">

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
      <br/>
    </div>
  );
}
