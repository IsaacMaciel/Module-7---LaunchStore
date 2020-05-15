const express = require('express');
const routes = express.Router();

const homeController = require('../controller/home');



const products = require('./products');
const users = require('./users');

routes.use('/products',products);
routes.use('/users',users);

// Index
routes.get("/",homeController.index);

routes.get('/ads/create',(req,res)=>{
    res.redirect('/products/create')
})

routes.get('/accounts',(req,res)=>{
    res.redirect('users/login')
})



module.exports = routes;