before(function () {
  cy.fixture('selectors').then((selectors) => {
    this.selectors = selectors;
  });
});

describe('login as admin', function () {
  beforeEach(function () {
    cy.visit('/admin/index.php');
  });

  it('success login', function () {
    // const admin = require('../../fixtures/admin.json');
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

