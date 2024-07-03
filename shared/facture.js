const generateHtml = (data) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
    <title>Invoice</title>
</head>
<body>
    <div class="container">
        <div class="invoice">
            <div class="row">
                <div class="col-7">
                    <img src="https://i.ibb.co/0Kc1LCv/logo.png" class="logo"/>
                </div>
                <div class="col-5">
                    <h1 class="document-type display-4">FACTURE</h1>
                    <p class="text-right"><strong>${data.invoiceNumber}</strong></p>
                </div>
            </div>
            <div class="row">
                <div class="col-5">
                    <br/><br/><br/>
                    <p class="addressDriver">
                        ${data.firstName} ${data.lastName}<br/>
                        ${data.address}<br/>
                        ${data.zipCode} ${data.city} ${data.governorat}
                    </p>
                </div>
            </div>
            <br/>
            <br/>
            <br/>
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>Quantité</th>
                    <th>Désignation</th>
                    <th>Prix</th>
                </tr>
                </thead>
                <tbody>
                 ${data.items.map(item =>`
                <tr>
                    <td>${item.quantity}</td>
                    <td>${item.product}</td>
                    <td>${item.price}</td>
                </tr>
                `).join('')}
                </tbody>
            </table>
            <div class="row">
                <div class="col-8">
                </div>
                <div class="col-4">
                    <table class="table table-sm text-right">
                        <tr>
                            <td><strong>Total HT</strong></td>
                            <td class="text-right">${data.totalHT}</td>
                        </tr>
                        <tr>
                            <td>TVA 19%</td>
                            <td class="text-right">${data.TVA}</td>
                        </tr>
                        <tr>
                            <td><strong>Total TTC</strong></td>
                            <td class="text-right">${data.totalTTC}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

    `;
  }

  module.exports = generateHtml;