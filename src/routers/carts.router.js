import { Router } from 'express';
import CartManager from '../cart.js';
import ProductManager from '../products.js';

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager()

// Get all carts
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const carts = cartManager.carts.slice(0, limit);
    if (!carts || carts.length === 0) {
      res.status(404).json({ message: 'No carts found' });
    } else {
      res.json(carts);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting carts', error });
  }
});


// Create a new cart
router.post('/', async (req, res) => {
  try {
    const cart = cartManager.addCart();
    res.status(201).json({ message: 'Cart created successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating cart', error });
  }
});

// Get the products in a cart
router.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = cartManager.getCartById(cartId);
    console.log(cart)
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
    } else {
      res.json(cart.products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting cart', error });
  }
});

// Add a product to a cart
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    // Get the cart id and product id from the request parameters
    const cartId = req.params.cid;
    const productId = req.params.pid;

    // Get the product from the product manager
    const product = productManager.getProductById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Get the cart from the cart manager
    const cart = cartManager.getCartById(cartId);
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    // Add the product to the cart
    cartManager.addProductToCart(cartId, productId);

    // Save the updated cart to the file
    await cartManager.saveCartsToFile();

    // Send a success response
    res.json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message:
          'An error occurred while trying to add the product to the cart',
        error,
      });
  }
});

export default router;
