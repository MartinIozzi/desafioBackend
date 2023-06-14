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
            const existingProduct = cart.products.find(
              (p) => p.product.toString() === productId
            );
            if (existingProduct) {
              existingProduct.quantity += 1; // Incrementar la cantidad si el producto ya existe
            } else {
              cart.products.push({ product: product._id, quantity: 1 }); // Agregar un nuevo producto con cantidad 1
            }
        
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

    async updateCart(cartId, products) {
        try {
          const cart = await this.model.findById(cartId);
          console.log(cart);
          if (!cart) {
            throw new Error('Carrito no encontrado');
          }
      
          // Limpiar el carrito actual
          cart.products = [];
      
          // Agregar los nuevos productos al carrito
          for (const product of products) {
            const { id: productId, quantity: quantity } = product;
            cart.products.push({ product: productId, quantity });
          }
      
          await cart.save();
        } catch (err) {
          throw err;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
          const cart = await this.model.findOneAndUpdate(
            { _id: cartId, 'products.product': productId },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
          );
      
          if (!cart) {
            throw new Error('Carrito no encontrado');
          }
      
          // Verificar si el producto se encontró y se actualizó correctamente
      
          const updatedProduct = cart.products.find(
            (product) => product.product.toString() === productId
          );
      
          if (!updatedProduct) {
            throw new Error('El producto no se encuentra en el carrito');
          }
      
          // Enviar una respuesta de éxito o realizar cualquier otra acción necesaria
          console.log('Carrito actualizado exitosamente');
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    }

export const cartService = new CartService();