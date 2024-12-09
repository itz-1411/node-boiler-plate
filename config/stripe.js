// import { getPath } from "#lib/utils";
const stripeConfig = env =>  ({
    publishableKey : env.STRIPE_PUBLISHABLE_KEY,
    secretKey      : env.STRIPE_SECRET_KEY,
    webhookSecretKey     : env.STRIPE_WEBHOOK_SECRET_KEY,
    debug                : env.STRIPE_DEBUG || false,
    statusCheckFrequency : Number(env.STRIPE_STATUS_CHECK_FREQUENCY) || 10,
});

export default stripeConfig;
