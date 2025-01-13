const Controller = require('../Controller');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const config = require('../../../config');
const helper = require('../../../../helper')


module.exports = new class CommisionAgreementController extends Controller {
  async getAll(req, res){
    try {
      let invoices = await this.model.ComissionAgreement.find({}).sort({createdAt : -1})
      let finalRes = []
      for (let invoice of invoices) {
        let temp = {}
        temp.invoiceDetails = invoice
        const buyer = await helper.getCustomerDetails(invoice.buyer);
        const seller = await helper.getCustomerDetails(invoice.seller);
        temp.buyerDetails = buyer.data
        temp.sellerDetails = seller.data
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
    req.checkBody('buyer', 'buyer is mandatory').notEmpty();
    req.checkBody('seller', 'seller is mandatory').notEmpty();
    req.checkBody('car', 'car is mandatory').notEmpty();
    req.checkBody('price', 'price is mandatory').notEmpty();
    req.checkBody('buyWithNoWarrantyGuaranty', 'buyWithNoWarrantyGuaranty is mandatory').notEmpty();
    req.checkBody('noReturn', 'noReturn is mandatory').notEmpty();
    req.checkBody('salesTakePlace', 'salesTakePlace is mandatory').notEmpty();
    req.checkBody('differentTax', 'differentTax is mandatory').notEmpty();
    req.checkBody('KFZBrief', 'KFZBrief is mandatory').notEmpty();
    req.checkBody('Fahrzeugschein', 'Fahrzeugschein is mandatory').notEmpty();
    req.checkBody('Hauptuntersuchung', 'Hauptuntersuchung is mandatory').notEmpty();
    req.checkBody('Schlüssel', 'Schlüssel is mandatory').notEmpty();
    req.checkBody('description', 'description is mandatory').notEmpty();
    req.checkBody('inGermany', 'inGermany is mandatory').notEmpty();


    const protocol = req.protocol;
    const host = req.get('host'); // 'host' includes both hostname and port
    const baseUrl = `${ protocol }://${ host }`;
    if (this.showValidationErrors(req, res)) {
      return;
    }

    try {
     
      const { buyer,
              seller,
              car,
              price,
              priceDeposit,
              paymentMethodDeposit,
              buyWithNoWarrantyGuaranty,
              noReturn,
              salesTakePlace,
              differentTax,
              KFZBrief,
              Fahrzeugschein,
              Hauptuntersuchung,
              Schlüssel,
              description,
              inGermany
      } = req.body;
      let  handOverToBuyer =
      {
          KFZBrief,
          Fahrzeugschein,
          Hauptuntersuchung,
          Schlüssel,
          description
      }
      const user = req.user._id
      const deal = await this.model.ComissionAgreement.create({
        buyer,
        seller,
        car,
        price,
        priceDeposit,
        paymentMethodDeposit,
        buyWithNoWarrantyGuaranty,
        noReturn,
        salesTakePlace,
        differentTax,
        handOverToBuyer,
        user,
        inGermany
      })
      const log = await this.model.InvoiceLog.create({
        car,
        invoiceType : 'ComissionAgreement',
        invoiceId : deal._id
      })
      const currentDate = deal.createdAt
      //forMohammad : comment below line
      await this.model.Car.findByIdAndUpdate(car, { inWareHouse: false, soldDate: currentDate })

     const outputDirectory = './public/invoices';
     const filename = `${deal._id}.pdf`;
     const outputPath = path.join(outputDirectory, filename);
     let gesamtpreis

    const currentDatej = new Date();
    const day = String(currentDatej.getDate()).padStart(2, '0');
    const month = String(currentDatej.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = currentDatej.getFullYear();

    const dateOnly = `${day}.${month}.${year}`;

      
      await this.model.Logs.create({
        userId: req.user._id,
        activity: 'create',
        modelName: 'ComissionAgreement',
        modelId: deal._id,
      });

      let carDetails = await this.getCarDetails(car);

      if (!carDetails.success) {
        return res.status(500).json({
          success: false,
          message: carDetails.message
        });
      }
      carDetails = carDetails.data

      const buyerDetails = await this.model.Customer.findById(buyer);
      const sellerDetails = await this.model.Customer.findById(seller);


      if (buyerDetails === null) {
        return res.status(403).json({
          success: false,
          message: 'this buyer is not available'
        });
      }
      // if (sellerDetails === null) {
      //   return res.status(403).json({
      //     success: false,
      //     message: 'this seller is not available'
      //   });
      // }
      
    //   let address =  customerDetails.address
    //   address.trim();
    // var words = address.split(" ");
    // var country =  words[words.length - 1];

      const baseInfo = await this.model.BaseInfo.findOne({})
      let ownerInfo = baseInfo.ownerInfo
       ownerInfo = (ownerInfo.split('\n'))
       let ownerName = ownerInfo[0]
       let ownerAddress = ownerInfo[1] + ' ' + ownerInfo[2]
     
      const formatter = new Intl.NumberFormat('de-DE',{
        style : 'currency',
        currency : 'EUR'
      })

      try{
          const createCheckboxDamage = (label, checked) =>{
              return `<label class="custom-checkbox " >
                <input type="checkbox" ${checked ? 'checked' : ''}/>
                <span class="checkmark"> </span>
                <span class="span-label">${label}</span>
                
            </label>`;
          }

          const createCheckboxSimple = (label, condition, extraContent = '', width = '25%') =>
              `<label class="custom-checkbox" style="width: ${width};">
                    <input type="checkbox" ${condition ? 'checked' : ''}/>
                    <span class="checkmark"> </span>
                    <span class="span-label">${extraContent}${label}</span>
                    
                </label>`;
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
      const page = await browser.newPage();

      let htmlContent = `<!DOCTYPE html>
      <html>
      <head>
          <title>Invoice Template</title>
          <link rel="stylesheet" href="${ `${ baseUrl }/public/css/comagree.css` }">
      </head>
      <body>
          <div class="invoice">
                <div class="invoice-header ">
                    <h2>Kommissionsverkauf von Gebrauchtwagen über</h2>
                </div>
                <div class="invoice-logo">
                <img src="${`${ baseUrl }/public/Drivezy_Mix.png`}" alt="logo" />  
                </div>
                <div class="invoice-info-section">
                      <div class="invoice-info-box">
                          <u>Käufer</u>
                          <p class="first-p-u">Name: <span class="span-name">${buyerDetails.name + ' ' + buyerDetails.family}</span></p>
                          <p>Anschrift: <span class="span-address">${buyerDetails.address}</span></p>
                          <p>Wohnort: <span class="span-city">${buyerDetails.city + ' , ' + buyerDetails.zipCode}</span></p>
                      </div>
                      <div class="invoice-info-box r-box">
                          <u>Verkäufer</u>
                          <p class="first-p-u">Name: <span  class="span-name">${sellerDetails.name + ' ' + sellerDetails.family}</span></p>
                          <p>Anschrift: <span class="span-address">${sellerDetails.address}</span> </p>
                          <p>Wohnort: <span  class="span-city">${sellerDetails.city + ' , ' + sellerDetails.zipCode}</span></p>
                      </div>
                </div>
              <div class="describe">
                  <p>${baseInfo.comissionAgreementStaticText}</p>
              </div>
              <div>
                  <h2>Bezeichnung des Fahrzeuges</h2>
              </div>
              <div class="invoice-info-section">
                  <div class="invoice-info-box">
                      <p> Fabrikat: <span class="span-brand" >${carDetails.brand}</span></p>
                      <p>Fahrzeugbrief-Nr: <span class="span-registeredDocumentNo">${carDetails.registeredDocumentNo}</span>
                      <p>Amtliches Kennzeichen: <span class="span-plateNo">${carDetails.plateNo}</span>`
                      if (carDetails.firstRegistration.includes("T")) {
                        const explodedArray = carDetails.firstRegistration.split("T");
                        carDetails.firstRegistration = explodedArray[0];
                      }
                      
                      htmlContent = htmlContent + ` <p>Tag der Erstzulassung: <span class="span-firstRegistration">${carDetails.firstRegistration}</span>
                  </div>
                  <div class="invoice-info-box  r-box">
                      <p>Typ: <span class="span-model">${carDetails.model}${carDetails.description ? ' - ' + carDetails.description : ''}</span>
                      <p>Fahrgestell-Nr: <span class="span-bodyNo">${carDetails.bodyNo}</span>
                      <p>HU/AU: <span class="span-HUAU">${carDetails.HUAU}</span>
                      <p>Kilometerstand lt. Tacho: <span class="span-mileage" >${carDetails.mileage + ' ' + 'KM'}</span>
                  </div>
              </div>
              <div class="checkbox-row checkbox-row-unfallschaden"  >
                <label class="custom-checkbox"  >
                    Unfallschaden:
                </label>
                 `
                  htmlContent += createCheckboxDamage('Unfallfrei',  carDetails.accidentalDamage !== 'no');
                  htmlContent += createCheckboxDamage('Unfallschaden',  carDetails.accidentalDamage === 'yes');
                  htmlContent += createCheckboxDamage('reparierte Vorschäden möglich',  carDetails.accidentalDamage === 'repaired');
                  
                  htmlContent = htmlContent +  ` </b>
              </div>
              <p  >Nachlackierungen sind nicht ausgeschlossen.</p>
              <div class="invoice-info-box sonstige" style="width: auto;text-align: left">
                  <p><span class="h2">Sonstige :</span>  <span >${carDetails.accidentalDamageDescription || ""}</span></p>
              </div>
              <div class="invoice-info-box" style="width: auto;text-align: left;margin-top: 30px">
              <p><span> </span></p>
            </div>
              <div>
            <h2 class="ubergabe" >Die Übergabe des Fahrzeuges an den Käufer:</h2>
   
        </div>
              <div>
                  <div class="checkbox-row kzf"  >
                       `
                      htmlContent += createCheckboxSimple('KFZ- Brief', KFZBrief);
                      htmlContent += createCheckboxSimple('Fahrzeugschein', Fahrzeugschein);
                      htmlContent += createCheckboxSimple('Hauptuntersuchung', Hauptuntersuchung);
                      htmlContent += createCheckboxSimple('Schlüssel', Schlüssel, Schlüssel ? `<span style="font-weight: normal" class="schlussel">${Schlüssel}</span> ` : `<span style="font-weight: normal">___</span> `);
                     htmlContent = htmlContent + `
                  </div>
              </div>
              <div class="invoice-info-box" style="width: auto;text-align: left">
              <p> <span class="h2">Besondere Vereinbarungen:</span> <span >${description}</span></p>
          </div>
          <div class="invoice-info-box" style="width: auto;text-align: left;margin-top: 30px">
          <p>  <span > </span></p>
      </div>
  <div class="wurde">
      <p>
          Das Fahrzeug wurde im Auftrag des oben genannten Verkäufers im Kundenauftrag verkauft. Somit entfallen alle
          Gewährleistungs- und Garantieansprüche gegenüber Drivezy Mix Automobile. Der Käufer bestätigt mit seiner
          Einwilligung und Unterschrift die Kenntnisnahme.
      </p>
  </div>
  <div class="checkbox-row logn-check"  >
   `
          htmlContent += createCheckboxSimple('Gekauft wie gesehen, unter Ausschluss jeglicher Gewährleistung und Garantie', buyWithNoWarrantyGuaranty, '', '100%');
          htmlContent += createCheckboxSimple('Im Kundenauftrag, keine Gewährleistung und Garantie sowie Rücknahme', noReturn, '', '100%');
          htmlContent += createCheckboxSimple('Verkauf erfolgt nach Export, unter Ausschluss jeglicher Gewährleistung und Garantie', salesTakePlace, '', '100%');
          htmlContent += createCheckboxSimple('Differenzbesteuerung nach § 25a', differentTax, '', '100%');
          htmlContent = htmlContent + ` 
              </div>
                  `
                  if(inGermany){
                    let netto =  parseFloat( price)
                    netto = netto.toFixed(2)
                    let mwst = parseFloat( (price * 19)/100)
                    mwst = mwst.toFixed(2)
                    gesamtpreis = parseFloat( netto + mwst )
                    gesamtpreis = gesamtpreis.toFixed(2)

                    htmlContent = htmlContent +  `
                    <div class="invoice-info-box" style="width: auto;text-align: left;display: flex;justify-content: space-between">
                    <div style="display: inline-flex;width: 47%"> <span class="h2">Gesamtpreis Brutto:</span><span  style="text-align: center">${' ' + formatter.format(gesamtpreis) + ' '}</span></div>
                    <div style="display: inline-flex;width: 30%"><span class="h2">Netto:</span><span  style="text-align: center">${' '+formatter.format(netto)+' '}19% </span></div>
                    <div style="display: inline-flex;width: 23%"> <span class="h2">MwSt:</span><span  style="text-align: center">${' '+formatter.format(mwst)+' '}</span></div>
                </div> 
                `
                  }
                  else{
                            gesamtpreis = parseFloat( price)
                            htmlContent = htmlContent + `
                           
                               <div class="invoice-info-box" style="width: auto;text-align: left;display: flex;justify-content: space-between">
                                   <div style="display: inline-flex;width: 47%"><span class="h2">Gesamtpreis Brutto:</span><span  style="text-align: center">${' ' + formatter.format(gesamtpreis) + ' '} </span></div>
                                   <div style="display: inline-flex;width: 30%"><span class="h2">Netto:</span><span  style="text-align: center"></span></div>
                                   <div style="display: inline-flex;width: 23%"><span class="h2">19% MwSt:</span><span  style="text-align: center">  </span></div>
                               </div>
                                   
                                  `
                  }
                 const textNumber = this.numberToWord(gesamtpreis)
                 htmlContent = htmlContent +`
                 
                 <div class="invoice-info-box" style="width: auto;text-align: left;margin-top: 12px">
                 <p style="display: inline-flex;width: 100%"> <span class="h2">in Worten:</span><span class="worten">${' '+ textNumber +' '} </span></p>
                 <p style="display: inline-flex;width: 100%"> <span class="h2">Datum, Ort:</span><span  class="datum"> ${' '+ dateOnly + '  ' +  baseInfo.shopOwnerCity    } </span></p>`;
          if(priceDeposit !== undefined && priceDeposit !== null && priceDeposit !== '0'){
              let priceDepositParse = parseFloat( priceDeposit )
              priceDepositParse = priceDepositParse.toFixed(2)
              let msg;
              if (paymentMethodDeposit == 'iban') {
                  msg = `Der Kunde hat den Betrag von ${ priceDepositParse } Euro als Anzahlung überwiesen`;
              } else {
                  msg = `Der Kunde hat ${ priceDepositParse } Euro in bar angezahlt.`;
              }
              htmlContent = htmlContent + `
                 <p style="display: inline-flex;width: 100%"> <span class="h2">Anzahlung:</span><span  class="datum"> ${ msg } </span></p>`;
          }
                  htmlContent = htmlContent +`
             </div>     
               <div class="invoice-info-section">
                 <div class="invoice-info-box footer"  >
                     <p><b>Unterschrift des Käufers</b></p>
                 </div>
                 <div class="invoice-info-box footer r-box"  >
                     <p><b>Unterschrift des Verkäufers</b></p>
                 </div>
            </div>
          </div>
         
      </body>
      </html>`

     // console.log(htmlContent)
      await page.setContent(htmlContent, {waitUntil: 'networkidle0'});
          const publicDir = path.join(__dirname, '../../../..', 'public/invoices/');

          // Ensure the public directory exists
          if (!fs.existsSync(publicDir)) {
              console.log("dir not exists : " + publicDir);
              fs.mkdirSync(publicDir, {recursive: true});
          }
          const htmlFileName = path.basename(`${deal._id}.html`);

          const filePath = path.join(publicDir, htmlFileName);
          console.log(filePath)
          fs.writeFile(filePath, htmlContent, function (err) {
              if (err) throw err;
              console.log('Saved or truncated!');
          });


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
      await this.model.ComissionAgreement.findByIdAndUpdate(deal._id, 
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

   numberToWord(number) {
    const digits = ['Null', 'Eins', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Nein'];
    if (number === 0) {
      return digits[0];
    }
    
    const numberString = number.toString();
    let result = '';
    
    for (let i = 0; i < numberString.length; i++) {
      const digit = parseInt(numberString[i]);
      result += digits[digit];
      
      if (i !== numberString.length - 1) {
        result += '-';
      }
    }
    
    return result;
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

  async cancelInvoice(req, res){
    try{
    const canceledInvoice = await this.model.ComissionAgreement.findByIdAndUpdate(req.params.id,
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
};
