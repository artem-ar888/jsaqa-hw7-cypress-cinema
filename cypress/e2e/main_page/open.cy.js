before(function () {
  cy.fixture('selectors').then((selectors) => {
    this.selectors = selectors;
  });
});

describe('load main page', function () {
  beforeEach(function () {
    cy.visit('/');
  });

  it('should open main page', function () {
    cy.get(this.selectors.mainPage.pageTitle)
      .contains('Идёмвкино')
      .should('be.visible');
  });

  it('should show correct number of days', function () {
    cy.get(this.selectors.mainPage.daysNavigation).should('have.length', 7);
  });
});