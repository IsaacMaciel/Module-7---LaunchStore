const express = require('express');
const routes = express.Router();

const ProductController = require('../controller/product');
const SearchController = require('../controller/search');

const {onlyUsers} = require('../middlewares/session');

const multer = require('../middlewares/multer');


//Search
routes.get('/search',SearchController.index);

// Rotas para Produtos
routes.get('/create',onlyUsers,ProductController.create);
routes.get('/:id',ProductController.show);
routes.get('/:id/edit',onlyUsers,ProductController.edit);
routes.put('/',onlyUsers,multer.array("photos",6) ,ProductController.put)
routes.post('/',onlyUsers,multer.array("photos",6) ,ProductController.post);
routes.delete('/',onlyUsers,ProductController.delete);




module.exports = routes;