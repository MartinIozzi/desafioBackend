import { Router } from "express";
import { productService } from "../services/product.service.js";
import { cartService } from "../services/cart.service.js";

const viewsRoutes = Router();

viewsRoutes.get ('/', async (req, res) => {
    try {
        const productsList = await productService.getProducts()
        res.render('index', {products: productsList});
    } catch (err) {
        res.status(500).send({err})
    }
})

viewsRoutes.get ('/realtimeproducts', async (req, res) => {
    try {
        res.render('realTimeProducts');
    } catch (err) {
        res.status(500).send({ err });
    }
})

viewsRoutes.get ('/products', async (req, res) => {
    try {
        res.render('products');
    } catch (err) {
        res.status(500).send({err})
    }
})

viewsRoutes.get('/carts', async (req, res) => {
    try{
        const productsList = await productService.getProducts()
        res.render('carts', {products: productsList});
    } catch(err){
        res.status(500).send({err});
    }
})

export default viewsRoutes;