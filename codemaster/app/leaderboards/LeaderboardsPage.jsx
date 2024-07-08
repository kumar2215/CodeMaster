"use client"
import React, { use } from 'react'
import { LeaderboardsTable } from './LeaderboardsTable'
import { useState } from 'react'

export const LeaderboardsPage = ({sortedByContestXP, sortedByTotalXP, sortedByTournamentXP}) => {
    const [leaderboardType, setLeaderboardType] = useState('codemasters')

    function buttonHandler(e) {
        e.preventDefault();
        setLeaderboardType(e.target.value);
    }

    function renderLeaderboardsTable() {
        switch (leaderboardType) {
          case 'codemasters':
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
    <div className="text-xl font-bold w-full flex flex-col items-center justify-center">
      <div className='flex flex-col lg:flex-row justify-center items-center gap-3'>
          <button className="btn btn-neutral w-full lg:w-auto" value="codemasters" onClick={buttonHandler}>General Leaderboards</button>
          <button className="btn btn-neutral w-full lg:w-auto" value="tournament" onClick={buttonHandler}>Tournaments Leaderboards</button>
          <button className="btn btn-neutral w-full lg:w-auto" value="contest" onClick={buttonHandler}>Contests Leaderboards</button>
      </div>


        <div className='w-full mt-4'>
        {leaderboardType && renderLeaderboardsTable()}
        </div>

        
    </div>
  )
}