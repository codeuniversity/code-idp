import { STATUS_CODES, request } from 'http';
import '../support/commands';
import '../support/index';

describe('Deployment User story', function () {
  beforeEach(function () {
    // cy.session('User Session', () => {
    // });
    cy.loginByGoogleApi();
  });

  it('User should be able to login and deploy an express application to cluster on google cloud', function () {
    const authResult = window.localStorage.getItem('googleCypress');

    expect(authResult).not.to.be.null;

    let jsonIdentityResponse: any;

    if (authResult) {
      jsonIdentityResponse = JSON.parse(authResult);
    }

    expect(jsonIdentityResponse.user).not.to.be.null;
    expect(jsonIdentityResponse.user).not.to.be.empty;

    // cy.intercept('GET', '*', {
    //   statusCode: 200,
    //   body: jsonIdentityResponse,
    // }).intercept('GET', 'localhost:3000', {
    //   user: jsonIdentityResponse.user,
    // });

    const fn = cy.stub();
    cy.stub(fn).returns({
      signIn: {
        resolver(_, ctx) {
          const userRef = 'user:default/guest'; // Must be a full entity reference
          return ctx.issueToken({
            claims: {
              sub: userRef, // The user's own identity
              ent: [userRef], // A list of identities that the user claims ownership through
            },
          });
        },
      },
    });

    cy.contains('button', 'Sign In').click();

    expect(cy.contains('Create')).not.to.be.null;
  });
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
