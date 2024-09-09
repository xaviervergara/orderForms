//!    █████████████████████████████████████████
//!
//!    LA DATA QUE LLEGA DEL POST NO SE ALMACENA
//!    EN VARIABLES GLOBALES. SE VA A GUARDAR
//!                EN SESIONES
//!
//!    ██████████████████████████████████████████

import { Router } from 'express';

const contOrderRouter = Router();
import { fileModel } from '../models/files.model.js';

//*PUT

// let data = null;

contOrderRouter.put('/', async (req, res) => {
  const { rows, fileId } = req.body;
  // console.log(rows);

  function dividirArrayPorTamanio(array, n) {
    const resultado = [];

    for (let i = 0; i < array.length; i += n) {
      resultado.push(array.slice(i, i + n));
    }

    return resultado;
  }

  const rowsDivididos = dividirArrayPorTamanio(rows, 10);

  const availableSkus = rowsDivididos.map((e) => {
    return e[1];
  });

  try {
    const updatedFile = await fileModel.findOneAndUpdate(
      { _id: fileId }, // Filtro para encontrar el archivo por ID
      { $push: { availableItems: { $each: availableSkus } } }, // Usar $push para agregar elementos al array
      { new: true } // Devuelve el documento actualizado
    );

    res.send({
      message: 'Data received',
      data: availableSkus,
      fileID: fileId,
      updatedFile,
    });
  } catch (error) {
    res.status(500).send({ error: 'Error updating the file', details: error });
  }
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
