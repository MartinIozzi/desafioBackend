import { cartModel } from "../../models/carts.model.js";
import { productService } from "./product.service.js";

class CartService {
    constructor() {
        this.model = cartModel;
    }

    async getCart(){
      const carts = await this.model.find();
      return carts;
    };

    async addCart(){
      const createdCart = await this.model.create({});
      return createdCart;
    };

    async getCartById (cid) {
      try {
        return await this.model.findById(cid).populate('products');
    } catch (err) {
      console.log(err);
    }
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

    async deleteProdFromCart(prodId, cartId){
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

    async deleteAllProd(cartId){
      try{
        const cart = await this.model.findById(cartId);
        if (cart) {
          cart.products = [];
          await cart.save();
        } else{
          throw new Error('Carrito no encontrado');
        }
        
      } catch (err){
        console.log(err);
      }
    }
/*
    async updateCart(cartId, products) {
        try {
          const cart = await this.model.findById(cartId);
          if (!cart) {
            throw new Error('Carrito no encontrado');
          }
      
          // Limpiar el carrito actual
          cart.products = [];
      
          // Agregar los nuevos productos al carrito
          for (const product of products) {
            const { productId, quantity } = product;
            cart.products.push({ product: productId, quantity });
          }
      
          await cart.save();
        } catch (error) {
          console.log(error);
        }
    }
    */
/*
    async updateProductQuantity(cartId, productId, quantity) {
        try {
          const cart = await this.model.findById(cartId);
          if (!cart) {
            throw new Error('Carrito no encontrado');
          }
      
          const productIndex = cart.products.findIndex(
            (product) => product.product.toString() === productId
          );
      
          if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
          }
      
          // Si no se encuentra el producto en el carrito, se podría lanzar un error o simplemente no hacer nada
      
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
*/
}

export const cartService = new CartService();