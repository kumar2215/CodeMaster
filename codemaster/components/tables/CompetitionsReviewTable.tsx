"use client";
import Link from "next/link";

export default function CompetitionReviewTable({competitions, type} : {competitions: any[], type: string}) {

  return (
    <div className="border-2 border-gray-400">
    <div
    className={`grid 
      grid-cols-[4fr_3fr_2fr_1.6fr]
      lg:grid-cols-[6fr_1.6fr_1.1fr_1.1fr] 
      w-full max-w-4xl lg:min-h-8 lg:leading-8 text-center items-center text-[0.8rem] lg:text-base font-semibold`
    }
    style={{backgroundColor: '#f0f0f0'}}>
    <div className="pl-1 lg:pl-4" style={{ borderRight: '1px solid rgb(156 163 175)', textAlign: 'left'}}>Name</div>
    <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>Completed by</div>
    <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>Average</div>
    <div>Points</div>
    </div>
    
    {competitions.map((entry: any, index: number) => {
      const totalQuestions = entry.questions.length;
      const link = `/review/competition?type=${type}&id=${entry.id}&totalQuestions=${totalQuestions}`;
      const completed_by = Object.keys(entry.users_completed).length;
      const totalXP = entry.users_completed.reduce((x: any, y: any) => x + y.pointsAccumulated, 0);
      const average_score = completed_by === 0 ? 0 : totalXP / completed_by;

      return (
        <div
          key={index}
          className={`grid 
            grid-cols-[4fr_3fr_2fr_1.6fr]
            lg:grid-cols-[6fr_1.6fr_1.1fr_1.1fr] 
            w-full max-w-4xl lg:min-h-8 lg:leading-8 text-center items-center text-[0.7rem] lg:text-sm`
          }
          style={{
            backgroundColor: 'white',
            borderTop: '1px solid rgb(156 163 175)'
          }}>
        <div 
        className="pl-1 cursor-pointer hover:text-blue-500 hover:font-medium lg:pl-4"
        style={{ 
          borderRight: '1px solid rgb(156 163 175)', 
          textAlign: 'left'
        }}>
        <Link href={link}>{entry.name}</Link>
        </div>
        <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>{completed_by}</div>
        <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>{average_score}</div>
        <div>{entry.points}</div>
        </div>
      );
    })}
  </div>
  );
}