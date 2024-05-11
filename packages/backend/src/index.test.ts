import { PluginEnvironment } from './types';
import { resolverResult } from './plugins/plugins_helper/googleAuthResolver';
import {
  AuthResolverCatalogUserQuery,
  AuthResolverContext,
  BackstageSignInResult,
  ProfileInfo,
  SignInInfo,
} from '@backstage/plugin-auth-node';
import { TokenParams } from '@backstage/plugin-auth-backend';
import { Entity } from '@backstage/catalog-model';

describe('test', () => {
  it('unbreaks the test runner', () => {
    const unbreaker = {} as PluginEnvironment;
    expect(unbreaker).toBeTruthy();
  });
});

describe('providers.google.create.signIn.resolver logic', () => {
  it('should throw an exception for empty email address', async () => {
    const mockProfile: ProfileInfo = {
      email: '',
      displayName: 'John Doe',
      picture: 'https://example.com/avatar.jpg',
    };

    const mockSignInInfo: SignInInfo<any> = {
      profile: mockProfile,
      result: {}, // Placeholder for the authentication result
    };

    const mockTokenParams: TokenParams = {
      claims: {
        sub: 'user123',
        ent: ['entity1', 'entity2'],
        customClaim: 'value',
      },
    };

    const mockContext: AuthResolverContext = {
      issueToken: (params: TokenParams) => {
        return new Promise<{ token: string }>(resolve => {
          resolve({ token: 'fake token' });
        });
      },
      findCatalogUser: function (
        query: AuthResolverCatalogUserQuery,
      ): Promise<{ entity: Entity }> {
        throw new Error('Function not implemented.');
      },
      signInWithCatalogUser: function (
        query: AuthResolverCatalogUserQuery,
      ): Promise<BackstageSignInResult> {
        throw new Error('Function not implemented.');
      },
    };

    await expect(resolverResult(mockSignInInfo, mockContext)).rejects.toThrow(
      'Login failed, user profile does not contain a valid email',
    );
  });

  it('should throw an exception for invalid non empty email address', async () => {
    const mockProfile: ProfileInfo = {
      email: 'test.example.com',
      displayName: 'John Doe',
      picture: 'https://example.com/avatar.jpg',
    };

    const mockSignInInfo: SignInInfo<any> = {
      profile: mockProfile,
      result: {}, // Placeholder for the authentication result
    };

    const mockContext: AuthResolverContext = {
      issueToken: (params: TokenParams) => {
        return new Promise<{ token: string }>(resolve => {
          resolve({ token: 'fake token' });
        });
      },
      findCatalogUser: function (
        query: AuthResolverCatalogUserQuery,
      ): Promise<{ entity: Entity }> {
        throw new Error('Function not implemented.');
      },
      signInWithCatalogUser: function (
        query: AuthResolverCatalogUserQuery,
      ): Promise<BackstageSignInResult> {
        throw new Error('Function not implemented.');
      },
    };

    await expect(resolverResult(mockSignInInfo, mockContext)).rejects.toThrow(
      'Login failed, user profile does not contain a valid email',
    );
  });

  it('should throw an exception for valid email address with incorrect domain', async () => {
    const mockProfile: ProfileInfo = {
      email: 'user@example.com',
      displayName: 'John Doe',
      picture: 'https://example.com/avatar.jpg',
    };

    const mockSignInInfo: SignInInfo<any> = {
      profile: mockProfile,
      result: {}, // Placeholder for the authentication result
    };

    const mockContext: AuthResolverContext = {
      issueToken: (params: TokenParams) => {
        return new Promise<{ token: string }>(resolve => {
          resolve({ token: 'fake token' });
        });
      },
      findCatalogUser: function (
        query: AuthResolverCatalogUserQuery,
      ): Promise<{ entity: Entity }> {
        throw new Error('Function not implemented.');
      },
      signInWithCatalogUser: function (
        query: AuthResolverCatalogUserQuery,
      ): Promise<BackstageSignInResult> {
        throw new Error('Function not implemented.');
      },
    };

    await expect(resolverResult(mockSignInInfo, mockContext)).rejects.toThrow(
      `Login failed, '${mockProfile.email}' does not belong to the expected domain`,
    );
  });

  it('should return a token for valid email address with correct domain', async () => {
    const mockProfile: ProfileInfo = {
      email: 'john_doe@code.berlin',
      displayName: 'John Doe',
      picture: 'https://example.com/avatar.jpg',
    };

    const mockSignInInfo: SignInInfo<any> = {
      profile: mockProfile,
      result: {}, // Placeholder for the authentication result
    };

    const mockContext: AuthResolverContext = {
      issueToken: (params: TokenParams) => {
        // Mock implementation for issueToken method
        return { token: params.claims.sub + params.claims.ent };
      },
      findCatalogUser: (query: AuthResolverCatalogUserQuery) => {
        // Mock implementation for findCatalogUser method
        return '';
      },
      signInWithCatalogUser: (query: AuthResolverCatalogUserQuery) => {
        // Mock implementation for signInWithCatalogUser method
        return '';
      },
    };

    return expect(resolverResult(mockSignInInfo, mockContext)).resolves.toEqual(
      { token: 'user:default/john_doeuser:default/john_doe' },
    );
  });
});
