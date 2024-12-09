// import { getPath } from "#lib/utils";
const stripeConfig = env =>  ({
    publishableKey : env.STRIPE_PUBLISHABLE_KEY || "pk_test_51P1B7VSJxxF5AastBQ1S8PIYkNUj9OrxLobzPvL3DMSS08FjvVb4Sz6QCE8nYU67ZK9jSELvGoItiPnJgyD8xlaS00ES5tQ1C1",
    secretKey      : env.STRIPE_SECRET_KEY      || "sk_test_51P1B7VSJxxF5AastV7pY68rZ4BuK4fi1GM9xnpWWlFSh829CGyAZhJ6N8cvMGs6Mu29bRDazJyUiIEMOBiyLI29G004OJw6wPg",
    webhookSecretKey     : env.STRIPE_WEBHOOK_SECRET_KEY || "whsec_57b5636756d8694879d9afde0762abd5a209206ce603eefba13be5f344ba9fc4",
    debug                : env.STRIPE_DEBUG              || false,
    statusCheckFrequency : Number(env.STRIPE_STATUS_CHECK_FREQUENCY) || 10,
});

export default stripeConfig;