import mongoose from 'mongoose';

const defaultConnectionString = "mongodb://127.0.0.1:27017/test";

const connect = (env) => {
    return async (callback) => {
        mongoose.connection.on('open', () =>  callback ? callback(null, true) : false);
        mongoose.connection.on('error', (error) =>  callback ? callback(error, false) : false);
        
        await mongoose.connect(env.DB_CONNECTION_STRING || defaultConnectionString, { useNewUrlParser: true });
    } 
}

const dbConfig = (env) =>  ({
    connectionString: env.DB_CONNECTION_STRING || defaultConnectionString,
    port: env.DB_PORT || 27017,
    database: env.DB_NAME || "test",
    username: env.DB_USER || "admin",
    password: env.DB_PASS || "password",
    host: env.DB_HOST || "127.0.0.1",
    connect : connect(env),
})



export default dbConfig;