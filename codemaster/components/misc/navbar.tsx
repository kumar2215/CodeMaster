import PremiumButton from "@/components/buttons/PremiumButton";
import AuthButton from "@/components/buttons/AuthButton";
import React from "react";

export default function Navbar(linkObj: any) {

  const thisLink = linkObj.thisLink;

  function createListElement(link: string, title: string) {

    const className = link === thisLink
      ? "w-full flex flex-row items-center text-xl cursor-pointer font-medium py-4" 
      : "w-full flex items-center hover:text-xl cursor-pointer hover:font-medium";
  
    return (
      <li 
      className="w-full flex flex-row h-full items-center text-base gap-2" 
      style={link == thisLink ? {borderBottom: "2px solid black"} : {}}
      >
        <a className={className} href={link}>{title}</a>
      </li>
    );
  }

  return (
    <div className="w-full" style={{backgroundColor: "#e1e1ea"}}>
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
    {createListElement("/leaderboards", "Leaderboards")}
    {createListElement("/forum", "Forum")}
    {createListElement("/others", "Others")}
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