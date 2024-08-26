import multer from 'multer';

//se configura el lugar donde se van a guardar los archivos que se vayan a subir

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/orderForms');
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + file.originalname;

    cb(null, filename);
  },
});

export const uploader = multer({ storage });
