const User = require('../models/User');
const {compare} = require('bcryptjs');

function checkAllFields(body) {
    const keys = Object.keys(body);
    
    for(key of keys) {
        if (body[key] == "") {
            return {
                error:"Por favor, preencha todos os campos.",
                user:body
            };

        }
    }
}
async function checkPassword(body,method) {
    const {id, password} =  body;

    if(!password) {
        if (method == "update") {
            return {
                user: body,
                error:"Confirme sua senha para atualizar seu cadastro"
            }     
            
        }
        return {
            user: body,
            error:"Confirme sua senha para deletar a conta"
        }
    }

    const user = await User.findOne({where:{id}});

    const passed = await  compare(password,user.password);

    if(!passed) return {
        user: body,
        error: "Senha incorreta"
    }
    
    return {
        userFound:user
    }
}

async function post(req,res,next) {
    
    const fillFields = checkAllFields(req.body);
    if(fillFields) {
        return res.render('user/register', fillFields)
    }
    
    //checando se o usuário já existe
    let {email,cpf_cnpj,password,passwordRepeat} = req.body;
    
    cpf_cnpj = cpf_cnpj.replace(/\D/g,"");
    
    const user = await User.findOne({
        where:{email},
        or: {cpf_cnpj}
    })
    
    if (user) 
    return res.render("user/register",{
        error:"Usuário já cadastrado",
        user:req.body
    })
    
    // checando se os dois campos de password são iguais
    if (password != passwordRepeat) 
    return res.render("user/register",{
        error:"As senhão não concidem",
        user:req.body
    })

    next();
}
async function show(req,res,next) {
    const  {userId:id}  = req.session;

        const user = await User.findOne({
            where: {id},
        })

        if(!user) return res.render("user/register",{
            error:"Usuário não encontrado!"
        })

        req.user = user;
        next();
}
async function update(req,res,next) {

    const checkPass = await checkPassword(req.body,'update');
    if (checkPass.error) return res.render('user/index',checkPass);

    const fillFields = await checkAllFields(req.body);
    if(fillFields) return res.render('user/index',fillFields);


    req.user = checkPass.userFound; 
    next();
}

// async function deleter (req,res,next) {
//     const checkPass = await checkPassword(req.body,'delete');
//     console.log(`Exibindo o valor do req.body:${req.body}`)
    

//     if (checkPass.error) {
//         console.log(`Exibindo o valor do checkPass:${req.body}`)
//         return res.render('user/index',checkPass);  
        
//     }

//     req.user = checkPass.userFound; 
//     next();
// }


module.exports =  {
    post,
    show,
    update
    // deleter
}