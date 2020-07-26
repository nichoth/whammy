/// <reference types="cypress" />

var host = 'http://localhost:8888/'

describe('buy things page', function () {
    it('should disable buying things if nothing is in the cart', function () {
        cy.visit(host + 'cart')
        cy.get('a.buy')
            .should('not.exist')
      // document.querySelector('a.buy')
    })

    // it('should show error messages', function () {
    //     cy.visit(host)
    //     expect(true).to.equal(true)
    // })
})

describe('add to cart', function () {
    it('should add a thing to the cart', function () {
        cy.visit(host)
    })
})

// context('Actions', () => {
//   beforeEach(() => {
//     cy.visit('https://example.cypress.io/commands/actions')
//   })

//   it('.type() - type into a DOM element', () => {
//     // https://on.cypress.io/type
//     cy.get('.action-email')
//       .type('fake@email.com').should('have.value', 'fake@email.com')
//   })

// })