import React from 'react';
import ProfilePic from '@/components/images/profilepic';
import Link from 'next/link';

export default function LeaderboardsRow({data, index, xpType, link} : {data: any, index: number, xpType: string, link?: string}) {
  return (
    <tr
    className={`border-l border-r border-t border-gray-800 bg-gray-100 text-gray-600 ${index == 0 ? "" : "border-t"}  transition duration-300 ease-in-out hover:bg-neutral-300`}
    key={index}
    aria-label={``}>
      
      <td
      className={`text-sm  font-semibold px-2 py-4 whitespace-nowrap text-center`}
      >
      {index + 1}
      </td>
      
      <td
      className={`flex text-m font-medium py-4 pl-15 whitespace-nowrap text-sm lg:text:base text-left items-center`}
      >
      <div className='w-6 h-6 lg:w-12 lg:h-12'>
      <ProfilePic username={data.username}/>
      </div>
      {link
      ? <div className="pl-1 cursor-pointer hover:text-blue-500 hover:font-medium lg:pl-4" title='View'>
        <Link href={`${link}?user=${data.username}`}>{data.username}</Link>
        </div>
      : <p className="pl-1 lg:pl-4">{data.username}</p>}
      </td>
      
      <td
      className={`text-sm font-semibold px-6 py-4 whitespace-nowrap text-center text-green-500`}
        >
        {data[xpType]}
      </td>
      
    </tr>
    )
  }