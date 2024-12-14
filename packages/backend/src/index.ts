import { createBackend } from '@backstage/backend-defaults';
// import { customGoogleAuth } from './plugins/plugins_helper/googleCustomAuth';

const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend'));
// backend.add(import('@spotify/backstage-plugin-soundcheck-backend'));
backend.add(import('@backstage/plugin-proxy-backend'))
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-techdocs-backend'));

// Add the auth backend
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-google-provider'));
// backend.add(customGoogleAuth);

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