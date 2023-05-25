import express from "express";
import { productRouter } from "./routers/productRouter.js";
import { cartRouter } from "./routers/cartRouter.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routers/viewsRouter.js"
import { Server } from "socket.io";
import ProductManager from "./controllers/productManager.js";

const app = express();
const productManager = new ProductManager();

app.use(express.static('public/'));
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', handlebars.engine());
app.set('views' , 'views/' );
app.set('view engine','handlebars');

app.use('/', viewsRouter);

app.use('/api/products', productRouter);

app.use('/api/carts', cartRouter);

const port = 8080;

const httpServer = app.listen(port, () => {
    console.log(`Listening Port: ${port}`)});

const socketServer = new Server(httpServer); //servidor para trabajar con sockets.

async function products(socket) {
    socket.emit('send', await productManager.getProducts());
}

socketServer.on ('connection', async (socket) => {
    console.log("Nuevo cliente conectado");
    products(socket)

    socket.on ('add', async (product) => {
        await productManager.addProduct(product)
        socket.emit('send', await productManager.getProducts())
        products(socket)
    })

    socket.on('delete', async (id) => {
        await productManager.deleteProduct(id);
        products(socket)
    })
});

