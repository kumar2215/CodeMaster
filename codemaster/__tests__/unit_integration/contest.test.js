import { render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event'; 
import ContestsTable from '@/components/tables/contestsTable'
import { supabase } from "@/utils/supabase/db";


//Have to mock the inner Navbar components as inner async function components
//Not supported by jest
jest.mock('../../components/misc/navbar', () => {
    return jest.fn().mockReturnValue(<div>Dummy Navbar</div>)
})

describe('Contests', () => {

    test('Fetches contests infomation and Table rows renders correctly ', async () => {
        const res = await supabase.from("Contests").select("*");
        const contests = res.data;

        if (contests) {
            for (let i = 0; i < contests.length; i++) {
                contests[i].status = "Not Attempted";
            }
        }

        console.log(contests, 'helloworld')

        render(<ContestsTable contests={contests}/>)

        expect(screen.queryAllByTestId('contest-row').length).toBe(contests.length)

    })


})