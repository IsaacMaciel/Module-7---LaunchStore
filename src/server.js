const express = require('express');
const server = express();
const session = require('../config/session');

const methodOverride = require('method-override');

const routes = require("./app/routes/index");

const nunjucks = require('nunjucks');

server.set("view engine","njk");

server.use(session);
server.use((req,res,next) => {
    
    res.locals.session = req.session;
    next();
})
server.use(methodOverride('_method'));
server.use(express.static('public'));
server.use(express.urlencoded({extended:true}));
server.use(routes);

nunjucks.configure("src/app/views",{
    express:server,
    autoescape:false,
    noCache:true
});

server.listen(5000,function(){

    console.log('Servidor rodando na porta 5000');
    
});