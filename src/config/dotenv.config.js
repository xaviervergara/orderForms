import dotenv from 'dotenv';

export const getVariables = (options) => {
  const enviroment = options.opts().mode;

  dotenv.config({
    path:
      enviroment === 'production' ? './.env.production' : './.env.development',
  });

  return {
    port: process.env.PORT,
    mongoUrl: process.env.mongoURL,
    outlookPasswordApp: process.env.outlookPasswordApp,
    secret: process.env.sessionSecret,
  };
};
