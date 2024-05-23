import PremiumButton from "@/components/PremiumButton";
import AuthButton from "@/components/AuthButton";

export default function Navbar(thisLink: string) {

  function createListElement(link: string, title: string) {

    const className = link === thisLink
      ? "relative flex items-center text-xl cursor-pointer font-medium py-4" 
      : "relative flex items-center hover:text-xl cursor-pointer hover:font-medium";
  
    return (
      <li className="relative flex h-full items-center text-base">
        <a className={className} style={link == thisLink ? {borderBottom: "2px solid black"} : {}} href={link}>{title}</a>
      </li>
    );
  }

  return (
    <div className="bg-gray-300 w-full">
    <nav 
    style={{
      display: "grid",
      gridTemplateColumns: "550px 550px",
      justifyContent: "center",
      border: "1px solid #e5e7eb",
    }}
    >
    <div className="display-flex m-auto h-[50px] w-full items-center justify-center px-6 md:flex max-w-[1200px]">
    <ul className="relative m-0 flex h-full grow items-center gap-6 self-end p-0">
    {createListElement("/problemset", "Problems")}
    {createListElement("/contests", "Contests")}
    {createListElement("/tournaments", "Tournaments")}
    {createListElement("/forum", "Forum")}
    </ul>
    </div>
    <div className="w-full max-w-4xl flex justify-end gap-3 p-3 text-sm">
    <AuthButton />
    <PremiumButton />
    </div>
    </nav>
    </div>
  );
}