import express from 'express';
import orderRoutes from './routes/orderForm.routes.js';
import contOrderRouter from './routes/controlledOrder.routes.js';
// import viewsRouter from './routes/views.routes.js';
import handlebars from 'express-handlebars';
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

//Handlebars

const hbs = handlebars.create({
  //Crea un nuevo handlebars engine con la opcion "runtimeOptions" que permite envio de propiedades como prototipos
  runtimeOptions: {
    allowProtoPropertiesByDefault: true, // Permite pasar props que se consideran prototipos (mongoose tiene estas propiedades que son consideradas como tales. De esta manera nos aseguramos de que handlebars las interprete como tal y las deje pasar)
  },
});

app.engine('handlebars', hbs.engine);
app.set('views', 'src/views');
app.set('view engine', 'handlebars');

//Router
app.use('/api/orderForm', orderRoutes);
app.use('/api/controlledOrder', contOrderRouter);
// app.use('/', viewsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
