import {
  stringifyEntityRef,
  DEFAULT_NAMESPACE,
} from '@backstage/catalog-model';
import { OAuthResult } from '@backstage/plugin-auth-backend';
import { SignInInfo, AuthResolverContext } from '@backstage/plugin-auth-node';

export const resolverResult = async (
  profile_input: SignInInfo<OAuthResult>,
  ctx: AuthResolverContext,
) => {
  const profile = profile_input.profile;
  const regexp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );

  if (!profile.email || !regexp.test(profile.email)) {
    throw new Error(
      'Login failed, user profile does not contain a valid email',
    );
  }

  const [localPart, domain] = profile.email.split('@');

  if (domain !== 'code.berlin') {
    throw new Error(`Login failed due to incorrect email domain.`);
  }

  const userEntityRef = stringifyEntityRef({
    kind: 'User',
    name: localPart,
    namespace: DEFAULT_NAMESPACE,
  });

  return ctx.issueToken({
    claims: {
      sub: userEntityRef,
      ent: [userEntityRef],
    },
  });
};
