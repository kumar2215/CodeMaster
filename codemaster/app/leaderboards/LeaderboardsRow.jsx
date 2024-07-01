import React from 'react'

export const LeaderboardsRow = ({data, index, xpType}) => {
    console.log(data, xpType)
    return (
        <tr
        className={`border-l border-r border-t border-gray-800 bg-gray-100 text-gray-600 ${index == 0 ? "" : "border-t"}  transition duration-300 ease-in-out hover:bg-neutral-300`}
            key={index}
            aria-label={`${data.itemName}`}>
            <td
                className={`text-sm  font-semibold px-2 py-4 whitespace-nowrap text-center`}
            >
                {index + 1}
            </td>

            <td
                className={`text-m font-medium py-4 pl-20 whitespace-nowrap text-left flex items-center`}
              >
                <div className='w-12 h-12'>
                    <img src={`https://api.dicebear.com/8.x/personas/svg?seed=${data.username}`} alt="avatar"
                    className="h-full w-full rounded-full object-cover"/>
                </div>
                {data.username}

            </td>

            <td
              className={`text-sm  font-semibold px-6 py-4 whitespace-nowrap text-center text-green-500
              `}
            >
              {data[xpType]}
            </td>

          </tr>
  )
}
