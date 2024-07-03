"use client"
import React from 'react'
import { LeaderboardsRow } from './LeaderboardsRow';

export const LeaderboardsTable = ({data, xpType, header}) => {

  return (
    <div className="min-h-screen h-full flex flex-col items-center pb-14 m-0 w-full">
      <article className="w-10/12 px-2 ">
  
    {/*TABLE */}
    <div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none r rounded-tl-xl rounded-tr-xl">
    <table className="table-fixed  overflow-scroll md:overflow-auto w-full text-left font-inter rounded-lg border-l border-r border-gray-800 ">
    {/**Table header */}
      <thead
        className={` rounded-lg text-base text-white font-semibold w-full border-grey bg-neutral-800 border-b`}
      >
        <tr className="bg-[#222E3A]/[6%]  border-grey">
          <th className="text-xs font-medium px-0 py-4 text-center w-2/12">
            RANK
          </th>
          <th className="text-xs font-medium pl-24 py-4 text-left w-7/12">               
            USER
          </th>
          <th className="text-xs font-medium px-6 py-4 text-center w-3/12">
            {header}
        </th>
        </tr>
      </thead>
      <tbody className="border-grey border-gray-700 border-b ">
          {data.map((data, index) => {
            return (<LeaderboardsRow data={data} index={index} key={index} xpType={xpType}/>)
          })}
        </tbody>
    </table>
    </div>
  </article>
    </div>
  )
}
