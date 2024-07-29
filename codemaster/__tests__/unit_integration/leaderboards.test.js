import { render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event'; 
import { describe } from "node:test";
import { LeaderboardsTable } from '@/app/leaderboards/LeaderboardsTable'
import { LeaderboardsPage } from "@/app/leaderboards/LeaderboardsPage";
import Page from "@/app/leaderboards/page"
import { supabase } from "../db";


jest.mock('../../app/utils/misc/checkInUser', () => {
    const  data =            {
        XP: 500,
        username: 'user123',
        tournament_XP: 200,
        contest_XP: 300,
        XP: 100,
        user_type: 'admin',
        preferences : null
      }
    return [supabase, {data}]
  });

  jest.mock('../../utils/supabase/server', () => {
    // Mock the structure of supabase client
    const supabaseMock = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { 
            user_metadata : { username: "test" }
           } },
        }),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data:             {
            XP: 500,
            username: 'user123',
            tournament_XP: 200,
            contest_XP: 300,
            XP: 100,
            user_type: 'admin',
            preferences: {"body":{"backgroundColor":"#80bfff","color":"#000000"},"header":{"backgroundColor":"#e1e1ea","color":"#000000"},"codeColorTheme":"github"}
          },
        error: null,
      }),
    };
  
    return {
      createClient: () => supabaseMock,
    };
  });
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