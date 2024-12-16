import { createBackend } from '@backstage/backend-defaults';

import { createBackendModule } from '@backstage/backend-plugin-api';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';
import { authProvidersExtensionPoint, createOAuthProviderFactory } from '@backstage/plugin-auth-node';

// Create a new backend instance
const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'))
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-techdocs-backend'));

// Add the auth backend
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-google-provider'));

// Custom Github Auth Provider
export const customGithubAuth = createBackendModule({
    pluginId: 'auth',
    moduleId: 'githubProvider',
    register(reg) {
        reg.registerInit({
            deps: { providers: authProvidersExtensionPoint },
            async init({ providers }) {
                providers.registerProvider({
                    providerId: 'github',
                    factory: createOAuthProviderFactory({
                        authenticator: githubAuthenticator,
                        async signInResolver(info, ctx) {
                           const { profile: { email } } = info;

                           if (!email) {
                            throw new Error('User profile has no email');
                           }

                           const [userId] = email.split('@');

                           const userEntity = stringifyEntityRef({
                            kind: 'User',
                            namespace: 'default',
                            name: userId,
                           })

                           return ctx.issueToken({
                            claims: {
                                sub: userEntity,
                                ent: [userEntity],
                            }
                           })
                        },
                    }),
                });
            },
        });
    },
});

backend.add(customGithubAuth);

// Add the catalog backend and the catalog entities
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);

backend.add(import('@backstage/plugin-permission-backend'));
backend.add(
    import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-pg'));

backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

backend.add(import('@backstage/plugin-kubernetes-backend'));


backend.start();