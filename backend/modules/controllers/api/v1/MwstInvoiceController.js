const Controller = require('../Controller');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const config = require('../../../config');
const helper = require('../../../../helper')
const Temp = require('./TempController')


module.exports = new class MwstInvoiceController extends Controller {
  async cancelInvoice(req, res){
    try{
    const canceledInvoice = await this.model.MwstInvoice.findByIdAndUpdate(req.params.id,
      {status : 'canceled'})
      const updatedCar = await this.model.Car.findByIdAndUpdate(canceledInvoice.car, {
        inWareHouse : true
      })
      return res.json({
        success : true,
        data : {
          invoiceId : canceledInvoice._id,
          carId : canceledInvoice.car
        }
      })
    }
    catch(err){
      return res.status(500).json({
        success : false,
        message : err
      })
    }


  }
  async getAll(req, res){
    try {
      let invoices = await this.model.MwstInvoice.find({}).sort({createdAt : -1})
      console.log(invoices)
      let finalRes = []
      for (let invoice of invoices) {
        let temp = {}
        temp.invoiceDetails = invoice
        const customer = await helper.getCustomerDetails(invoice.customer);
        temp.customerDetails = customer.data
        const car = await helper.getCarDetails(invoice.car)
        temp.carDetails = car.data
        finalRes.push(temp)
      }
      return res.json({
        success: true,
        data: finalRes
      });
    } catch(err) {
      return res.status(500).json({
        success: false,
        message: err
      });
    }
  }
  async create(req, res) {
    req.checkBody('car', 'name is mandatory').notEmpty();
    req.checkBody('customer', 'password is mandatory').notEmpty();
    req.checkBody('price', 'price is mandatory').notEmpty();
    const protocol = req.protocol;
    const host = req.get('host'); // 'host' includes both hostname and port
    const baseUrl = `${ protocol }://${ host }`;
    if (this.showValidationErrors(req, res)) {
      return;
    }



    try {
      let { car, customer, price } = req.body;
      price = parseFloat(price)
      price = price.toFixed(2)
      let withPercent = parseFloat( (price *19)/100)
      withPercent = withPercent.toFixed(2)
      let total = parseFloat(price) + parseFloat(withPercent)
      total = total.toFixed(2)
      const user = req.user._id
      const invoiceNumber = (await Temp.getInvoiceNumber())['invoiceNumber']

      const deal = await this.model.MwstInvoice.create({car, customer, price, user, invoiceNumber})
      const log = await this.model.InvoiceLog.create({
        car,
        invoiceType : 'MwstInvoice',
        invoiceId : deal._id
      })
      const currentDate = deal.createdAt  

      //forMohammad : comment below line
      await this.model.Car.findByIdAndUpdate(car, { inWareHouse: false, soldDate: currentDate })


     const outputDirectory = './public/invoices';
     const filename = `${invoiceNumber}.pdf`;
     const outputPath = path.join(outputDirectory, filename);

     const dateOnly = `${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;


        await this.model.Logs.create({
        userId: req.user._id,
        activity: 'create',
        modelName: 'MwstInvoice',
        modelId: deal._id,
      });

      let carDetails = await this.getCarDetails(req.body.car);

      if (!carDetails.success) {
        return res.status(500).json({
          success: false,
          message: carDetails.message
        });
      }

      carDetails = carDetails.data

      const customerDetails = await this.model.Customer.findById(req.body.customer);

      if (customerDetails === null) {
        return res.status(403).json({
          success: false,
          message: 'this customer is not available'
        });
      }
      let address =  customerDetails.address
      address.trim();
    var words = address.split(" ");
    var country =  words[words.length - 1];

      const baseInfo = await this.model.BaseInfo.findOne({})
      const formatter = new Intl.NumberFormat('de-DE',{
        style : 'currency',
        currency : 'EUR'
      })

      try{

        const browser = await puppeteer.launch({
          args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-accelerated-2d-canvas',
              '--disable-gpu',
              '--window-size=1920x1080',
              '--force-device-scale-factor=1.5'
          ]
      });
      const page = await browser.newPage();

      const htmlContent = `
      <html>
      <head>
            <style> 
                .custom-dashed-border {  background-image: url( '${ baseUrl }/public/border.png' );   }
            </style>
            <link rel="stylesheet" href="${ `${ baseUrl }/public/css/mwst.css` }">
      </head>
      <body>
      <div class="invoice">
          <div class="invoice-header">
            <div class="invoice-logo">  <img src="${`${ baseUrl }/public/Drivezy_Mix.png`}" alt="logo" />  </div>
            <small>  
            <p class="address " >            
                ${ `${ baseInfo.storeName }*${ baseInfo.ownerInfo }*${ baseInfo.street } ${ baseInfo.plateNumber }*${ baseInfo.zipCode } ${ baseInfo.shopOwnerCity }` }                           
            </p>
            </small>  
            <table class="customer-details">
                <tr>
                  <td style="width: 35%">${ customerDetails.name + ' ' + customerDetails.family }</td>   
                  <td  >(Alain Gerard Pangout)</td>         
                </tr>
                <tr>
                  <td>${ customerDetails.address }</td>
                  <td>(Borsigweg 15)</td>
                </tr>
                <tr>
                  <td>${ `${ customerDetails.city }, ${ customerDetails.zipCode } ` } </td>
                  <td>(30165 Hannover)</td>
                </tr>
            </table>

            <p class="shop-owner-details">${ baseInfo.shopOwnerCity }, den ${ dateOnly.split('-').reverse().join('.') } </p>
            <h2> Rechnung Nr. ${ invoiceNumber }  </h2>
            <p style="  margin-top: 11px;" class="lieferdatum">Lieferdatum: ${ dateOnly.split('-').reverse().join('.') }</p>
            <p style="padding-top: 23px;" class="lieferdatum">EORI-Nummer: ${baseInfo.eoriNumber}</p>
            <p class="mwst-static">${baseInfo.mwstStaticText}</p>
            <table class="fahrzeug-table" cellpadding="0">
                <tr>
                    <td>Fahrzeug</td>
                    <td style="text-align: right">Preis</td>
                </tr>
                <tr>
                    <td >${ carDetails.brand + ' ' + carDetails.model }${carDetails.description ? ' - ' + carDetails.description : ''}</td>
                    <td class="price-bold">${ formatter.format(price).replace(/\s/g, '') }</td>
                </tr>
            </table>
            <table class="fahrgestell-nr"   cellpadding="0">
                <tr>
                    <td class="fahrgestell-nr">Fahrgestell-Nr.:</td>
                    <td  >${ carDetails.bodyNo }</td>
                </tr>
                <tr>
                    <td class="fahrgestell-nr">Erstzulassung:</td>
                    <td>${ carDetails.firstRegistration.split('/').reverse().join('.') }</td>
                </tr>
                <tr>
                    <td class="fahrgestell-nr">Lackierung:</td>
                    <td>${ carDetails.color }</td>
                </tr>
                <tr>
                    <td class="fahrgestell-nr">Kilometer:</td>
                    <td>${ carDetails.mileage.toLocaleString('de-DE') + ' KM' }</td>
                </tr>
            </table>
            <div class="custom-dashed-border" style="margin-top: 8px;"> </div>
             
            <table class="gesamt-mwst-table" cellpadding="0">
            <tr>
                <td>Gesamt Netto</td>
                <td class="price-bold">${  formatter.format(price).replace(/\s/g, '') }</td>
            </tr>
            </table>
            <div class="custom-dashed-border"  > </div>
             
            <table class="gesamt-mwst-table" cellpadding="0">
                <tr>
                    <td>zzgl. 19,00 % MwSt.</td>
                    <td class="price-bold" style="text-align: right; " >${ formatter.format(withPercent).replace(/\s/g, '') } </td>
                </tr>
            </table>
            <div class="custom-dashed-border" > </div>
            <table class="gesamtbetrag-table" cellpadding="0">
                <tr>
                    <td  class="price-bold" style="letter-spacing: 0;" >Gesamtbetrag &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u>${ formatter.format(total).replace(/\s/g, '') }</u></td>
                </tr>
            </table>
            <div style="clear: both">            
            <p  class="wir-bitten"> Wir bitten den Rechnungsbetrag ohne Abzüge nach Erhalt der Rechnung auszugleichen. </p>
        </div>

         <div class="row-with-boxes" >
          <div class="box">
              <b>Inhaber:</b><br>
<!--              ${ baseInfo.ownerInfo } <br>-->
              A. Kerimov <br>
              ${ baseInfo.street } ${ baseInfo.plateNumber } <br>
              ${ baseInfo.zipCode } ${ baseInfo.shopOwnerCity }  
          </div>
          <div class="box" style="text-align:center">
              <b>Finanzamt:</b><br>
              St.- Nr.: ${ baseInfo.taxOffice_St   }<br> Ust.- IdNr.: ${ baseInfo.taxOffice_Ust }
          </div>
          <div class="box" style="text-align:right">
              <b>Bankverbindungen:</b><br>
              IBAN: ${ baseInfo.IBAN  }<br> BIC: ${ baseInfo.BIC }
          </div>
        </div>
</div>
</div>
      </body>
      </html>
       `;


      await page.setContent(htmlContent, {waitUntil: 'networkidle0'});
          const publicDir = path.join(__dirname, '../../../..', 'public/invoices/');

          // Ensure the public directory exists
          if (!fs.existsSync(publicDir)) {
              //console.log("dir not exists : " + publicDir);
              fs.mkdirSync(publicDir, {recursive: true});
          }
          const currentFileName = path.basename(`${invoiceNumber}.pdf`);
          const htmlFileName = currentFileName.replace('.pdf', '.html');
          const filePath = path.join(publicDir, htmlFileName);
          fs.writeFile(filePath, htmlContent, function (err) {
              if (err) throw err;
              console.log('Saved or truncated!');
          });;

      try{

      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
      }

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
          scale: 1,
      });


      await browser.close();

    } catch(err){
      return res.status(500).json({
        success : false,
        message : 'ERROR  IN PDF',
        data : err
      })
    }
      // Return a success response
      await this.model.MwstInvoice.findByIdAndUpdate(deal._id, 
        { invoiceLink: outputPath})
      return res.status(200).json({
        success: true,
        message: 'Invoice created successfully',
        data: outputPath
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

            const [brand, model, color] = await Promise.all([this.model.Brand.findById(car.brand), this.model.Model.findById(car.model), this.model.Color.findById(car.color)]);

            const finalRes = {
                ...car._doc,
                brand: brand !== null ? brand.name : 'noName',
                model: model !== null ? model.name : 'noName',
                color: color !== null ? color.name : 'noName',
            };

            return {
                success: true, data: finalRes
            };
        } catch (error) {
            console.error('Error: ', error); // Add this line to log the error

            return {
                success: false, message: error
            };
        }
    }
};
