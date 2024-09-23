import { Router } from 'express';
import { redirectIfAuthenticated } from '../middlewares/auth.js';
import { redirectIfNotAuthenticated } from '../middlewares/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
const viewsRoutes = Router();

// Para obtener la ruta completa de la ubicación actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

//* --- INDEX ---
//?GET

viewsRoutes.get('/', redirectIfNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

//* --- DETAIL ---
//?GET

viewsRoutes.get('/detail/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/detail.html'));
});

//* --- END CONTROL ---
//?GET

viewsRoutes.get('/end-control/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/end-control.html'));
});

//* --- LOGIN ---
//?GET

viewsRoutes.get('/login', redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

//* --- REGISTER ---
//?GET

viewsRoutes.get('/register', redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/register.html'));
});

//* --- RESTORE PASSWORD ---
//?GET

viewsRoutes.get('/restore-password', redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/restore-password.html'));
});

//* --- FAIL REGISTER ---
//?GET
viewsRoutes.get('/failregister', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/failregister.html'));
});

//* --- FAIL LOGIN ---
//?GET
viewsRoutes.get('/faillogin', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/faillogin.html'));
});

export default viewsRoutes;
