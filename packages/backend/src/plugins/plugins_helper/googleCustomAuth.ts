import { createBackendModule } from '@backstage/backend-plugin-api';
import { googleAuthenticator } from '@backstage/plugin-auth-backend-module-google-provider';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { googleSignInResolvers } from './googleSignInResolvers';

const customGoogleAuth = createBackendModule({
  pluginId: 'auth',
  moduleId: 'googleProvider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          providerId: 'google',
          factory: createOAuthProviderFactory({
            authenticator: googleAuthenticator,
            signInResolver:
              googleSignInResolvers.emailMatchingUserEntityAnnotation(),
          }),
        });
      },
    });
  },
});

export { customGoogleAuth };
