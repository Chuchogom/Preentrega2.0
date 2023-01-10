import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class CartManager {
  constructor() {
    this.carts = [];
    this.loadCartsFromFile();
  }

  cartId = () => {
    try {
      const count = this.carts.length;
      const nextId = count > 0 ? this.carts[count - 1].id + 1 : 1;
      return nextId;
    } catch (error) {
      console.error(error);
      throw new Error('Error generating cart ID');
    }
  };

  addCart = () => {
    try {
      const id = this.cartId();
      const cart = {id,products:[]}
      this.carts.push(cart);
      this.saveCartsToFile();
      return cart;
    } catch (error) {
      console.error(error);
      throw new Error('Error adding cart');
    }
  };

  getCartById = (cartId) => {
    try {
      console.log(`Getting cart with ID: ${cartId}`)
      const cart = this.carts.find((cart) => cart.id === parseInt(cartId));
      return cart ?? null;
    } catch (error) {
      console.error(error);
      throw new Error('Error getting cart');
    }
  };

  async loadCartsFromFile() {
    try {
      const data = await fs.promises.readFile('carts.json');
      this.carts = JSON.parse(data);
    } catch (error) {
      console.error(error);
      throw new Error('Error loading carts from file');
    }
  }

  async saveCartsToFile() {
    try {
      const data = JSON.stringify(this.carts);
      await fs.promises.writeFile('carts.json', data);
    } catch (error) {
      console.error(error);
      throw new Error('Error saving carts to file')
    }
  }
  async addProductToCart(cartId, productId) {
    try {
      // Find the cart with the specified ID
      const cart = this.carts.find((cart) => cart.id === parseInt(cartId))
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Find the product with the specified ID
      if (!product) {
        throw new Error('Product not found');
      }

      // Check if the product is already in the cart
      const existingProduct = cart.products.find(
        (p) => p.product === productId
      );
      if (existingProduct) {
        // If the product is already in the cart, increment the quantity
        existingProduct.quantity++;
      } else {
        // If the product is not in the cart, add it with a quantity of 1
        cart.products.push({ product: productId, quantity: 1 });
      }
      await this.saveCartsToFile()
    } catch (error) {
      console.error(error);
      throw new Error('Error adding product to cart');
    }
  }
}

export default CartManager;
