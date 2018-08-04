context('Basics', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Home', () => {
    it('Renders welcome message', () => {
      cy.get('h1').should('have.text', 'Gatsby Starter Collaborative App')
    })
    it('Renders login & signin buttons', () => {
      cy.get('main a[href="/login"]').should('have.text', 'Login / Register')
    })
  })

  describe('Header', () => {
    it('Renders dynamic login button', () => {
      cy.get('header button').should('have.text', 'Login / Register')
    })
  })
})
