const reqEnv = ["MONGO_URI", "JWT_SECRET"];
reqEnv.forEach((key) => {
	if (!process.env[key]) {
    throw new Error(`${key} is not set in .env`);
  }
});

export const { MONGO_URI, JWT_SECRET } = process.env;