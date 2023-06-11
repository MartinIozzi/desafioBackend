import { cartModel } from "../../models/carts.model.js";
import { productService } from "./product.service.js";

class CartService {
    constructor() {
        this.model = cartModel;
    }

    async getCart(){
        return await this.model.find()
    };

    async addCart(cart){
        await this.model.create(cart);
    };

    async getCartById (cid) {
        return await this.model.findById(cid);
    }

    async addProdToCart(cartId, productId){
        try {
            const cart = await this.model.findById(cartId);
            if(!cart) {
                throw new Error('Carrito no encontrado');
            }
            const product = await productService.getProductByID(productId);
            if(!product) {
                throw new Error('Producto no encontrado');
            }
            cart.products.push({product: product._id});
            return await cart.save();
        } catch (err) {
            console.log(err);
        }
    }

    async deleteProdToCart(prodId, cartId){
        try{
            const cart = await this.model.findById(cartId);
            if (!cart) {
               throw new Error('Carrito no encontrado');
            }
            cart.products = cart.products.filter(
                (product) => product.product.toString() !== prodId
              );
            await cart.save();
            return cart;
        } catch (err) {
          console.log(err);
        }
    }
}

export const cartService = new CartService();