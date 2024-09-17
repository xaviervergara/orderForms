import { Router } from 'express';

const contOrderRouter = Router();
import { fileModel } from '../models/files.model.js';

//* --- PUT agrega los items encontrados en la planilla como "encontrados" ---

contOrderRouter.put('/available', async (req, res) => {
  const { rowsDivididos, fileId } = req.body;

  //Nos quedamos solo con los skus
  const availableSkus = rowsDivididos.map((e) => {
    return e[1];
  });

  try {
    const updatedFile = await fileModel.findOneAndUpdate(
      { _id: fileId }, // Filtro para encontrar el archivo por ID
      { $addToSet: { availableItems: { $each: availableSkus } } }, // Usar $push para agregar elementos al array
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

//* --- PUT agrega los items faltantes en la planilla como "faltantes" ---

contOrderRouter.put('/missing', async (req, res) => {
  const { rowsDivididos, fileId, notFoundDataDividido } = req.body;

  //Nos quedamos solo con los skus
  const availableSkus = rowsDivididos.map((e) => {
    return e[1];
  });

  const missingSkus = notFoundDataDividido.map((e) => {
    return e[1];
  });

  //! flat() para asegurarnos de que los arrays rowsDivididos y notFoundDataDividido no estén anidados
  availableSkus.flat();
  missingSkus.flat();

  try {
    const updatedFile = await fileModel.findOneAndUpdate(
      { _id: fileId }, // Filtro para encontrar el archivo por ID
      {
        $addToSet: {
          availableItems: { $each: availableSkus }, // Actualiza el array de availableItems (solo añade los nuevos)
        },
        $set: {
          missingItems: notFoundDataDividido, // Reemplaza completamente el array de missingItems
        },
      },
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

export default contOrderRouter;
