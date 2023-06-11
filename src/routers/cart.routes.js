import { Router } from "express";
import { cartService } from "../services/cart.service.js";

const cartRoutes = Router();

cartRoutes.get('/', async (req, res) => {
    try {
        res.send(await cartService.getCart())
    } catch (err) {
        res.status(500).send({err})
    }
})

cartRoutes.get('/:cid', async (req, res) => {
    let cid = req.params.cid;
    try {
        res.status(200).send(await cartService.getCartById(cid));
    } catch (e) {
        res.status(400).send({e});
    }
})

cartRoutes.post('/',async (req, res) => {
    try {
        const cart = req.body;
        console.log(cart);
        res.status(201).send(await cartService.addCart(cart));
    } catch (e) {
        res.status(400).send({e});
    }
})

cartRoutes.post('/:cid/products/:pid' , async (req, res) => {
    const productId = req.params.pid;
    const cartId = req.params.cid;
    try {
        await cartService.addProdToCart(cartId, productId);
        res.status(201).send(await cartService.getCart())
    } catch (e) {
        res.status(400).send({e});
    }
})

cartRoutes.delete('/:cid/products/:pid', async (req, res) => {
    try{
        let prodId = req.params.pid;
        let cartId = req.params.cid
        
        await cartService.deleteProdToCart(prodId, cartId)
        res.status(201).send(await cartManager.getCart())
    } catch (err) {
        res.status(400).send({err});
    }
})

cartRoutes.put('/:cid/products/:pid', async (req, res) => {

})

cartRoutes.delete('api/carts/:cid', async (req, res) => {
    
})

export {cartRoutes};