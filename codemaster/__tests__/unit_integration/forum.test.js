import Forum from "@/app/forum/page"
import { screen, render } from "@testing-library/react"

//Have to mock the inner Navbar components as inner async function components
//Not supported by jest
jest.mock('../../components/misc/navbar', () => {
    return jest.fn().mockReturnValue(<div>Dummy Navbar</div>)
})

// Mock the supabase module
jest.mock('../../utils/supabase/server', () => {
    // Mock the structure of supabase client
    const supabaseMock = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { /* user data */ } },
        }),
      },
    };
  
    return {
      createClient: () => supabaseMock,
    };
  });


describe('Forum', () => {
    test('5 forum sections topic cards displayed', async () => {
        render(await Forum());
        expect(screen.getAllByTestId('topicCard').length).toBe(5);
    })

})