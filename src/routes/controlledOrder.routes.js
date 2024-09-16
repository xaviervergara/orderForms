import { Router } from 'express';

const contOrderRouter = Router();
import { fileModel } from '../models/files.model.js';

//* --- PUT agrega los items encontrados en la planilla como "encontrados" ---

contOrderRouter.put('/', async (req, res) => {
  const { cleanRows, fileId } = req.body;

  //Nos quedamos solo con los skus
  const availableSkus = cleanRows.map((e) => {
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

//* --- PUT agrega los items faltantes en la planilla como "faltantes" ---

contOrderRouter.put('/', async (req, res) => {
  const { cleanRows, fileId, cleanNotFoundItems } = req.body;

  //Nos quedamos solo con los skus
  const availableSkus = cleanRows.map((e) => {
    return e[1];
  });

  const missingSkus = cleanNotFoundItems.map((e) => {
    return e[1];
  });

  try {
    const updatedFile = await fileModel.findOneAndUpdate(
      { _id: fileId }, // Filtro para encontrar el archivo por ID
      {
        $push: {
          availableItems: { $each: availableSkus }, // Actualiza el array de availableItems
          missingItems: { $each: missingSkus }, // Actualiza el array de missingItems
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
