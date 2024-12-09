import { toBoolean } from '#lib/utils';

const appConfig = (env) =>  ({
    appName: env.APP_NAME || "Node Server",
    appUrl:  env.APP_URL || "http://127.0.0.1:3000",
    env:     env.APP_ENV || "development",
    debug: toBoolean(env.APP_DEBUG),
    port:  Number(env.APP_PORT) || 3000,
    host:  String(env.APP_HOST) || '127.0.0.1',
    statusRoutePassword: env.STATUS_ROUTE_PASSWORD || "secret",
})

export default appConfig