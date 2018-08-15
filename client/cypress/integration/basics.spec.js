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
      cy.get('header button[aria-label=Login]').should(
        'have.text',
        'Login / Register'
      )
    })
  })

  describe('Menu', () => {
    it('Opens menu through header', () => {
      cy.get('nav').should('not.be.visible')
      cy.get('header button[aria-label=Menu]').click({ force: true })
      cy.get('nav').should('be.visible')
    })
    it('Closes menu through esc key', () => {
      cy.get('nav').should('not.be.visible')
      cy.get('header button[aria-label=Menu]').click({ force: true })
      cy.get('nav').should('be.visible')
      cy.get('body').type('{esc}')
      cy.get('nav').should('not.be.visible')
    })
    it('Closes menu through click on background', () => {
      cy.get('nav').should('not.be.visible')
      cy.get('header button[aria-label=Menu]').click({ force: true })
      cy.get('nav').should('be.visible')
      cy.get('nav')
        .parents('[role=document]')
        .siblings('[aria-hidden=true]')
        .click()
      cy.get('nav').should('not.be.visible')
    })
  })
})
