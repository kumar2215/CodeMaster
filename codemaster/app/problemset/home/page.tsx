import Navbar from "../../utils/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { StaticImageData } from "next/image";
import debuggingIcon from "../../../assets/debugging-icon.jpg";
import codeUnderstandingIcon from "../../../assets/Code-understanding-icon.jpg";
import goodCodePracticesIcon from "../../../assets/good-coding-principles-icon.jpg";
import codeRefactoringIcon from "../../../assets/code-refactoring-icon.jpg";

const thisLink = "/problemset";

function section(title: string, description: string, link: string, image: StaticImageData) {

  return (
    <a href={link}>
      <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: "20px",
        flexDirection: "column",
        justifyContent: "start",
        backgroundColor: "#f3f4f6",
        border: "1px solid black",
        borderRadius: "10px",
        boxShadow: "3px 3px 2px #888888"
      }}
      className="hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
      >
        <div className="grid grid-cols-2 gap-x-5">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <br/>
            <img src={image.src} alt="icon"/>
          </div>
          <p className="text-lg text-left">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
}


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
