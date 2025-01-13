const Controller = require('../Controller');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const config = require('../../../config')


module.exports = new class DealController extends Controller {
  async create(req, res) {
    req.checkBody('car', 'name is mandatory').notEmpty();
    req.checkBody('customer', 'password is mandatory').notEmpty();
    req.checkBody('type', 'password is mandatory').notEmpty();
    req.checkBody('amount', 'password is mandatory').notEmpty();

    if (this.showValidationErrors(req, res)) {
      return;
    }

    if (req.body.type !== 'sell' && req.body.type !== 'buy') {
      return res.status(403).json({
        success: false,
        message: 'the type must be sell or buy'
      });
    }

    try {
      const { car, customer, type, amount } = req.body;
      const user = req.user._id
      const deal = await this.model.Deal.create({ car, customer, type, user, amount });
      
      await this.model.Logs.create({
        userId: req.user._id,
        activity: 'create',
        modelName: 'Deal',
        modelId: deal._id,
      });

      if (type === 'sell') {
        //forMohammad : comment below line
        await this.model.Car.findByIdAndUpdate(car, { inWareHouse: false })
      }

      const carDetails = await this.getCarDetails(req.body.car);

      if (!carDetails.success) {
        return res.status(500).json({
          success: false,
          message: carDetails.message
        });
      }

      const customerDetails = await this.model.Customer.findById(req.body.customer);

      if (customerDetails === null) {
        return res.status(403).json({
          success: false,
          message: 'this customer is not available'
        });
      }

      try{

        const browser = await puppeteer.launch({
          args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-accelerated-2d-canvas',
              '--disable-gpu',
              '--window-size=1920x1080'
          ]
      });
            console.log('level 1')
      const page = await browser.newPage();
      console.log('level 2')


      const htmlContent = `
      <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 30px;
    }
    
    h1 {
      font-size: 24px;
      text-align: center;
      margin-bottom: 20px;
    }
    
    h2 {
      font-size: 18px;
      margin-bottom: 10px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    table th, table td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    .customer-details {
      margin-bottom: 30px;
    }
    
    .car-details {
      margin-bottom: 30px;
    }
    
    .amount {
      text-align: right;
      font-size: 20px;
    }
    
    .date-row {
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <h1>Invoice</h1>

  <div class="date-row">
    <strong>Date: </strong> ${deal.createdAt}
  </div>

  <div class="customer-details">
    <h2>Customer Details</h2>
    <table>
      <tr>
        <th>Invoice Number</th>
        <th>Customer Name</th>
        <th>Customer Family</th>
      </tr>
      <tr>
        <td>${deal._id}</td>
        <td>${customerDetails.name}</td>
        <td>${customerDetails.family}</td>
      </tr>
    </table>
  </div>

  <div class="car-details">
    <h2>Car Details</h2>
    <table>
      <tr>
        <th>Brand</th>
        <th>Model</th>
        <th>Color</th>
        <th>Year</th>
        <th>Fuel Type</th>
      </tr>
      <tr>
        <td>${carDetails.data.brand}</td>
        <td>${carDetails.data.model}</td>
        <td>${carDetails.data.color}</td>
        <td>${carDetails.data.year}</td>
        <td>${carDetails.data.fuelType}</td>
      </tr>
      <tr>
        <th>Body No</th>
        <th>Engine No</th>
        <th>Mileage</th>
        <th>Plate No</th>
      </tr>
      <tr>
        <td>${carDetails.data.bodyNo}</td>
        <td>${carDetails.data.engineNo}</td>
        <td>${carDetails.data.mileage}</td>
        <td>${carDetails.data.mileage}</td>
      </tr>
    </table>
  </div>

  <div class="amount">
    <h2>Amount</h2>
    <p>${req.body.amount}</p>
  </div>
</body>
</html>
       `;

    console.log(htmlContent)
      await page.setContent(htmlContent);

      const outputDirectory = './public/invoices';

      const filename = `${deal._id}.pdf`;


      const outputPath = path.join(outputDirectory, filename);


      try{

      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
      }
      console.log('level 8')

    }catch(err){
      return res.status(500).json({
        success : false,
        message : 'error in making folder',
        data : err
      })
    }

      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
      });
      console.log('level 9')


      await browser.close();
      console.log('level 10')

    } catch(err){
      return res.status(500).json({
        success : false,
        message : 'ERROR  IN PDF',
        data : err
      })
    }

      // Return a success response
      return res.status(200).json({
        success: true,
        message: 'Invoice created successfully',
        data: config.servicePath+outputPath
      });

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching car details'
      });
    }
  }


  async getCarDetails(carId) {
    try {

      const car = await this.model.Car.findById(carId);

      const [brand, model, color] = await Promise.all([
        this.model.Brand.findById(car.brand),
        this.model.Model.findById(car.model),
        this.model.Color.findById(car.color)
      ]);

      const finalRes = {
        bodyNo: car.bodyNo,
        engineNo: car.engineNo,
        mileage: car.mileage,
        year: car.year,
        fuelType: car.fuelType,
        plateNo: car.plateNo,
        brand: brand.name,
        model: model.name,
        color: color.name
      };

      return {
        success: true,
        data: finalRes
      };
    } catch (error) {
      console.error('Error: ', error); // Add this line to log the error

      return {
        success: false,
        message: error
      };
    }
  }
};