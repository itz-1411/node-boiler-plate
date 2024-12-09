const authConfig = (env) =>  ({
    defaultPassword: env.DEFAULT_PASSWORD || "1234",
    jwtSecret: env.JWT_SECRET || "Hfretsaffad2VyZldA",
    jwtExpiresIn: env.JWT_EXPIRES_IN || "1d",
    jwtAlgorithm: env.JWT_ALGO || "HS512",
    saltRounds: Number(env.SALT_ROUND) || 10,
    refreshTokenSecret: env.REFRESH_TOKEN_SECRET || "VmVyeVBvd2VyZnVsbFNlY3JldA==",
    refreshTokenExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN || "7d", // 7 days
})

export default authConfig
