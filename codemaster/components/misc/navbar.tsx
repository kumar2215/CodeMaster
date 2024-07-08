import PremiumButton from "@/components/buttons/PremiumButton";
import AuthButton from "@/components/buttons/AuthButton";
import React from "react";

export default function Navbar(linkObj: any) {

  const thisLink = linkObj.thisLink;

  function createListElement(link: string, title: string) {

    const className = link === thisLink
      ? "relative flex items-center text-xl cursor-pointer font-medium py-4" 
      : "relative flex items-center hover:text-xl cursor-pointer hover:font-medium";
  
    return (
      <li className="relative flex h-full items-center text-sm lg:text-base">
        <a className={className} style={link == thisLink ? {borderBottom: "2px solid black"} : {}} href={link}>{title}</a>
      </li>
    );
  }

  return (
<div className="w-full bg-gray-100">
  <nav className="container mx-auto flex justify-center border-gray-300 p-4 w-full">
    <div className="flex flex-col lg:flex-row w-full lg:max-w-5xl">

      <ul className="flex flex-col w-full justify-center lg:justify-start items-center gap-6 p-0 lg:flex-row">

        <div className="flex w-full justify-center lg:justify-start items-center gap-6 p-0">
          {createListElement("/problemset", "Problems")}
          {createListElement("/contests", "Contests")}
        </div>

        <div className="flex w-full justify-center lg:justify-start items-center gap-6 p-0">

          {createListElement("/tournaments", "Tournaments")}
          {createListElement("/leaderboards", "Leaderboards")}

        </div>
        
        <div className="flex w-full justify-center lg:justify-start items-center gap-6 p-0">
          {createListElement("/forum", "Forum")}
          {createListElement("/profile", "Profile")}
        </div>

      </ul>

      <div className="flex w-full justify-center lg:justify-end items-center gap-3 p-3 text-sm">
        <AuthButton />
        <PremiumButton />
      </div>
    </div>
  </nav>
</div>

  );
}