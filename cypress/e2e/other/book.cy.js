before(function () {
  cy.fixture('selectors').then((selectors) => {
    this.selectors = selectors;
  });
});

describe('book seats', function () {
  beforeEach(function () {
    cy.visit('/admin/index.php');
  });

  it('find film and book seats', function () {
    const adminName = 'admin';
    const daysAhead = Math.floor(Math.random() * 6) + 2;
    const expectedText = 'Вы выбрали билеты';
    const ticketHallInfo = 'В зале';

    cy.fillFormFromJSON(adminName);
    // cy.wait(500);
    cy.createFilmsMap().then((result) => {
      // cy.wrap(result).as('movieTitles');
      // cy.log(JSON.stringify(result));
      cy.chooseRandomFilmAndHall(result);
    });
    // cy.get('@filmHallPair').then((pair) => {
    //   cy.log(pair.randomFilm);
    //   cy.log(pair.randomHall);
    // });
    cy.visit('/');
    cy.chooseFutureDay(daysAhead);
    cy.get('@filmHallPair').then((pair) => {
      cy.chooseFilmAndHall(pair.randomFilm, pair.randomHall);
    });
    cy.fixture('seats').then((seats) => {
      cy.chooseSeats(seats);
    })
    cy.get(this.selectors.buyingPage.buttonAccept).click();

    cy.get('@filmHallPair').then((pair) => {
      cy.contains(expectedText).should('be.visible');
      cy.get(this.selectors.paymentPage.ticketTitle).should(
        'have.text',
        pair.randomFilm,
      );
      cy.contains(this.selectors.paymentPage.ticketInfo, ticketHallInfo)
        .find(this.selectors.paymentPage.ticketHall)
        .should('have.text', pair.randomHall);
    });
  });
});
