import PremiumButton from "@/components/buttons/PremiumButton";
import AuthButton from "@/components/buttons/AuthButton";
import Link from "next/link";
import React from "react";

export default function Navbar(linkObj: any) {

  const thisLink = linkObj.thisLink;

  function createListElement(link: string, title: string) {

    const className = link === thisLink
      ? "relative flex items-center text-xl cursor-pointer font-medium py-4" 
      : "relative flex items-center hover:text-xl cursor-pointer hover:font-medium";
  
    return (
      <li className="relative flex h-full items-center text-sm lg:text-base">
        <Link className={className} style={link == thisLink ? {borderBottom: "2px solid black"} : {}} href={link}>{title}</Link>
      </li>
    );
  }

 return (
    <div className="w-full" style={{backgroundColor: "#e1e1ea"}}>
      <nav className="container mx-auto flex justify-center border-gray-300 w-full">
        <div className={`flex flex-col mt-4 lg:flex-row w-full lg:max-w-5xl lg:mt-0`}>

          <ul className="flex flex-col w-full justify-center lg:justify-start items-center gap-4 lg:flex-row">
            <div className="flex w-full justify-center lg:justify-start items-center gap-4">
              {createListElement("/problemset", "Problems")}
              {createListElement("/contests", "Contests")}
            </div>

            <div className="flex w-full justify-center lg:justify-start items-center gap-4">

              {createListElement("/tournaments", "Tournaments")}
              {createListElement("/leaderboards", "Leaderboards")}

            </div>
            
            <div className="flex w-full justify-center lg:justify-start items-center gap-4">
              {createListElement("/forum", "Forum")}
              {createListElement("/profile", "Profile")}
              {createListElement("/others", "Others")}
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