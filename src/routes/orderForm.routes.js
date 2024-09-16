import { Router } from 'express';
import { uploader } from '../utils/multer.js';
import XlsxPopulate from 'xlsx-populate';
import { fileModel } from '../models/files.model.js';
import fs from 'fs';
import { io } from '../app.js';

const orderRoutes = Router();

//* --- POST para subir el archivo ---
orderRoutes.post('/upload', uploader.single('file'), async (req, res) => {
  try {
    const file = req.file;

    const newFile = {
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    };

    // Emitir el evento de actualización a todos los clientes
    io.emit('fileUploaded', newFile);

    await fileModel.create(newFile);

    res.json({ message: 'Archivo agregado', newFile });
  } catch (error) {
    res.status(500).send('Error al subir el archivo');
  }
});

//* --- Get de los files para mostrarlos listados en index ---

orderRoutes.get('/files', async (req, res) => {
  try {
    const files = await fileModel.find({});
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los archivos' });
  }
});

//* ---  GET para obtener los datos del archivo subido que los devuelve en detail.js en forma de tabla ---

orderRoutes.get('/:id', async (req, res) => {
  try {
    const file = await fileModel.findOne({ _id: req.params.id });

    if (!file) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    // console.log(`Esto es filePath: ${file.path}`);
    //Proceso del archivo
    const workbook = await XlsxPopulate.fromFileAsync(file.path);
    const value = workbook.sheet('Hoja1').range('A1:J100').value();

    let usedRange = value.filter((e) => {
      if (e[0] && e[1] !== null) {
        return e;
      }
    });

    res.json({
      availableItems: file.availableItems,
      missingItems: file.missingItems,
      data: usedRange,
      filename: file.filename,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el archivo' });
  }
});

//* ---  DELETE para eliminar el archivo subido en index.js ---

orderRoutes.delete('/:id', async (req, res) => {
  try {
    //DELETE DE FILESYSTEM
    const file = await fileModel.findOne({ _id: req.params.id });
    const fileId = req.params.id;

    if (!file) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    //Eliminar el archivo

    fs.unlink(file.path, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: 'Error al eliminar el archivo del sistema' });
      }

      //DELETE DE LA BD
      // Eliminar la referencia de la base de datos después de haber eliminado el archivo
      await fileModel.findByIdAndDelete(req.params.id);
      io.emit('fileDeleted', { fileId });

      res
        .status(200)
        .json({ message: 'Archivo y referencia eliminados correctamente' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el archivo' });
  }
});

// console.log(process.cwd());

export default orderRoutes;
