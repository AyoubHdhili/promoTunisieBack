const express = require('express');
const Product = require('../models/product');
const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const products = await Product.find();
        res.json(products);
    } catch {
        res.json({"message" : "error in products fetching"})
    }
})

router.post('/', async (req, res) => {
    try {
        const product = new Product({
            name:req.body.name,
            price:req.body.price,
            description: req.body.description,
            category: req.body.category,
            stock: req.body.stock,
            reviews: req.body.reviews
        });

        await product.save();
        res.json({"message" : "product added successfully"});
    } catch {
        res.json({"message" : "error in product add"});
    }
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
})

module.exports = router;