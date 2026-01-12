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

describe('login as admin', function () {
  beforeEach(function () {
    cy.visit('/admin/index.php');
  });

  it('success login', function () {
    // const admin = require('../fixtures/admin.json');
    // cy.fillForm(admin.email, admin.password);
    const adminName = 'admin';
    cy.fillFormFromJSON(adminName);
    cy.contains('Управление залами').should('be.visible');
  });

  it('should not login with incorrect login', function () {
    const adminName = 'incorrect login';
    const adminJSONData = 'invalid_admin';
    cy.fillFormFromJSON(adminName, adminJSONData);
    cy.contains('Ошибка авторизации!').should('be.visible');
  });

  it('should not login with incorrect password', function () {
    const adminName = 'incorrect password';
    const adminJSONData = 'invalid_admin';
    cy.fillFormFromJSON(adminName, adminJSONData);
    cy.contains('Ошибка авторизации!').should('be.visible');
  });

  it('should not login with empty email', function () {
    const adminName = 'empty email';
    const adminJSONData = 'invalid_admin';
    cy.fillFormFromJSON(adminName, adminJSONData);
    cy.get(this.selectors.adminLoginPage.emailInput)
      .then(($el) => $el[0].checkValidity())
      .should('be.false');
  });

  it('should not login with empty password', function () {
    const adminName = 'empty password';
    const adminJSONData = 'invalid_admin';
    cy.fillFormFromJSON(adminName, adminJSONData);
    cy.get(this.selectors.adminLoginPage.passwordInput)
      .then(($el) => $el[0].checkValidity())
      .should('be.false');
  });
});

describe('book seats', function () {
  beforeEach(function () {
    cy.visit('/admin/index.php');
  });

  it('find film and book seats', function () {
    const adminName = 'admin';
    const daysAhead = Math.floor(Math.random() * 6) + 2;
    const seats = require('../fixtures/seats.json');
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
    cy.chooseSeats(seats);
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
