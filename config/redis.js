
import redis, { createClient } from 'redis';

const defaultConnectionString = "redis://127.0.0.1:6379";

const connect = (env) => {
    return async (callback) => {
        const client = createClient({ url: env.REDIS_CONNECTION_STRING });

        client.on('error', error => callback ? callback(error, false) : false);

        await client.connect().then((data) => {
            redis.ctx = client;
    
            return callback ? callback(null, true) : false
        });
    }
}

const redisConfig = (env) =>  ({
    connectionString: env.REDIS_CONNECTION_STRING || defaultConnectionString,
    port: env.REDIS_PORT || 6379,
    host: env.REDIS_HOST || "127.0.0.1",
    password: env.REDIS_PASS || "password",
    // dialect: "redis",
    // logging: true,
    connect : connect(env),
});

export default redisConfig;