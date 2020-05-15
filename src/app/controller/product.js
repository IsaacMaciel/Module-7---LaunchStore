const {formatPrice,date} = require('../lib/utils');

const Product = require('../models/Product');
const Category = require('../models/Category');
const File = require('../models/File');

module.exports = {

    async create(req,res) {

        const results =  await Category.all();
        const categories = results.rows;

        res.render('products/create.njk',{categories});
    },
    

    async  post(req,res){
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Favor, preencha todos os campos.');
            }
        }

        if (req.files.length == 0) return res.send('Favor, selecione pelo menos uma imagem');

        req.body.user_id = req.session.userId;

        let results = await Product.create(req.body);
        const productId = results.rows[0].id;

        const filesPromise = req.files.map(file => File.create({...file,product_id: productId}))
        await Promise.all(filesPromise);

        return res.redirect(`/products/${productId}/edit`);
    },
    async show(req,res) {
        let results = await Product.find(req.params.id);
        const product = results.rows[0];



        if(!product) return res.send('Produtonão encontrado!');

        const {day, hour, minutes, month } = date(product.updated_at);

        product.published = {
            day: `${day}/${month}`,
            hour: `${hour}h${minutes}`
            
        }

        product.oldPrice = formatPrice(product.old_price);
        product.price = formatPrice(product.price);

        results = await Product.files(product.id);
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }));

      return res.render('products/show',{product,files});
      
    },

    async edit(req,res){

        let results = await Product.find(req.params.id);
        const product = results.rows[0];

        if (!product) return res.send("Produto not found!");

        product.old_price = formatPrice(product.old_price);
        product.price = formatPrice(product.price);

        //get categories
        results = await Category.all();
        const categories = results.rows;

        //get images

        results = await Product.files(product.id);
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }));
      
        return res.render("products/edit",{categories,product,files});

    },

    async put(req,res){
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('Favor, preencha todos os campos.');
            }
        }

        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file=>{
                File.create({...file, product_id: req.body.id});
            })
            await Promise.all(newFilesPromise);
        }

        if (req.body.removed_files) {
     
            const removedFiles = req.body.removed_files.split(",");

            const lastIndex = removedFiles.length -1;

            removedFiles.splice(lastIndex, 1);
        

            const removedFilesPromise = removedFiles.map(id => File.delete(id));
            
            await Promise.all(removedFilesPromise);
        }


        req.body.price = req.body.price.replace(/\D/g,"");

        if (req.body.price != req.body.old_price) {
            const oldPrice = await Product.find(req.body.id);
            req.body.old_price = oldPrice.rows[0].price;
        }

        await Product.update(req.body);

        return res.redirect(`/products/${req.body.id}`);


    },

    async delete(req,res) {
        const productId = req.body.id;
        let results = await Product.files(productId);

        const filesDeletePromise = results.rows.map(file => File.delete(file.id));
        await Promise.all(filesDeletePromise);

        await Product.delete(productId);

        return res.redirect('/');
    }


}