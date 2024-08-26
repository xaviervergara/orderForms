import express from 'express';
import orderRoutes from './routes/orderForm.routes.js';

const PORT = 8080;

//instanciamos express
const app = express();
//analiza (o "parsea") cuerpos de solicitudes entrantes como JSON
app.use(express.json());
//para obtener las queries
app.use(express.urlencoded({ extended: true }));
//carpeta estatica
app.use(express.static('public'));

//Router
app.use('/api/orderForm', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
