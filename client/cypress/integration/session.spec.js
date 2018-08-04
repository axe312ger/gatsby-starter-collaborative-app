context('Session', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Home Login', () => {
    it('link redirects to Auth0', () => {
      cy.get('main a[href="/login"]').click()
      cy.location().should(loc => {
        expect(loc.pathname).to.eq('/login')
        expect(loc.host).to.eq('gatsby-starter-collaborative-app.eu.auth0.com')
      })
    })
  })

  describe('Header login', () => {
    it('button redirects to Auth0', () => {
      cy.get('header button').click()
      cy.location().should(loc => {
        expect(loc.pathname).to.eq('/login')
        expect(loc.host).to.eq('gatsby-starter-collaborative-app.eu.auth0.com')
      })
    })
  })
})
