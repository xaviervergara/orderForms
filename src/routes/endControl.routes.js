import { Router } from 'express';
import { options } from '../app.js';
import { getVariables } from '../config/dotenv.config.js';
import nodemailer from 'nodemailer';
import { ClientCredentials } from 'simple-oauth2';

const endControlRouter = Router();

// Configuración de OAuth2
const client = new ClientCredentials({
  client: {
    id: 'e0d2a69a-83af-4bbc-9ab0-0d33ea5baf81', // Application (client) ID de Azure
    secret: 'YdG8Q~vz~8D4o1oO~SP6bNbYYTg13J7kyNboLdqp', // Client Secret generado en Azure
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    tokenPath: '/b35231f2-66d7-4023-8d06-13cc1e1a49c0/oauth2/v2.0/token', // Tenant ID de Azure
  },
});

//* POST PARA ENVIAR MAIL DE FALTANTES

//* POST PARA ENVIAR MAIL DE FALTANTES
endControlRouter.post('/send-email', async (req, res) => {
  const { cc, to, subject, html } = req.body;
  const { email } = req.session.user;

  try {
    // Obtener el token de acceso usando OAuth2
    const tokenResponse = await client.getToken({
      scope: 'https://graph.microsoft.com/.default', // Scope necesario para el acceso a Microsoft Graph
    });

    // Crear el transportador con OAuth2
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com', // Servidor SMTP correcto para Outlook
      port: 587, // Puerto SMTP con soporte STARTTLS
      secure: false, // Usar STARTTLS en lugar de SSL
      auth: {
        type: 'OAuth2',
        user: email, // El correo del usuario que envía
        clientId: 'e0d2a69a-83af-4bbc-9ab0-0d33ea5baf81',
        clientSecret: 'YdG8Q~vz~8D4o1oO~SP6bNbYYTg13J7kyNboLdqp',
        accessToken: tokenResponse.token.access_token, // Access Token de OAuth2
      },
      debug: true, // Habilita el modo debug
      logger: true, // Habilita los logs
    });

    // Configura el mensaje
    const mailOptions = {
      from: `Equipo de fotografía <${email}>`,
      to: to, // Destinatario
      cc: cc,
      subject: subject, // Asunto del correo
      html: html, // Contenido HTML del correo
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo:', error);
        res.status(500).send('Error al enviar el correo');
      } else {
        console.log('Correo enviado: ' + info.response);
        res.status(200).send('Correo enviado correctamente');
      }
    });
  } catch (error) {
    console.log('Error obteniendo el token de OAuth2:', error);
    res.status(500).send('Error obteniendo el token de autenticación');
  }
});

export default endControlRouter;

//*CODIGO ORIGINAL ANTES DE OAUTH2_____________________
// endControlRouter.post('/send-email', (req, res) => {
//   const { cc, to, subject, html } = req.body;
//   const { email } = req.session.user;

//   //*Obtenemos variables de entorno
//   const { outlookPasswordApp } = getVariables(options);

//   let transporter = nodemailer.createTransport({
//     host: 'smtp.office365.com', // Servidor SMTP correcto para Outlook
//     port: 587, // Puerto SMTP con soporte STARTTLS
//     secure: false, // Usar STARTTLS en lugar de SSL
//     auth: {
//       user: email,
//       pass: outlookPasswordApp,
//     },
//     tls: {
//       ciphers: 'SSLv3', // Si hay problemas con la negociación TLS
//     },
//   });

//   // Configura el mensaje
//   let mailOptions = {
//     from: `Equipo de fotografía ${email}`,
//     to: to, // Destinatario que recibe el correo
//     cc: cc,
//     subject: subject, // Asunto del correo
//     html: html, // Texto del correo
//   };

//   // Envía el correo
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error al enviar el correo:', error);
//       res.status(500).send('Error al enviar el correo');
//     } else {
//       console.log('Correo enviado: ' + info.response);
//       res.status(200).send('Correo enviado correctamente');
//     }
//   });
// });

// export default endControlRouter;
