const express = require('express');
const routes = express.Router();

const SessionController = require('../controller/Session');
const UserController = require('../controller/user');

const userValidator = require('../validators/user');
const sessionValidator = require('../validators/session');
   
const {isLoggedRedirectToUsers} = require('../middlewares/session');
const {onlyUsers} = require('../middlewares/session');


//login/logout
routes.get('/login',isLoggedRedirectToUsers,SessionController.loginForm)
routes.post('/login',sessionValidator.login,SessionController.login)
routes.post('/logout', SessionController.logout)

// //reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password',sessionValidator.forgot,SessionController.forgot)
routes.post('/password-reset',sessionValidator.reset,SessionController.reset)

// // user register UserController
 routes.get('/register',UserController.registerForm);
 routes.post('/register',userValidator.post,UserController.post);
 routes.get('/',onlyUsers,userValidator.show,UserController.show);
 routes.put('/',userValidator.update,UserController.update);
 routes.delete('/',UserController.delete);



module.exports = routes;