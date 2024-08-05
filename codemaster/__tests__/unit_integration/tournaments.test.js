import { render, screen, waitFor } from "@testing-library/react";
import TournamentsTable from "@/components/tables/tournamentsTable";
import { createClient } from "../../utils/supabase/client";

const supabase = createClient();

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