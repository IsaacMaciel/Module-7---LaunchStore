const User = require('../models/User');

const {compare} = require('bcryptjs');

async function login(req,res,next) {
    const  {email, password}  = req.body;

        const user = await User.findOne({
            where: {email},
        })

        if(!user) return res.render("session/login",{
            error:"Usuário não cadastrado",
            user:req.body
        })

    

const passed = await  compare(password,user.password);

    if(!passed) return res.render("session/login",{
        user: req.body,
        error: "Senha incorreta"
    })

    req.user = user
    next();
}

async function forgot(req,res,next) {
    const  { email }  = req.body;


    const user = await User.findOne({
        where: {email},
    })

    if(!user) return res.render("session/forgot-password",{
        error:"E-mail não cadastrado!",
        user:req.body
    })
    req.user = user;
    next();

}
async function reset(req,res,next) {
    //Verificar se o usuário existe
    const { email, password, passwordRepeat, token} = req.body;

        const user = await User.findOne({
            where: {email},
        })

        if(!user) return res.render("session/password-reset",{
            error:"Usuário não cadastrado",
            token,
            user:req.body
        })

        //Verificar se a senha bate
        if(password != passwordRepeat) return res.render("session/password-reset",{
            user:req.body,
            token,
            error: 'A senha e a repetição da senhão estão incorretas'
        })

        //Verificar se o token bate
        if (token != user.reset_token) return res.render("session/password-reset",{
            user:req.body,
            token,
            error: 'Token inválido! Solicite uma nova recuperação de senha'
        })

        //Verificar se o token expirou
        let now = new Date();
        now = now.setHours(now.getHours());

        if (now > user.reset_token_expires) return res.render("session/password-reset",{
            user:req.body,
            token,
            error: 'O Token expirou! Por favor, solicite um novo'
        })

        req.user = user;
        next();




}




module.exports =  {
   login,
   forgot,
   reset
}