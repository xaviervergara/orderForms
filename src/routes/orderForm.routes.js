import { Router } from 'express';
import { uploader } from '../utils/multer.js';
import XlsxPopulate from 'xlsx-populate';

//Directorio actual
console.log(`estamos acá: ${process.cwd()}`);

const orderRoutes = Router();

let filePath = '';
//Post
orderRoutes.post('/upload', uploader.single('file'), (req, res) => {
  //   const file = req.file
  filePath = req.file.path;
  res.send({ messsage: 'Archivo agregado', filePath });
});

//Get;
orderRoutes.get('/', async (req, res) => {
  const workbook = await XlsxPopulate.fromFileAsync(filePath);
  const value = workbook.sheet('Hoja1').range('A1:J22').value();
  res.send(value);
});

export default orderRoutes;
