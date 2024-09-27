import passport from 'passport';
import local from 'passport-local';
import { userModel } from '../models/users.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { OIDCStrategy } from 'passport-azure-ad';
import { getVariables } from './dotenv.config.js';

const LocalStrategy = local.Strategy;

const initializePassport = (options) => {
  const { uriUrl, appId, tenantId, tokenSecret } = getVariables(options);

  // Valores de configuración de Azure AD
  const azureConfig = {
    identityMetadata: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
    clientID: appId,
    clientSecret: tokenSecret, // Required only for auth code flow
    responseType: 'code',
    responseMode: 'query',
    redirectUrl: uriUrl, // Esta es la URL donde Azure redirigirá al usuario
    allowHttpForRedirectUrl: true, // Solo para desarrollo, para producción usa HTTPS
    passReqToCallback: false,
    scope: ['profile', 'email', 'openid'],
  };

  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        const { first_name, last_name, email } = req.body;
        try {
          const user = await userModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
          };

          const result = await userModel.create(newUser);

          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(user, password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia de Microsoft (Azure AD)
  passport.use(
    'microsoft',
    new OIDCStrategy(
      azureConfig,
      async (iss, sub, profile, accessToken, refreshToken, done) => {
        try {
          const user = await userModel.findOne({
            email: profile._json.preferred_username,
          });
          if (!user) {
            // Si el usuario no existe, créalo
            const newUser = {
              first_name: profile.name.givenName || 'DefaultFirstName', // Valor por defecto
              last_name: profile.name.familyName || 'DefaultLastName', // Valor por defecto
              email: profile._json.preferred_username,
              password: null, // No tendrás un password porque se autentican con Microsoft
            };
            const createdUser = await userModel.create(newUser);
            return done(null, createdUser);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findOne({ _id: id });
    done(null, user);
  });
};

export default initializePassport;
