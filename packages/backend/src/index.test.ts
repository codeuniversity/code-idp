import { PluginEnvironment } from './types';
import { resolverResult } from './plugins/plugins_helper/googleAuthResolver';
import { TokenParams } from '@backstage/plugin-auth-backend';
import 'jest-canvas-mock';

let mockProfile: any;
let mockSignInInfo: any;
let mockContext: any;

describe('test', () => {
  it('unbreaks the test runner', () => {
    const unbreaker = {} as PluginEnvironment;
    expect(unbreaker).toBeTruthy();
  });
});

describe('providers.google.create.signIn.resolver logic', () => {
  beforeEach(() => {
    mockProfile = {
      displayName: 'John Doe',
      picture: 'https://example.com/avatar.jpg',
    };
    mockSignInInfo = { profile: mockProfile, result: {} };
    mockContext = {
      issueToken: (params: TokenParams) => {
        // Mock implementation for issueToken method
        return { token: params.claims.sub + params.claims.ent };
      },
      findCatalogUser: jest.fn(),
      signInWithCatalogUser: jest.fn(),
    };
  });

  it('should throw an exception for empty email address', async () => {
    mockProfile.email = '';
    mockSignInInfo.profile = mockProfile;

    await expect(resolverResult(mockSignInInfo, mockContext)).rejects.toThrow(
      'Login failed, user profile does not contain a valid email',
    );
  });

  it('should throw an exception for invalid non empty email address', async () => {
    mockProfile.email = 'test.example.com';
    mockSignInInfo.profile = mockProfile;

    await expect(resolverResult(mockSignInInfo, mockContext)).rejects.toThrow(
      'Login failed, user profile does not contain a valid email',
    );
  });

  it('should throw an exception for valid email address with incorrect domain', async () => {
    mockProfile.email = 'user@example.com';
    mockSignInInfo.profile = mockProfile;

    await expect(resolverResult(mockSignInInfo, mockContext)).rejects.toThrow(
      `Login failed due to incorrect email domain.`,
    );
  });

  it('should return a token for valid email address with correct domain', async () => {
    mockProfile.email = 'john_doe@code.berlin';
    mockSignInInfo.profile = mockProfile;

    return expect(resolverResult(mockSignInInfo, mockContext)).resolves.toEqual(
      { token: 'user:default/john_doeuser:default/john_doe' },
    );
  });
});
