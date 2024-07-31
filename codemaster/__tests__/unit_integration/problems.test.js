import { render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event'; 
import ProblemSet from "@/app/problemset/page";
import QuestionsTable  from "@/components/tables/questionsTable";
import { supabase } from "../db";

import '@testing-library/jest-dom';

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



describe('Problem set main page', () => {
    
    test('renders all 4 sections', async () => {
        render(await ProblemSet());

        const debuggingSection = screen.getByText('Debugging')
        const understandingSection =  screen.getByText('Code Understanding');
        const principlesSection =  screen.getByText('Good Code Principles');
        const refactoringSection =  screen.getByText('Code Refactoring');

        expect(debuggingSection).toBeInTheDocument();
        expect(understandingSection).toBeInTheDocument();
        expect(principlesSection).toBeInTheDocument();
        expect(refactoringSection).toBeInTheDocument();

    })

})


describe('Individual problem type test', () => {
    const sections = [
        {  type: 'Debugging' },
        { type: 'CodeUnderstanding' },
        {  type: 'Code Principles'},
        {  type: 'Refactoring'}

    ];


    sections.forEach(({type}) => {
        test(`All questions from ${type} renders correctly in the table`, async () => {

        const { data: questions, error: err2 } = await supabase
        .from('Questions')
        .select('*')
        .eq('type', type)
        .eq('purpose', 'general')
        .eq('verified', true)


        
        // Not Attempted
        expect(questions).toBeTruthy();

        if (questions) {
            for (let i = 0; i < questions.length; i++) {
                questions[i].status = "Not Attempted";
            }
        }        

        render(<QuestionsTable data={questions}/>)


        const pythonQuestions = questions.filter((question) => question.language === "Python");
        const javaQuestions = questions.filter((question) => question.language === "Java");
        const cppQuestions = questions.filter((question) => question.language === "C++");
        const jsQuestions = questions.filter((question) => question.language === "JavaScript");

        userEvent.click(screen.getByRole('button', {name: /python/i}))
        await waitFor(() => {
            expect(screen.queryAllByTestId('grid-div').length).toBe(pythonQuestions.length);
        })

        userEvent.click(screen.getByRole('button', {  name: /c\+\+/i}))
        await waitFor(() => {
            expect(screen.queryAllByTestId('grid-div').length).toBe(cppQuestions.length);
        })

        userEvent.click(screen.getByRole('button', {  name: /^JavaScript$/i}))
        await waitFor(() => {
            expect(screen.queryAllByTestId('grid-div').length).toBe(jsQuestions.length);
        })

        userEvent.click(screen.getByRole('button', {name: /^Java$/i }))
        await waitFor(() => {
            expect(screen.queryAllByTestId('grid-div').length).toBe(javaQuestions.length);
        })

        }, 5000)
    })

})