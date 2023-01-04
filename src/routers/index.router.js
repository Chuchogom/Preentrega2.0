import { Router } from 'express';
import products from './products.router.js';
import carts from './carts.router.js'

const router = Router();

router.use('/products', products);
router.use('/carts',carts)

export default router;
