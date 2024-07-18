
describe('Submit question', () => {
  beforeEach(() => {
    cy.visit('localhost:3000')
    //login
    cy.get('[href="/login"]').click();
    cy.get('[placeholder="you@example.com"]').type('lingziyan2015@gmail.com')
    cy.get('[placeholder="••••••••"]').type('user123')
    cy.get('.bg-blue-400').click()
  })
  it('Freestyle question gives correct response for wrong and correct answers', () => {


    //go to debugging
    cy.get('[href="/problemset/debugging"]').click()
    //click on javsacript
    cy.get('.flex-row > :nth-child(4)').click()
    cy.contains('a', /binary search/i).click();


    cy.wait(5000)
    cy.contains('button', 'Submit').click();
    cy.get('.pr-5').should('contain', '❌')


    cy.get(':nth-child(3) > .CodeMirror-line').type('{backspace}{backspace};')
    cy.get(':nth-child(6) > .CodeMirror-line').type('{backspace}{backspace}{backspace}123);')
    cy.contains('button', 'Submit').click();
    cy.get('.pr-5').should('contain', '✅')

  })

  it('MCQ question gives correct response for wrong and correct answers', () => {
    cy.get('[href="/problemset/understanding"]').click()

    //Get Wrong when clicking on wrong option
    cy.contains('a', /Abnormally/i).click();
    cy.contains('label', 'ABCDE').click();
    cy.contains('button', 'Submit').click();
    cy.get('.pr-5').should('contain', '❌')


    cy.reload()

    //Correct when clicking on right option 
    cy.contains('label', 'ADE').click();
    cy.contains('button', 'Submit').click();
    cy.get('.pr-5').should('contain', '✅')

  })

  it('MRQ question gives correct response for wrong and correct answers', () => {
    cy.get('[href="/problemset/understanding"]').click()
    cy.contains('a', /Some Sort of Algorithm/i).click();
    cy.contains('label', 'The subarray arr[0,i] contains the i + 1 smallest elements in the array.').click();
    cy.contains('button', 'Submit').click();
    cy.get('.pr-5').should('contain', '❌')

    cy.reload()

    //Correct when clicking on right option 
    cy.contains('label', 'The subarray arr[0,i] contains the i + 1 largest elements in the array.').click();
    cy.contains('label', 'The subarray arr[n-i-1,n-1] contains the i + 1 smallest elements in the array.').click();

    cy.contains('button', 'Submit').click();
    cy.get('.pr-5').should('contain', '✅')

  })


})

describe('Forum', () => {
  beforeEach(() => {
    cy.visit('localhost:3000')
    //login
    cy.get('[href="/login"]').click();
    cy.get('[placeholder="you@example.com"]').type('lingziyan2015@gmail.com')
    cy.get('[placeholder="••••••••"]').type('user123')
    cy.get('.bg-blue-400').click()
  })

  it('Can post to forum and see my own post and comment and upvote', () => {
    //go to forum navbar
    cy.get(':nth-child(5) > .relative').click()
    cy.get('[href="/forum/general"] > [data-testid="topicCard"]').click()
    cy.contains('button', 'Create Discussion').click()
    cy.get('input[name="title"]').type('E2E Discussion Test');
    cy.get('textarea[name="content"]').type('E2E Discussion Test');
    cy.contains('button', 'Create').click()

    //Go back to general discussio npage
    cy.get(':nth-child(5) > .relative').click()
    cy.get('[href="/forum/general"] > [data-testid="topicCard"]').click()
    cy.contains('a', 'E2E Discussion Test').should('exist');
    cy.contains('a', 'E2E Discussion Test').click()

    //Test for reply
    cy.get('img[alt="reply button"]').click()
    cy.get('textarea[placeholder="Write your reply here..."]').type('Testing E2E reply')
    //Click reply button. 
    cy.get('[data-cy="submit_button"]').click();
    cy.reload()
    cy.wait(400)
    cy.get('img[alt="comment button"]').click()
    cy.contains(/Testing E2E reply/i).should('exist');





  })

})

describe.only('Create', () => {
  beforeEach(() => {
    cy.visit('localhost:3000')
    //login
    cy.get('[href="/login"]').click();
    cy.get('[placeholder="you@example.com"]').type('lingziyan2015@gmail.com')
    cy.get('[placeholder="••••••••"]').type('user123')
    cy.get('.bg-blue-400').click()
    cy.get(':nth-child(6) > .relative').click()

  })

  it('Create Tournament works', () => {

    cy.get('[href="/profile/createTournament"]').click()

    cy.get('input[name="name"]').type('E2E Tournament testing')
    cy.get('input[name="deadline"]').invoke('val', '2023-10-20').trigger('change');
    cy.contains('button', 'Add Question').click()

    //Enter Question 1 fields
    cy.get('input[name="questions.0.title"]').type('E2E Tournament testing Question 1')
    cy.get('input[name="questions.0.type"]').invoke('val', 'Code Principles').trigger('change')
    cy.get('input[name="questions.0.difficulty"]').invoke('val', 'Easy').trigger('change')
    cy.get('input[name="questions.0.language"]').invoker('val', 'Python').trigger('change')
    cy.get('input[name="questions.0.source.src"]').type('Anonymous')

    cy.contains('button', 'Add text content').click()
    cy.contains('button', 'Add code content').click()

    cy.get('textarea[name="questions.0.contents.0.value"]').type('Question 1 content ')
    //Could use a better query here
    cy.get('.CodeMirror-line').type('print("helloworld")')

    cy.contains('button', 'Add Multiple Responses').click()



  })



})