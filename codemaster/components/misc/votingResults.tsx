"use client";
import ProfilePic from "@/components/images/profilepic";
import placeInCodeBox from "@/components/codeBoxes/CodeBox";
import Image from "next/image";
import gold_medal from "@/assets/gold_medal.jpg";
import silver_medal from "@/assets/silver_medal.jpg";
import bronze_medal from "@/assets/bronze_medal.jpg";

export default function VotingResults({winingData, language, colorTheme} :
  {winingData: any[], language: string, colorTheme: string}
) {

  return (
    <div className="flex flex-col w-full max-w-5xl gap-6 mt-4">
      <h1 className="text-2xl font-semibold text-left">Voting Results:</h1>
      
      {/* 1st Place */}
      <div className="flex flex-row w-full gap-0 bg-gray-200 rounded-md">
        <div className="flex flex-col gap-3 mt-5 ml-2 w-fit">
          <Image src={gold_medal} alt="gold medal" width={150} height={150} />
          <div className="flex flex-row w-full gap-2">
            <h1 className="mt-1 text-lg font-semibold text-left">{`By:  ${winingData[0].username}`}</h1>
            <ProfilePic username={winingData[0].username} style={{width: "30px", height: "30px"}} />
          </div>
          <h1 className="text-lg font-semibold text-left">{`XP Awarded: ${winingData[0].score}`}</h1>
        </div>
        {placeInCodeBox(winingData[0].code, language, colorTheme)}
      </div>

      {/* 2nd Place */}
      <div className="flex flex-row w-full gap-0 bg-gray-200 rounded-md">
        <div className="flex flex-col gap-3 mt-5 ml-2 w-fit">
          <Image src={silver_medal} alt="silver medal" width={150} height={150} />
          <div className="flex flex-row w-full gap-2">
            <h1 className="mt-1 text-lg font-semibold text-left">{`By:  ${winingData[1].username}`}</h1>
            <ProfilePic username={winingData[1].username} style={{width: "30px", height: "30px"}} />
          </div>
          <h1 className="text-lg font-semibold text-left">{`XP Awarded: ${winingData[1].score}`}</h1>
        </div>
        {placeInCodeBox(winingData[1].code, language, colorTheme)}
      </div>

      {/* 3rd Place */}
      <div className="flex flex-row w-full gap-0 bg-gray-200 rounded-md">
        <div className="flex flex-col gap-3 mt-5 ml-2 w-fit">
          <Image src={bronze_medal} alt="bronze medal" width={150} height={150} />
          <div className="flex flex-row w-full gap-2">
            <h1 className="mt-1 text-lg font-semibold text-left">{`By:  ${winingData[2].username}`}</h1>
            <ProfilePic username={winingData[2].username} style={{width: "30px", height: "30px"}} />
          </div>
          <h1 className="text-lg font-semibold text-left">{`XP Awarded: ${winingData[2].score}`}</h1>
        </div>
        {placeInCodeBox(winingData[2].code, language, colorTheme)}
      </div>

    </div>

  );

}