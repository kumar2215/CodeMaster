import React from 'react';
import ProfilePic from '@/components/images/profilepic';

export const LeaderboardsRow = ({data, index, xpType}) => {
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
                {data.username}
            </td>

            <td
              className={`text-sm font-semibold px-6 py-4 whitespace-nowrap text-center text-green-500
              `}
            >
              {data[xpType]}
            </td>

          </tr>
  )
}