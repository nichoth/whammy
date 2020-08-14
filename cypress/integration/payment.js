/// <reference types="cypress" />

var host = 'http://localhost:8888/'

describe('buy things page', function () {
    it('should disable buying things if nothing is in the cart', function () {
        cy.visit(host + 'cart')
        cy.get('a.buy')
            .should('not.exist')
    })
})

describe('add to cart', function () {
    it('should add a thing to the cart', function () {
        cy.visit(host)
        cy.get('.product a:first')
            .click()
        cy.get('form').submit()

        cy.get('a.buy')
            .click()
    })
})

describe('shipping', function () {
    it('should be a form', function () {
        cy.get('form')
    })
})

describe('buy something', function () {
    it('should do something', function () {
        cy.wait(5000)
        cy.getWithinIframe('[name="cardnumber"]').type('4111111111111111');
        cy.getWithinIframe('[name="exp-date"]').type('1222');
        cy.getWithinIframe('[name="cvc"]').type('111');
        cy.getWithinIframe('[name="postal"]').type('12345');
    })

})



function createOutOfStockThing () {
    return {
        "type": "ITEM",
        "id": "3FIRPMR22IQRVLCY2YUJK4SD",
        "updated_at": "2020-08-13T04:32:41.999Z",
        "version": 1597293161999,
        "is_deleted": false,
        "present_at_all_locations": true,
        "image_id": "6Z7SKCR3DJPPRB3Q6ZC6QQ46",
        "item_data": {
            "name": "out of stock thing",
            "description": "description example",
            "category_id": "2F7BGFWMAYMKONHXQSFDLFOB",
            "tax_ids": [
                "R5DUEVVRRTSINCKI27POCYPU"
            ],
            "variations": [
                {
                    "type": "ITEM_VARIATION",
                    "id": "2RNS4EH37GAAC3FQNGYUSHVM",
                    "updated_at": "2020-08-13T04:30:47.679Z",
                    "version": 1597293047679,
                    "is_deleted": false,
                    "present_at_all_locations": true,
                    "item_variation_data": {
                        "item_id": "3FIRPMR22IQRVLCY2YUJK4SD",
                        "name": "Regular",
                        "sku": "",
                        "ordinal": 1,
                        "pricing_type": "FIXED_PRICING",
                        "price_money": {
                            "amount": 1200,
                            "currency": "USD"
                        },
                        "location_overrides": [
                            {
                                "location_id": "PR4NVQPCRMEYP",
                                "track_inventory": true
                            }
                        ]
                    }
                }
            ],
            "product_type": "REGULAR",
            "skip_modifier_screen": false
        },
        "imageUrl": "https://square-catalog-sandbox.s3.amazonaws.com/files/9c5200c7ea5fdd59aa54cca938bc92134ec666c1/original.jpeg",
        "inventory": {
            "catalog_object_id": "2RNS4EH37GAAC3FQNGYUSHVM",
            "catalog_object_type": "ITEM_VARIATION",
            "state": "IN_STOCK",
            "location_id": "PR4NVQPCRMEYP",
            "quantity": "0",
            "calculated_at": "2020-08-13T04:31:12.8134Z"
        },
        "tax": {
            "type": "TAX",
            "id": "R5DUEVVRRTSINCKI27POCYPU",
            "updated_at": "2020-07-28T04:13:54.687Z",
            "version": 1595909634687,
            "is_deleted": false,
            "present_at_all_locations": true,
            "tax_data": {
                "name": "Sales Tax",
                "calculation_phase": "TAX_TOTAL_PHASE",
                "inclusion_type": "ADDITIVE",
                "percentage": "8.5",
                "applies_to_custom_amounts": true,
                "enabled": true
            }
        }
    }
}



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
