const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const cartRoutes = require('./cart');
const routes = require('express').Router();

routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);
routes.use('/product', productRoutes);
routes.use('/category', categoryRoutes);
routes.use('/cart', cartRoutes);

module.exports = routes;