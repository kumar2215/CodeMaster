import { render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event'; 
import { describe } from "node:test";
import { supabase } from "@/utils/supabase/db";
import { LeaderboardsTable } from '@/app/leaderboards/LeaderboardsTable'
import { LeaderboardsPage } from "@/app/leaderboards/LeaderboardsPage";
import Page from "@/app/leaderboards/page"


// const mockAuth = {
//     getUser: jest.fn().mockResolvedValue({
//       data: { user: { /* mocked user data */ } }
//     })
//   };
  
//   jest.mock('../../utils/supabase/server', () => ({
//     __esModule: true,
//     createClient: () => ({
//       ...supabase, 
//       auth: mockAuth
//     })
//   }));

describe('Leaderboards', () => {


    test('all Leaderboards tables are rendered', async () => {
        const sortedByTotalXP = [
            {
              XP: 500,
              username: 'user123',
              tournament_XP: 200,
              contest_XP: 300,
              total_XP: 1000
            }
        ]
        const sortedByTournamentXP = [
            {
              XP: 500,
              username: 'user123',
              tournament_XP: 200,
              contest_XP: 300,
              total_XP: 1000
            }
        ]
        const sortedByContestXP = [
            {
              XP: 500,
              username: 'user123',
              tournament_XP: 200,
              contest_XP: 300,
              total_XP: 1000
            }
        ]
        render(<LeaderboardsPage sortedByContestXP={sortedByContestXP} sortedByTotalXP={sortedByTotalXP} sortedByTournamentXP={sortedByTournamentXP}/>)


        await userEvent.click(screen.getByRole('button', {  name: /contests leaderboards/i
        }))
        expect(screen.getByRole('table'))

        await userEvent.click(screen.getByRole('button', {  name: /tournaments leaderboards/i
        }))
        expect(screen.getByRole('table'))

        await userEvent.click(screen.getByRole('button', {  name: /general leaderboards/i
        }))
        expect(screen.getByRole('table'))


    })



})