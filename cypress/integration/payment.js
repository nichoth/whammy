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
        // document.querySelector('.product a')
        cy.get('.product a:first')
            .click()
        cy.get('form').submit()

        cy.get('a.buy')
            .click()

        cy.wait(5000)

        cy.get('iframe')
            .then((frame) => {
                // var doc = frame.contents()
                // console.log('here', doc.find('input'))
                // doc.find('[name="cardnumber"]')
                //     .type('4242')
                // cy.wrap(doc.find('input'))
                //     .type('4242')
            })

        cy.getWithinIframe('[name="cardnumber"]').type('4242424242424242');
        // cy.getWithinIframe('[name="exp-date"]').type('1222');
        // cy.getWithinIframe('[name="cvc"]').type('123');
        // cy.getWithinIframe('[name="postal"]').type('12345');
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