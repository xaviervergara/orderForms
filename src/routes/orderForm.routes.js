import { Router } from 'express';
import { uploader } from '../utils/multer.js';
import XlsxPopulate from 'xlsx-populate';

const orderRoutes = Router();

let filePath = '';

// POST para subir el archivo
orderRoutes.post('/upload', uploader.single('file'), (req, res) => {
  filePath = req.file.path;
  res.json({ message: 'Archivo agregado', filePath });
});

// GET para obtener los datos del archivo subido
orderRoutes.get('/', async (req, res) => {
  if (!filePath) {
    return res.status(400).json({ error: 'No se ha subido ningún archivo' });
  }

  try {
    const workbook = await XlsxPopulate.fromFileAsync(filePath);

    const value = workbook.sheet('Hoja1').range('A1:J100').value();
    // const value = workbook.sheet('Hoja1').usedRange().value();
    res.json(value);
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el archivo' });
  }
});

export default orderRoutes;
