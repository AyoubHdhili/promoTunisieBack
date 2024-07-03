const express = require('express');
const Product = require('../models/product');
const upload = require('../shared/multer');
const easyinvoice = require('easyinvoice');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pdf = require('html-pdf');
const generateHtml = require('../shared/facture');


router.get('/', async (req, res) => {
    try{
        const products = await Product.find();
        res.json(products);
    } catch {
        res.json({"message" : "error in products fetching"})
    }
})

router.post('/',upload.array('images', 10), async (req, res) => {
        const imagePaths = req.files.map(file => file.filename);
        const product = new Product({
            name:req.body.name,
            price:req.body.price,
            description: req.body.description,
            category: req.body.category,
            marque: req.body.marque,
            images:imagePaths ,
            stock: req.body.stock,
            reviews: req.body.reviews
        });
        console.log(product);
        await product.save();
        res.json({"message" : "product added successfully"});
})

router.get('/:id', async (req, res) =>{
    const product = await Product.findById(req.params.id);
    res.json(product);
})

router.put('/:id', async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id,{
            name:req.body.name,
            price:req.body.price,
            description: req.body.description,
            category: req.body.category,
            stock: req.body.stock,
            reviews: req.body.reviews
        });
        res.json({"message" : "product updated successfully"});
    } catch {
        res.json({"message" : "error in product updating"});
    }
})

router.delete('/:id', async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.json({"message" : "product deleted successfully"});
    } catch {
        res.json({"message" : "error in product deleting"});
    }
});
  
router.post('/facture', (req, res) => {
  const invoiceData = req.body;
  const date = new Date(Date.now()).toLocaleDateString('en-GB');
  invoiceData.invoiceNumber = date;
  const html = generateHtml(invoiceData);
  const options = { format: 'A4' };
  

  pdf.create(html, options).toFile(`uploads/facture_${date}.pdf`, (err, result) => {
    if (err) return res.status(500).send(err);
    res.setHeader('Content-Disposition', 'attachment; filename="facture.pdf"');
    res.sendFile(path.resolve(`uploads/facture_${date}.pdf`));
  });
});

router.get('/download/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);
    res.sendFile(filePath);
});

module.exports = router;