import express from 'express';
import orderRoutes from './routes/orderForm.routes.js';
import contOrderRouter from './routes/controlledOrder.routes.js';
import mongoose from 'mongoose';

const PORT = 8080;

//instanciamos express
const app = express();
//analiza (o "parsea") cuerpos de solicitudes entrantes como JSON
app.use(express.json());
//para obtener las queries
app.use(express.urlencoded({ extended: true }));
//carpeta estatica
app.use(express.static('public'));
//mongoose
mongoose.connect(
  'mongodb+srv://xaviervergara00:7bRoXT2dCAi6BNFR@cluster0.tzckbmu.mongodb.net/control_pedidos'
);

//Router
app.use('/api/orderForm', orderRoutes);
app.use('/api/controlledOrder', contOrderRouter);
// app.use('/', viewsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
