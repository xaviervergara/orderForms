import express from 'express';
import orderRoutes from './routes/orderForm.routes.js';
import contOrderRouter from './routes/controlledOrder.routes.js';
import endControlRouter from './routes/endControl.routes.js';
import sessionRoutes from './routes/session.routes.js';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { Server } from 'socket.io';
import viewsRoutes from './routes/views.routes.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

const PORT = 8080;

//instanciamos express
const app = express();
//analiza (o "parsea") cuerpos de solicitudes entrantes como JSON
app.use(express.json({ limit: '50mb' })); //limit: '50mb'para poder mandar json mas grandes
//para obtener las queries
app.use(express.urlencoded({ extended: true, limit: '50mb' })); //limit: '50mb'para poder mandar json mas grandes
//carpeta estatica
app.use(express.static('public'));
//mongoose
mongoose.connect(
  'mongodb+srv://xaviervergara00:7bRoXT2dCAi6BNFR@cluster0.tzckbmu.mongodb.net/control_pedidos'
);

//* ====================
//* =     SESSIONS     =
//* ====================

app.use(
  session({
    secret: '@RR3D0',
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://xaviervergara00:7bRoXT2dCAi6BNFR@cluster0.tzckbmu.mongodb.net/control_pedidos',
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
const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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
