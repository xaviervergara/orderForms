import multer from 'multer';

//se configura el lugar donde se van a guardar los archivos que se vayan a subir

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/docs');
  },
  filename: (req, file, cb) => {
    const filename = 'Pedido Fotografia del' + file.originalname.slice(-16);
    // const filename = Date.now() + file.originalname.split(' ').join('');

    cb(null, filename);
  },
});

export const uploader = multer({ storage });
