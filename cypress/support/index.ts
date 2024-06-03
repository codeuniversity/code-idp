/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    OAuthlogin(): Chainable<any>;
  }
}
