import { render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event'; 
import { supabase } from "@/utils/supabase/db";
import TournamentsTable from "@/components/tables/tournamentsTable";


//Have to mock the inner Navbar components as inner async function components
//Not supported by jest
jest.mock('../../components/misc/navbar', () => {
    return jest.fn().mockReturnValue(<div>Dummy Navbar</div>)
})

describe('Tournament', () => {

    test('Fetches Tournament infomation and Table rows renders correctly a', async () => {
        const res = await supabase.from("Tournaments").select("*");
        let tournaments = res.data;

        if (tournaments) {
            for (let i = 0; i < tournaments.length; i++) {
                tournaments[i].status = "Not Attempted";
            }
        }


        render(<TournamentsTable tournaments={tournaments}/>)

        expect(screen.queryAllByTestId('tournaments-row').length).toBe(tournaments.length)

    })


})