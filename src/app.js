import express from "express";
import handlebars from "express-handlebars";
//import { server } from "./utils/socket.js";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { productService } from "./services/product.service.js";

const app = express();
//-------------------------------------------------------//

//Parte JSON del proyecto (solo habilitar para switchear entre el JSON y mongoDB si uno de ellos está deshabilitado)
//import viewsRouter from "./routers/viewsRouter.js";
//import { cartRouter } from "./routers/cartRouter.js";
//import { productRouter } from "./routers/productRouter.js";

//const productManager = new ProductManager();

//Rutas de fs, json del proyecto
//app.use('/', viewsRouter);
//app.use('/api/products', productRouter);
//app.use('/api/carts', cartRouter);

//-------------------------------------------------------//

//Parte MongoDB del proyecto (solo habilitar para switchear entre el JSON y mongoDB si uno de ellos está deshabilitado)
import { cartRoutes } from "./routers/cart.routes.js";
import { productRoutes } from "./routers/product.routes.js";
import viewsRoutes from "./routers/views.routes.js";

//Rutas de MongoDB
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', viewsRoutes);

mongoose.connect('mongodb+srv://Martin:UfuzAWX8YTmXatWX@ecommerce.buljm7y.mongodb.net/?retryWrites=true&w=majority')

//-------------------------------------------------------//

app.use(express.static('public/'));
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', handlebars.engine());
app.set('views' , 'views/' );
app.set('view engine','handlebars');

const port = 8080;

const httpServer = app.listen(port, () => {
    return console.log(`Listening Port: ${port}`)
});

const socketServer = new Server(httpServer); //servidor para trabajar con sockets.

async function products(socket) {
    socket.emit('send', await productService.getProducts());
}

socketServer.on ('connection', async (socket) => {
    console.log("Nuevo cliente conectado");
    products(socket)

    socket.on ('add', async (product) => {
        //await productManager.addProduct(product)
        await productService.addProduct(product)
        //socket.emit('send', await productManager.getProducts())   **SE COMENTA, PARA ASI PODER SWITCHEAR ENTRE FS Y MONGODB, en el caso, switchear los comentarios.
        socket.emit('send', await productService.getProducts())
        products(socket)
    })

    socket.on('delete', async (id) => {
        //await productManager.deleteProduct(id);   **SE COMENTA, PARA ASI PODER SWITCHEAR ENTRE FS Y MONGODB, en el caso, switchear los comentarios.
        await productService.deleteProduct(id);
        products(socket)
    })
});