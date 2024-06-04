import '../support/commands';
import '../support/index';
import user from '../fixtures/user.json';

describe('Deployment User story', function () {
  beforeEach(function () {
    cy.OAuthlogin();
    const localStorageItem = localStorage.getItem('token');
    if (localStorageItem) {
      const item = JSON.parse(localStorageItem);

      user.backstageIdentity.token = item.body.access_token;
      user.backstageIdentity.identity.refreshToken = item.body.refresh_token;
      user.providerInfo.idToken = item.body.id_token;
      user.providerInfo.accessToken = item.body.access_token;
      user.providerInfo.scope = item.body.scope;
    }
  });

  it('User should be able to login and deploy an express application to cluster on google cloud', function () {
    cy.intercept('GET', '**/api/auth/**', req => {
      req.reply(user);
    });

    cy.visit('http://localhost:3000/catalog');

    expect(cy.contains('Create')).not.to.be.null;

    cy.contains('Create').click();
  });
});
