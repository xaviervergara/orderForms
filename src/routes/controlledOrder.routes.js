//!    █████████████████████████████████████████
//!
//!    LA DATA QUE LLEGA DEL POST NO SE ALMACENA
//!    EN VARIABLES GLOBALES. SE VA A GUARDAR
//!                EN SESIONES
//!
//!    ██████████████████████████████████████████

import { Router } from 'express';

const contOrderRouter = Router();

//*Post

let data = null;

contOrderRouter.post('/', (req, res) => {
  data = req.body;

  res.send({ message: 'Data received', data: data });
});

//* Get
contOrderRouter.get('/', async (req, res) => {
  if (!data) {
    return res.status(400).json({ error: 'No se ha enviado ningún producto' });
  }
  try {
    res.send({ message: data });
  } catch (error) {
    error;
  }
});

export default contOrderRouter;
