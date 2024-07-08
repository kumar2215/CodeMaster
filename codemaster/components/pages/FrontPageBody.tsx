import logo from "@/assets/CodeMaster-logo.jpg";

export default function Body() {
  return (
    <div className="md:flex-row flex-col flex items-center justify-center gap-10">
      <img 
        src={logo.src} 
        alt="CodeMaster Logo"
        style={{ width: "500px", height: "auto"}}
      >
      </img>
      <div className="max-w-lg h-full flex flex-col justify-start">
        <h1 className="text-4xl font-bold text-center">
          Welcome to CodeMaster!
        </h1>
        <br/>
        <p className="text-left text-xl text-foreground/60 text-pretty">
          While many other coding platforms like leetcode and codeforces focus on the problem solving 
          aspect of programming, CodeMaster provides a way for programmers to practice the other aspects 
          of it such as debugging, understanding complex code, using good code practices and refactoring. 
          It is a web platform where they can practice these skills through a variety of questions 
          provided. It uses EXP to reward users and uses leaderboards to give users a sense of competitiveness.
        </p>
      </div>
    </div>
  );
}
