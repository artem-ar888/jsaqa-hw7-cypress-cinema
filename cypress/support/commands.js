// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
const selectors = require('../fixtures/selectors.json');

Cypress.Commands.add('fillForm', (email, password) => {
  if (email !== '') {
    cy.get(selectors.adminLoginPage.emailInput).type(email);
  } else {
    cy.get(selectors.adminLoginPage.emailInput).clear();
  }
  if (password !== '') {
    cy.get(selectors.adminLoginPage.passwordInput).type(password);
  } else {
    cy.get(selectors.adminLoginPage.passwordInput).clear();
  }
  cy.get(selectors.adminLoginPage.submitButton).click();
});

Cypress.Commands.add('fillFormFromJSON', (adminName, fixtureFile) => {
  if (!fixtureFile) {
    fixtureFile = 'admin';
  }
  cy.fixture(fixtureFile).then((data) => {
    let admin;
    if (!Array.isArray(data)) {
      admin = data;
    } else {
      admin = data.find((user) => user.name === adminName);
    }
    if (admin.email !== '') {
      cy.get(selectors.adminLoginPage.emailInput).type(admin.email);
    } else {
      cy.get(selectors.adminLoginPage.emailInput).clear();
    }
    if (admin.password !== '') {
      cy.get(selectors.adminLoginPage.passwordInput).type(admin.password);
    } else {
      cy.get(selectors.adminLoginPage.passwordInput).clear();
    }
    cy.get(selectors.adminLoginPage.submitButton).click();
  });
});

Cypress.Commands.add('createFilmsMap', () => {
  return cy.get(selectors.adminPage.seancesMovieTitle).then(($titles) => {
    const filmsObject = {};
    $titles.each((_, el) => {
      const filmName = el.textContent.trim();
      cy.wrap(el)
        .closest(selectors.adminPage.seancesHall)
        .find(selectors.adminPage.seancesTitle)
        .invoke('text')
        .then((hallTitle) => {
          if (!filmsObject[filmName]) {
            filmsObject[filmName] = [];
          }
          filmsObject[filmName].push(hallTitle.trim());
        });
    });
    return cy.wrap(filmsObject);
  });
});

Cypress.Commands.add('chooseRandomFilmAndHall', (result) => {
  const films = Object.keys(result);
  const randomFilm = films[Math.floor(Math.random() * films.length)];
  const hallsList = result[randomFilm];
  const randomHall = hallsList[Math.floor(Math.random() * hallsList.length)];
  // cy.log(randomFilm);
  // cy.log(randomHall);
  cy.get(selectors.adminPage.stepStartSales).then(($container) => {
    const $hallElem = $container
      .find(selectors.adminPage.hallSelector)
      .filter((_, el) => {
        return el.textContent.trim() === randomHall;
      })
      .first();

    cy.wrap($hallElem)
      .closest('li')
      .find('input')
      .click()
      .then(() => {
        const $button = $container.find(selectors.adminPage.button);
        const openAttr = $button.text();
        // cy.log(openAttr);
        if (openAttr === 'Закрыть продажу билетов') {
          cy.wrap({ randomFilm, randomHall }).as('filmHallPair');
          cy.log(
            `Selected film "${randomFilm}" with open hall "${randomHall}"`,
          );
        } else {
          cy.log('Not open');
          cy.chooseRandomFilmAndHall(result);
        }
      });
  });
});

Cypress.Commands.add('chooseFutureDay', (daysAhead) => {
  cy.get(
    selectors.mainPage.daysNavigation + `:nth-child(${daysAhead})`,
  ).click();
});

Cypress.Commands.add('chooseFilmAndHall', (filmName, hallName) => {
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  cy.contains(
    selectors.mainPage.movieTitle,
    new RegExp(`^${escapeRegExp(filmName)}$`),
  )
    .closest(selectors.mainPage.movieCard)
    .contains(
      selectors.mainPage.movieHallTitle,
      new RegExp(`^${escapeRegExp(hallName)}$`),
    )
    .closest(selectors.mainPage.movieHall)
    .find(selectors.mainPage.movieTimeBlock)
    .click();
});

Cypress.Commands.add('chooseSeats', (seatsArr) => {
  seatsArr.forEach((seat) => {
    cy.get(
      selectors.buyingPage.seatsScheme +
        ` > :nth-child(${seat.row}) > :nth-child(${seat.seat})`,
    ).click();
  });
});
