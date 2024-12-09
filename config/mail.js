import nodemailer from 'nodemailer';

const transporter = (env) => {
    return async () => {
        return nodemailer.createTransport({
            service: env.MAIL_SERVICE,
            auth: {
              user: env.MAIL_USERNAME,
              pass: env.MAIL_PASSWORD,
            }
        });
    }
}

const dbConfig = (env) =>  ({
    port: env.MAIL_PORT,
    host: env.MAIL_HOST,
    username: env.MAIL_USERNAME,
    password: env.MAIL_PASSWORD,
    service: env.MAIL_SERVICE || 'smtp',
    from: env.MAIL_FROM       || 'test@gmail.com',
    transporter : transporter(env),
})


export default dbConfig;