const express = require('express');
const Product = require('../models/product');
const upload = require('../shared/multer');
const easyinvoice = require('easyinvoice');
const fs = require('fs');
const path = require('path');
const router = express.Router();

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

router.post('/facture', async (req, res) => {
    const invoiceDetails = req.body;
  
    // Create the invoice JSON data
    const invoiceData = {
      "documentTitle": "Facture", //Defaults to INVOICE
      "currency": "DT",
      "taxNotation": "TVA", //or gst
      "marginTop": 25,
      "marginRight": 25,
      "marginLeft": 25,
      "marginBottom": 25,
      //"logo": "data:image/png;base64," + fs.readFileSync(path.join(__dirname, 'assets', 'logo.png'), 'base64'),
      "sender": {
          "company": "RITEJ BUSINESS TRADING",
          "address": "Immeuble Basma Sousse Erriadh",
          "zip": "",
          "city": "",
          "country": "Tunisie",
          "custom1": "MF: 1645295/XBM/000",
          "custom2": "Tél: 27201202 / 43131113 / 26685400"
      },
      "client": {
          "company": invoiceDetails.client,
          "address": invoiceDetails.address,
          "zip": "",
          "city": "",
          "country": "",
          "custom1": `Téléphone: ${invoiceDetails.phone}`
      },
      "invoiceNumber": invoiceDetails.invoiceNumber,
      "invoiceDate": invoiceDetails.date,
      "products": invoiceDetails.items.map(item => ({
          "quantity": item.quantity,
          "description": item.description,
          "tax": 0,
          "price": parseFloat(item.unitPrice.replace(',', '.'))
      })),
      "bottomNotice": "Cachet et Signature",
      "fields": {
          "tax": "%", //Defaults to vat
          "discounts": false,
          "client": {
              "company": "Client"
          }
      },
      "additionalRows": [{
          "col1": "Total HT",
          "col2": "",
          "col3": invoiceDetails.totalHT
      },
      {
          "col1": "TVA 19%",
          "col2": "",
          "col3": invoiceDetails.tva19
      },
      {
          "col1": "TVA 7%",
          "col2": "",
          "col3": invoiceDetails.tva7
      },
      {
          "col1": "Timbre Fiscal",
          "col2": "",
          "col3": invoiceDetails.timbreFiscal
      },
      {
          "col1": "Total (DT)",
          "col2": "",
          "col3": invoiceDetails.total
      }]
    };
  
    // Generate the invoice PDF
    try {
      const result = await easyinvoice.createInvoice(invoiceData);
      const filePath = path.join(__dirname, 'invoice.pdf');
      fs.writeFileSync(filePath, result.pdf, 'base64');
  
      res.download(filePath, 'invoice.pdf', (err) => {
        if (err) {
          console.error(err);
        }
        fs.unlink(filePath, (err) => {
          if (err) console.error(err);
        });
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      res.status(500).send('Error generating invoice');
    }
  });
  
  function generateInvoiceContent(doc, details) {
    const logoPath = path.join(__dirname, 'assets', 'logo.png');
    const signaturePath = path.join(__dirname, 'assets', 'signature.png');
  
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 150 });
    } else {
      console.error('Logo image not found:', logoPath);
    }
  
    if (fs.existsSync(signaturePath)) {
      doc.image(signaturePath, 50, 600, { width: 150 });
    } else {
      console.error('Signature image not found:', signaturePath);
    }
  
    doc.fontSize(20).text('RITEJ BUSINESS TRADING', 200, 50);
    doc.fontSize(10).text('Adresse: Immeuble Basma Sousse Erriadh', 200, 80);
    doc.text('MF: 1645295/XBM/000', 200, 95);
    doc.text('Tél: 27201202 / 43131113 / 26685400', 200, 110);
  
    doc.fontSize(12).text(`Client: ${details.client}`, 50, 150);
    doc.text(`Adresse: ${details.address}`);
    doc.text(`Téléphone: ${details.phone}`);
  
    doc.text(`Date: ${details.date}`, 400, 150);
    doc.text(`Facture: ${details.invoiceNumber}`, 400, 165);
    doc.text(`Garantie: ${details.warranty}`, 400, 180);
  
    // Draw table headers
    doc.rect(50, 230, 500, 20).stroke();
    doc.text('Quantité', 55, 235);
    doc.text('Désignation', 100, 235);
    doc.text('P.U.HT (DT)', 300, 235);
    doc.text('Total HT (DT)', 400, 235);
  
    // Draw table content
    let y = 250;
    details.items.forEach(item => {
      doc.rect(50, y, 500, 20).stroke();
      doc.text(item.quantity, 55, y + 5);
      doc.text(item.description, 100, y + 5);
      doc.text(item.unitPrice, 300, y + 5);
      doc.text(item.totalPrice, 400, y + 5);
      y += 20;
    });
  
    // Draw total section
    doc.text(`Total HT: ${details.totalHT}`, 400, y + 20);
    doc.text(`TVA 19%: ${details.tva19}`, 400, y + 40);
    doc.text(`TVA 7%: ${details.tva7}`, 400, y + 60);
    doc.text(`Timbre Fiscal: ${details.timbreFiscal}`, 400, y + 80);
    doc.text(`Total (DT): ${details.total}`, 400, y + 100);
  
    // Add signature
    doc.text('Cachet et Signature', 50, y + 140);
  }
  

module.exports = router;