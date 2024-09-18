import { Router } from 'express';
import nodemailer from 'nodemailer';

const endControlRouter = Router();

//* POST PARA ENVIAR MAIL DE FALTANTES

endControlRouter.post('/send-email', (req, res) => {
  const { to, subject, html } = req.body;

  // Configura el transporte con los detalles de Outlook
  //   let transporter = nodemailer.createTransport({
  //     service: 'Outlook365',
  //     auth: {
  //       user: '', // Tu dirección de correo de Outlook
  //       pass: '', // Tu contraseña de Outlook
  //     },
  //   });

  let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // Servidor SMTP correcto para Outlook
    port: 587, // Puerto SMTP con soporte STARTTLS
    secure: false, // Usar STARTTLS en lugar de SSL
    auth: {
      user: 'xvergara1212@outlook.com',
      pass: 'ybnhldlmtlaymyyq',
    },
    tls: {
      ciphers: 'SSLv3', // Si hay problemas con la negociación TLS
    },
  });

  // Configura el mensaje
  let mailOptions = {
    from: 'xvergara1212@outlook.com',
    to: to, // Destinatario que recibe el correo
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
