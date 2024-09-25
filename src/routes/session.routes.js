import { Router } from 'express';
import { userModel } from '../models/users.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import passport from 'passport';

const sessionRoutes = Router();

//* ================
//* =   REGISTRO   =
//* ================

//?POST
sessionRoutes.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/failregister' }),
  async (req, res) => {
    const { first_name, last_name, email } = req.user;
    const user = { first_name, last_name, email };
    req.session.user = user;
    res.redirect('/');
  }
);

//?GET FAILREGISTER
//TODO --- EN VEZ DE USAR FAILREGISTERS, FAILLOGINS, SE PUEDE REDIRIGIR A LA PAGINA MISMA, Y MOSTRAR EL ERROR DE ALGUNA MANERA ---

//* ================
//* =     LOGIN    =
//* ================

sessionRoutes.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/faillogin' }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send({ message: 'Error with credentials' });
    }
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
    };
    res.redirect('/');
  }
);

//* ================
//* =    LOGOUT    =
//* ================

sessionRoutes.post('/logout', async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
    });
    res.send({ redirect: '/login' });
  } catch (error) {
    res.status(400).send({ error });
  }
});

//* ========================
//* =   RESTORE PASSWORD   =
//* ========================

sessionRoutes.post('/restore-password', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(401).send({ message: 'Unauthorized' });
    }
    user.password = createHash(password);
    await user.save();
    res.redirect('/');
  } catch (error) {
    res.status(400).send({ error });
  }
});

//* =========================================
//* =   ENVIAR DATOS DE SESION A FRONTEND   =
//* =========================================

sessionRoutes.get('/user-info', (req, res) => {
  // Verifica si el usuario está autenticado
  if (!req.session.user) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  // Envía solo la información pública del usuario
  const { first_name, last_name, email } = req.session.user;
  const userInfo = {
    first_name,
    last_name,
    email,
  };
  res.send(userInfo);
});

//* AUTENTICACION CON AZURE

// Ruta para redirigir al usuario a Microsoft
sessionRoutes.get(
  '/microsoft',
  passport.authenticate('microsoft', {
    failureRedirect: '/login',
  })
);

// Ruta de callback después de la autenticación exitosa
sessionRoutes.get(
  '/oauthCallback',
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  (req, res) => {
    // Autenticación exitosa, guardar usuario en la sesión
    const { email } = req.user;

    req.session.user = {
      email,
      first_name: req.user.first_name || 'AzureUserFirstName', // Puedes manejarlo según lo que te devuelva Azure
      last_name: req.user.last_name || 'AzureUserLastName', // Igual para el apellido
    };

    console.log('Authenticated user session:', req.session.user);
    res.redirect('/');
  }
);

export default sessionRoutes;
