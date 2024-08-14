"use client"
import React from 'react'
import LeaderboardsRow from '@/components/misc/leaderboardsRow';

export default function LeaderboardsTable(
  {data, xpType, header, link} 
: {data: any[], xpType: string, header: string, link?: string}
) {

  data.sort((a, b) => b[xpType] - a[xpType]);

  return (
    <div className="flex flex-col items-center w-full h-full min-h-screen m-0 pb-14">
      <article className="w-10/12 px-2 ">
    
      {/*TABLE */}
      <div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none r rounded-tl-xl rounded-tr-xl">
      <table className="w-full overflow-scroll text-left border-l border-r border-gray-800 rounded-lg table-fixed md:overflow-auto font-inter ">
      {/**Table header */}
        <thead
          className={` rounded-lg text-base text-white font-semibold w-full border-grey bg-neutral-800 border-b`}
        >
          <tr className="bg-[#222E3A]/[6%]  border-grey">
            <th className="w-1/6 px-0 py-4 text-xs font-medium text-center">
              RANK
            </th>
            <th className="w-1/2 py-4 text-xs font-medium text-left lg:w-7/12 pl-18">               
              USER
            </th>
            <th className="w-1/3 px-6 py-4 text-xs font-medium text-center">
              {header}
          </th>
          </tr>
        </thead>
        <tbody className="border-b border-gray-700 border-grey ">
            {data.map((rowData, index) => {
              return (<LeaderboardsRow data={rowData} index={index} key={index} xpType={xpType} link={link}/>)
            })}
          </tbody>
      </table>
      </div>
      </article>
    </div>
  )
}
