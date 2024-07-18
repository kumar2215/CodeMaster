import { screen, render } from "@testing-library/react"
import ProfilePage from "@/app/profile/page"

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
            user_type: 'admin'
          },
        error: null,
      }),
    };
  
    return {
      createClient: () => supabaseMock,
    };
  });


describe('Profile', () => {
    test('3 create sections topic cards displayed', async () => {
        render(await ProfilePage());
        expect(screen.getAllByTestId('topicCard').length).toBe(3);
    })

})