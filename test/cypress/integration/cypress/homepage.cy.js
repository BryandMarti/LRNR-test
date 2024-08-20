describe('homepage tests', () => {

  it('opens the homepage', () => {

    cy.visit('http://localhost:5173')
  })
  
  
  it('finds the Quiz Generator page from homepage', () => {

    cy.visit('http://localhost:5173')

    cy.contains('Quiz Generator')
  })
  
  it('clicks the link Quiz Generator', () => {

    cy.visit('http://localhost:5173')

    cy.contains('Quiz Generator').click()
  })
  

  it('clicking Quiz Generator navigates to new url', () => {

    cy.visit('http://localhost:5173')

    cy.contains('Quiz Generator').click()

    cy.url().should('/quiz-generator')
  })
  
})