import { Router } from 'express';
import { options } from '../app.js';
import { getVariables } from '../config/dotenv.config.js';
import nodemailer from 'nodemailer';

const endControlRouter = Router();

//* POST PARA ENVIAR MAIL DE FALTANTES

endControlRouter.post('/send-email', (req, res) => {
  const { cc, to, subject, html } = req.body;
  const { email } = req.session.user;

  //*Obtenemos variables de entorno
  const { outlookPasswordApp } = getVariables(options);

  let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // Servidor SMTP correcto para Outlook
    port: 587, // Puerto SMTP con soporte STARTTLS
    secure: false, // Usar STARTTLS en lugar de SSL
    auth: {
      user: email,
      pass: outlookPasswordApp,
    },
    tls: {
      ciphers: 'SSLv3', // Si hay problemas con la negociación TLS
    },
  });

  // Configura el mensaje
  let mailOptions = {
    from: `Equipo de fotografía ${email}`,
    to: to, // Destinatario que recibe el correo
    cc: cc,
    subject: subject, // Asunto del correo
    html: html, // Texto del correo
  };

  // Envía el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error);
      res.status(500).send('Error al enviar el correo');
    } else {
      console.log('Correo enviado: ' + info.response);
      res.status(200).send('Correo enviado correctamente');
    }
  });
});

export default endControlRouter;
