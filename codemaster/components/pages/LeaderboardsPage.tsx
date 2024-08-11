"use client"
import React from 'react'
import LeaderboardsTable from '@/components/tables/LeaderboardsTable';
import { useState } from 'react'

export default function LeaderboardsPage(
  {sortedByContestXP, sortedByTotalXP, sortedByTournamentXP}
: {sortedByContestXP: any, sortedByTotalXP: any, sortedByTournamentXP: any}  
) {
    const [leaderboardType, setLeaderboardType] = useState('total')

    function buttonHandler(e: any) {
        e.preventDefault();
        setLeaderboardType(e.target.value);
    }

    function renderLeaderboardsTable() {
        switch (leaderboardType) {
          case 'total':
            return <LeaderboardsTable data={sortedByTotalXP} header={"Total XP"} xpType={"total_XP"}/>;
          case 'tournament':
            return <LeaderboardsTable data={sortedByTournamentXP} header={"Total Tournament XP"} xpType={"tournament_XP"}/>;
          case 'contest':
            return <LeaderboardsTable data={sortedByContestXP} header={"Total Contests XP"} xpType={"contest_XP"}/>;
          default:
            return null; // Handle default case if necessary
        }
      }

  return (
    <div className="flex flex-col items-center justify-center w-full text-xl font-bold">
        <div className='flex flex-col w-1/2 gap-4 lg:flex-row'>
            <button className="lg:w-4/12 btn btn-neutral" value="total" onClick={buttonHandler}>General Leaderboards</button>
            <button className="lg:w-4/12 btn btn-neutral" value="tournament" onClick={buttonHandler}>Tournaments Leaderboards</button>
            <button className="lg:w-4/12 btn btn-neutral" value="contest" onClick={buttonHandler}>Contests Leaderboards</button>
        </div>

        <div className='w-full mt-4'>
        {leaderboardType && renderLeaderboardsTable()}
        </div>

        <br/>        
    </div>
  )
}