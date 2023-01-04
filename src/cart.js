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
      const cart = new Cart(id);
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
      const cart = this.carts.find((cart) => cart.id === cartId);
      return cart ?? null;
    } catch (error) {
      console.error(error);
      throw new Error('Error getting cart');
    }
  };

  async loadCartsFromFile() {
    try {
      const data = await readFile('carts.json');
      this.carts = JSON.parse(data);
    } catch (error) {
      console.error(error);
      throw new Error('Error loading carts from file');
    }
  }

  async saveCartsToFile() {
    try {
      const data = JSON.stringify(this.carts);
      await writeFile('carts.json', data);
    } catch (error) {
      console.error(error);
      throw new Error('Error saving carts to file')
    }
  }
}

export default CartManager;
