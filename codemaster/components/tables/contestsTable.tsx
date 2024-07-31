"use client";
import completedLogo from "@/assets/completed-mark.jpg";
import attemptedLogo from "@/assets/attempted-mark.jpg";
import convertDate from "@/app/utils/dateConversion/convertDateV1";
import Link from "next/link";

export default function ContestsTable(data: any) {

  const contests: any[] = data.contests;
  contests.sort((d1, d2) => new Date(d2.created_at).getTime() - new Date(d1.created_at).getTime());

  return (
      <div className="border-2 border-gray-400 lg:w-full lg:max-w-4xl" suppressHydrationWarning={true}>
        <div
          className={`grid 
            grid-cols-[1.1fr_4.5fr_1.8fr_1.1fr]
            lg:grid-cols-[1fr_5.2fr_1.8fr_1fr] 
            w-full max-w-4xl lg:min-h-8 lg:leading-8 text-center items-center text-[0.8rem] lg:text-base font-semibold`
          }
          style={{backgroundColor: '#f0f0f0'}}>
          <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>Status</div>
          <div className="pl-1 lg:pl-4" style={{ borderRight: '1px solid rgb(156 163 175)', textAlign: 'left'}}>Contest</div>
          <div style={{borderRight: '1px solid rgb(156 163 175)'}}>Closes by</div>
          <div>Points</div>
        </div>

        {contests.map((entry: any, index: number) => {
          const link = `/questions/contest/${entry.id}`
          return <div
              key={index}
              className={`grid 
                grid-cols-[1.1fr_4.5fr_1.8fr_1.1fr] 
                lg:grid-cols-[1fr_5.2fr_1.8fr_1fr] 
                w-full max-w-4xl lg:min-h-8 lg:leading-8 text-center items-center text-[0.7rem] lg:text-sm`
              }
              style={{
                backgroundColor: 'white',
                borderTop: '1px solid rgb(156 163 175)'
              }}>
            <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>
            {entry.status === "Completed" 
            ? <img src={completedLogo.src} alt="Completed" width={0.6 * completedLogo.width}/>
            : entry.status === "Attempted" 
            ? <img src={attemptedLogo.src} alt="Attempted" width={0.6 * attemptedLogo.width}/>
            : <div className="text-gray-400">-</div>}
            </div>
            <div
            className="pl-1 cursor-pointer lg:pl-4 hover:text-blue-500 hover:font-medium"
            style={{
              borderRight: '1px solid rgb(156 163 175)',
              textAlign: "left"
            }}>
              <Link href={link}>{entry.name}</Link> 
            </div>
            <div 
            className="px-1 overflow-x-auto text-nowrap" 
            style={{borderRight: '1px solid rgb(156 163 175)'}}>
              {convertDate(entry.deadline)}
            </div>
            <div>{entry.points}</div>
          </div>
        })}
      </div>
  );
}