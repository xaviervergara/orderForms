import { Router } from 'express';
import { options } from '../app.js';
import { getVariables } from '../config/dotenv.config.js';
import nodemailer from 'nodemailer';
import { ClientCredentials } from 'simple-oauth2';

const endControlRouter = Router();

//*Obenemos las variables de entorno

//* POST PARA ENVIAR MAIL DE FALTANTES

//* POST PARA ENVIAR MAIL DE FALTANTES
endControlRouter.post('/send-email', async (req, res) => {
  const { cc, to, subject, html } = req.body;
  const { email } = req.session.user;
  const { appId, tenantId, tokenSecret } = getVariables(options);

  // Configuración de OAuth2
  const client = new ClientCredentials({
    client: {
      id: appId, // Application (client) ID de Azure
      secret: tokenSecret, // Client Secret generado en Azure
    },
    auth: {
      tokenHost: 'https://login.microsoftonline.com',
      tokenPath: `/${tenantId}/oauth2/v2.0/token`, // Tenant ID de Azure
    },
  });

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
        clientId: appId,
        clientSecret: tokenSecret,
        accessToken: tokenResponse.token.access_token,
        refreshToken: tokenResponse.token.refresh_token, // Si está disponible
        expires: tokenResponse.token.expires_at.getTime(), // Access Token de OAuth2
      },
      debug: true, // Habilita el modo debug
      logger: true, // Habilita los logs
    });
    console.log('Token expira en:', tokenResponse.token.expires_at);

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
