/// <reference types="cypress" />
///<reference path="../support/index.ts" />
import jwt from 'jsonwebtoken';
import user from '../fixtures/user.json';

Cypress.Commands.add('OAuthlogin', () => {
  Cypress.log({
    name: 'loginViaAuth0',
  });
  const audience = Cypress.env('auth_audience');
  const client_id = Cypress.env('auth_client_id');
  const scope = 'openid email profile offline_access';

  const options = {
    method: 'POST',
    url: Cypress.env('http://localhost:3000/catalog'),
    body: {
      grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
      realm: 'Username-Password-Authentication',
      username: 'user_test',
      password: 'test',
      audience,
      scope,
      client_id,
      client_secret: Cypress.env('auth_client_secret'),
    },
  };

  cy.request('http://localhost:3000/', options).then(({ body }) => {
    const claims = jwt.decode(body.id_token);
    const { access_token, id_token, token_type, expires_in, refresh_token } =
      body;

    const item = {
      body: {
        access_token,
        audience,
        client_id,
        id_token,
        oauthTokenScope: scope,
        expires_in,
        refresh_token,
        scope,
        token_type,
        decodedToken: {
          claims,
          user: {
            email: 'user_test@code.berlin',
            picture:
              'https://lh3.googleusercontent.com/a/ACg8ocKSdZA_ZVY7tLtdvoZJZW6Utob_xwLX_mDuN6SUFVQj9yA5nQ=s96-c',
            displayName: 'User Test',
          },
        },
      },
      expiresAt: user.backstageIdentity.expiresInSeconds,
    };

    window.localStorage.setItem('token', JSON.stringify(item));
    window.localStorage.setItem(
      '@backstage/core:SignInPage:provider',
      'google-auth-provider',
    );
  });
});
