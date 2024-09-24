import express from 'express';
import orderRoutes from './routes/orderForm.routes.js';
import contOrderRouter from './routes/controlledOrder.routes.js';
import endControlRouter from './routes/endControl.routes.js';
import sessionRoutes from './routes/session.routes.js';
import viewsRoutes from './routes/views.routes.js';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { Server } from 'socket.io';
import { getVariables } from './config/dotenv.config.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import { Command } from 'commander';

// const PORT = 8080;

//instanciamos express
const app = express();
//* --- process ---
const program = new Command();
program.option('--mode <mode>', 'Entorno de trabajo', 'development');
export const options = program.parse();
const { port, mongoUrl, secret } = getVariables(options);

//analiza (o "parsea") cuerpos de solicitudes entrantes como JSON
app.use(express.json({ limit: '50mb' })); //limit: '50mb'para poder mandar json mas grandes
//para obtener las queries
app.use(express.urlencoded({ extended: true, limit: '50mb' })); //limit: '50mb'para poder mandar json mas grandes
//carpeta estatica
app.use(express.static('public'));
//Conectamos nuestra base de datos en el proyecto
mongoose.connect(mongoUrl);

//* ====================
//* =     SESSIONS     =
//* ====================

app.use(
  session({
    secret: secret,
    store: MongoStore.create({
      mongoUrl: mongoUrl,
      ttl: 900,
    }),
    resave: true,
    saveUninitialized: false,
  })
);

//* ====================
//* =     PASSPORT     =
//* ====================

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//* --- Router ---

app.use('/', viewsRoutes);
app.use('/api/orderForm', orderRoutes);
app.use('/api/controlledOrder', contOrderRouter);
app.use('/api/endControl', endControlRouter);
app.use('/api/sessions', sessionRoutes);

//* --- Socket.io ---
const httpServer = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = new Server(httpServer);

io.on('connection', (socket) => {
  console.log('A new client has connected');

  socket.on('message', (data) => console.log(data));

  // Escuchar el evento 'skuMarked' desde el cliente
  socket.on('skuMarked', (data) => {
    // Enviar el SKU marcado a todos los demás clientes conectados
    socket.broadcast.emit('skuUpdated', data);
  });
});

export { io };
