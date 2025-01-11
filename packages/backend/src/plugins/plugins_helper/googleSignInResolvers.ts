import {
  createSignInResolverFactory,
  OAuthAuthenticatorResult,
  PassportProfile,
  SignInInfo,
  AuthResolverContext,
} from '@backstage/plugin-auth-node';
import {
  stringifyEntityRef,
  DEFAULT_NAMESPACE,
} from '@backstage/catalog-model';

/**
 * Available sign-in resolvers for the Google auth provider.
 *
 * @public
 */
export namespace googleSignInResolvers {
  /**
   * Looks up the user by validating their email domain and matching the user entity.
   */
  export const emailMatchingUserEntityAnnotation = createSignInResolverFactory({
    create() {
      return async (
        info: SignInInfo<OAuthAuthenticatorResult<PassportProfile>>,
        ctx: AuthResolverContext,
      ) => {
        const { profile } = info;

        // Validate email presence and format
        const regexp = new RegExp(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

        if (!profile.email || !regexp.test(profile.email)) {
          throw new Error(
            'Login failed, user profile does not contain a valid email',
          );
        }

        // Extract the local part and domain from the email
        const [localPart, domain] = profile.email.split('@');

        // Validate the email domain
        if (domain !== 'code.berlin') {
          throw new Error(`Login failed due to incorrect email domain.`);
        }

        // Generate user entity reference
        const userEntityRef = stringifyEntityRef({
          kind: 'User',
          name: localPart,
          namespace: DEFAULT_NAMESPACE,
        });

        // Issue token with claims
        return ctx.issueToken({
          claims: {
            sub: userEntityRef,
            ent: [userEntityRef],
          },
        });
      };
    },
  });
}
