const Controller = require('../Controller');
const puppeteer = require('puppeteer');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const config = require('../../../config');
const helper = require('../../../../helper')


module.exports = new class   PurchaseWithWarrantyController extends Controller {

  async cancelInvoice(req, res){
    try{
    const canceledInvoice = await this.model.PurchaseWithWarranty.findByIdAndUpdate(req.params.id,
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
      let invoices = await this.model.PurchaseWithWarranty.find({}).sort({createdAt : -1}) 
      let finalRes = []
      for (let invoice of invoices) {
        let temp = {}
        temp.invoiceDetails = invoice
        const buyer = await helper.getCustomerDetails(invoice.buyer);
     //   const seller = await helper.getCustomerDetails(invoice.seller);
        temp.buyerDetails = buyer.data
      //  temp.sellerDetails = seller.data
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
   // req.checkBody('seller', 'seller is mandatory').notEmpty();
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
    req.checkBody('paymentMethod', 'paymentMethod is mandatory').notEmpty();
    const protocol = req.protocol;
    const host = req.get('host'); // 'host' includes both hostname and port
    const baseUrl = `${ protocol }://${ host }`;
    if (this.showValidationErrors(req, res)) {
      return;
    }

    try {
     
      const { buyer,
         //     seller,
              car,
              price,
              priceDeposit,
              paymentMethodDeposit,
              KFZBrief,
              Fahrzeugschein,
              Hauptuntersuchung,
              Schlüssel,
              description,
              inGermany,
              paymentMethod,
              buyWithNoWarrantyGuaranty,
              stamp,
              noReturn,
              salesTakePlace
      } = req.body;
      //dayi inja be karete
      console.log(stamp)
      //ok shod?
      let  handOverToBuyer =
      {
          KFZBrief,
          Fahrzeugschein,
          Hauptuntersuchung,
          Schlüssel,
          description
      }
      const user = req.user._id
      const deal = await this.model.PurchaseWithWarranty.create({
        buyer,
     //   seller,
        car,
        price,
        priceDeposit,
        paymentMethodDeposit,
        handOverToBuyer,
        user,
        inGermany,
        paymentMethod
      })
      const log = await this.model.InvoiceLog.create({
        car,
        invoiceType : 'NettoInvoice',
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
        modelName: 'PurchaseWithWarranty',
        modelId: deal._id,
      });
     
      // @mohammad 
      let carDetails = await this.getCarDetails(car);

      if (!carDetails.success) {
        return res.status(500).json({
          success: false,
          message: carDetails.message
        });
      }
      carDetails = carDetails.data

      // @mohammad 
      const buyerDetails = await this.model.Customer.findById(buyer);

      // @mohammad 
     // const sellerDetails = await this.model.Customer.findById(seller);


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
        <link rel="stylesheet" href="${ `${ baseUrl }/public/css/purchasewithwarranty.css` }">
 
      </head>
      <body>
<!--          <div class="roboto">This is a text in Roboto.</div>-->
<!--    <div class="arial-rounded">This is a text in Arial Rounded MT Bold.</div>-->
<!--    <div class="helvetica-neue-roman">This is a text in Helvetica Neue Roman.</div>-->
<!--    <div class="helvetica-neue-bold">This is a text in Helvetica Neue Bold.</div>-->
<!--    <div class="andale-mono">This is a text in Andale Mono.</div>-->
<!--    <div class="arial-mt">This is a text in Arial MT.</div>-->
<!--    <div class="arial-bold-mt">This is a text in Arial Bold MT.</div>-->
      <div class="invoice">
          <div class="invoice-content">
              <div class="invoice-header">
                  <h2>Kaufvertrag eines Gebrauchtwagens</h2>
              </div>
              <div class="invoice-logo">
                <img src="${`${ baseUrl }/public/Drivezy_Mix.png`}" alt="logo" />  
              </div>
          </div> 
        
              <div class="invoice-info-section">
                  <div class="invoice-info-box">
                       <u>Käufer:</u> 
                      <p style="margin-top: 10px">Name: <span class="name">${ buyerDetails.name + ' ' + buyerDetails.family }</span></p>
                      <p>Anschrift:<span class="anschrift">${ buyerDetails.address }</span></p>
                      <p>Wohnort: <span class="wohnort">${buyerDetails.city + ' , ' + buyerDetails.zipCode}</span></p>
                  </div>
                  <div class="invoice-info-box r-box">
                       <u>Verkäufer:</u> 
                      <p style="margin-top: 10px">Name: <span class="name">${ ownerName }</span></p>
                      <p>Anschrift: <span class="anschrift">${ baseInfo.street } ${ baseInfo.plateNumber }</span></p>
                      <p>Wohnort: <span class="wohnort">${ baseInfo.shopOwnerCity + ' , ' + baseInfo.zipCode}</span></p>
                  </div>
              </div>
              <div>
              </div>
              <div>
                  <h2 class="bezeichnung">Bezeichnung des Fahrzeuges</h2>
              </div>
              <div class="invoice-info-section">
                  <div class="invoice-info-box">
                      <p> Hersteller:  <span class="fabrikat">${ carDetails.brand }</span></p>
                      <p> Fahrzeugbrief-Nr.: <span class="fahrzeugbrief">${ carDetails.registeredDocumentNo }</span></p>
                       
                      <p> KM laut Vorbesitzer:  <span class="kilometerstand1">${ carDetails.mileage + ' ' + 'KM' }</span> </p>`
                      // <p> Amtliches Kennzeichen: <span class="amtliches">${ carDetails.plateNo }</span> </p>
                      if (carDetails.firstRegistration.includes("T")) {
                        const explodedArray = carDetails.firstRegistration.split("T");
                        carDetails.firstRegistration = explodedArray[0];
                      }
                      htmlContent = htmlContent + ` <p> Tag der Erstzulassung:  <span class="erstzulassung">${ carDetails.firstRegistration }</span> </p>
                  </div>
                  <div class="invoice-info-box r-box">
                      <p> Typ:  <span class="typ">${ carDetails.model }${carDetails.description ? ' - ' + carDetails.description : ''}</span></p>
                      <p> Fahrgestell-Nr.: <span class="fahrgestell">${ carDetails.bodyNo }</span></p>
                      <p> KM laut Tacho:  <span class="kilometerstand">${ carDetails.mileage + ' ' + 'KM' }</span> </p>
                      <p> HU/AU: <span class="hu-au">${ carDetails.HUAU }</span> </p>
                      
                   
                      
                  </div>
              </div>
              <p> <h2>Unfallschaden </h2> </p> 
              <div class="checkbox-row" style="margin-top: 15px;display: flex;justify-content: space-between">

              
                   `
                  if(carDetails.accidentalDamage === 'no'){
                    htmlContent = htmlContent +  `<label class="custom-checkbox" style="width: 30%;margin-left: 0%">
                    <input type="checkbox" checked/>
                    <span class="checkmark"> </span>
                    unfallfrei laut Vorbesitzer
                </label>`
                  }else{
                    htmlContent = htmlContent +  `<label class="custom-checkbox" style="width: 30%;margin-left: 0%">
                    <input type="checkbox" />
                    <span class="checkmark"> </span>
                    unfallfrei laut Vorbesitzer
                </label>`
                  }
                  if(carDetails.accidentalDamage === 'yes'){
                    htmlContent = htmlContent + ` <label class="custom-checkbox" style="width: 29%;margin-left: 0">
                    <input type="checkbox" checked/>
                    <span class="checkmark"> </span>
                    beschädigtes Fahrzeug
                </label>`
                  }else{
                   htmlContent = htmlContent + ` <label class="custom-checkbox" style="width: 29%;margin-left: 0">
                   <input type="checkbox" />
                   <span class="checkmark"> </span>
                   beschädigtes Fahrzeug
               </label>`
                  }
                  if(carDetails.accidentalDamage === 'repaired'){
                    htmlContent = htmlContent + ` <label class="custom-checkbox" style="width: 40%;margin-left: 3%">

                    <input type="checkbox" checked/>
                    <span class="checkmark"> </span>
                    reparierte Vorschäden möglich
                </label>`
                  }else{
                    htmlContent = htmlContent + ` <label class="custom-checkbox" style="width: 40%;margin-left: 3%">

                    <input type="checkbox" />
                    <span class="checkmark"> </span>
                    reparierte Vorschäden möglich
                </label>`
                  }
                  
                  htmlContent = htmlContent +  ` 
              </div>
              <p style="font-size:16px">Nachlackierungen sind nicht ausgeschlossen.</p>
              <div class="invoice-info-box" style="width: auto;text-align: left">
              <p><span class="h2">Sonstige :</span> <span class="desc-span">${carDetails.accidentalDamageDescription || ""}</span></p>
               
              </div>
             <div class="invoice-info-box" style="width: auto;text-align: left;margin-top: 30px">
              <p><span> </span></p>
  
          </div>
              <div>
        <h2 style="margin-top: 10px" class="ubergabe">
            Übergabe des Fahrzeuges an den Käufer
        </h2>

    </div>
              <div>
                    
                  <div class="checkbox-row"  style="font-size: 14px">
                      `
                      if(KFZBrief){
                        htmlContent = htmlContent + ` <label class="custom-checkbox" style="margin-right: 20px;">
                        <input type="checkbox" checked/>
                        <span class="checkmark"> </span>
                        KFZ- Brief
                    </label>`
                      }else{
                        htmlContent = htmlContent + ` <label class="custom-checkbox" style="margin-right: 20px;">
                        <input type="checkbox" />
                        <span class="checkmark"> </span>
                        KFZ- Brief
                    </label>`
                      }
                      if(Fahrzeugschein){
                        htmlContent = htmlContent + ` <label class="custom-checkbox" style="margin-right: 20px;">
                        <input type="checkbox" checked/>
                        <span class="checkmark"> </span>
                        Fahrzeugschein
                    </label>`
                      }else{
                        htmlContent = htmlContent + ` <label class="custom-checkbox" style="margin-right: 20px;">
                        <input type="checkbox" />
                        <span class="checkmark"> </span>
                        Fahrzeugschein
                    </label>`
                      }
                     
                      if(Hauptuntersuchung){
                        htmlContent = htmlContent + ` <label class="custom-checkbox" style="margin-right: 20px;">
                        <input type="checkbox" checked/>
                        <span class="checkmark"> </span>
                        Hauptuntersuchung
                    </label>`
                      }else{
                        htmlContent = htmlContent + ` <label class="custom-checkbox" style="margin-right: 20px;">
                        <input type="checkbox" />
                        <span class="checkmark"> </span>
                        Hauptuntersuchung
                    </label>`
                      }
                  
                     if(Schlüssel){
                      htmlContent = htmlContent + ` <label class="custom-checkbox" style="margin-right: 20px;">
                      <input type="checkbox" checked/>
                      <span class="checkmark"> </span>
                      <span class="schlussel"  > &nbsp;&nbsp;  ${Schlüssel} &nbsp;&nbsp;</span> Schlüssel
                  </label>`
                     }else{
                      htmlContent = htmlContent + ` <label class="custom-checkbox" style="margin-right: 20px;">
                      <input type="checkbox" />
                      <span class="checkmark"> </span>
                      <span class="schlussel"   >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> Schlüssel
                  </label>`
                     }
                     htmlContent = htmlContent + `
                  </div>
              <div>
                 
                  <div class="invoice-info-box" style="width: auto;text-align: left;margin-top: 15px">
                  <p><span class="h2">Besondere Vereinbarungen:</span> 
                      <span class="desc-span">${description}</span></p>
      
              </div>
              <div class="invoice-info-box" style="width: auto;text-align: left;margin-top: 30px">
              <p><span> </span></p>
             </div>
                        <div class="invoice-info-box" style="width: auto;text-align: left;margin-top: 30px">
              <p><span> </span></p>
             </div>
          <div style="font-size: 8.5pt">
              <p style="font-size: 8.5pt;margin-top:5px;margin-bottom: 0;line-height:12px">
                  Es handelt sich um ein gebrauchtes Fahrzeug, welche Gebrauchs- (diverse kleinere Lackschäden wie
                  Kratzer, Beulen, Dellen und Steinschläge) und
                  Verschleiß spuren aufweist. Der Käufer nimmt diesen Verschleiß zur Kenntnis und kauft das Fahrzeug in
                  diesem Zustand, wie besichtigt.
                  <br><br>
                  Der Käufer ist verpflichtet den Kaufgegenstand innerhalb 12 Tagen ab Zugang der Bereitstellungsanzeige
                  abzunehmen. Im Falle der Nichtabnahme, aus
                  welchen Gründen auch immer, kann der Verkäufer von seinen gesetzlichen Rechten Gebrauch machen. Verlangt
                  der Verkäufer Schadensersatz, so beträgt
                  dieser 500,-€ bei einem Kaufpreis bis 5.000,-€ und 10% des Kaufpreises ab einem Kaufpreis über 5.000,-€.
                  <br>Bis zur Vollständigen Bezahlung bleibt der Kaufgegenstand Eigentum des Verkäufers.
                  <br> <br>  
                  <div style="text-decoration: underline">Gewährleistungsansprüche sind nicht an Dritte übertragbar.</div>
                   
                    Gerichtsstand ist Firmensitz oder Wohnort des Verkäufers.
                  <br><br>  Der Käufer akzeptiert mit seiner Unterschrift die Allgemeinen Geschäftsbedingungen der Drivezy Mix
                  Automobile und bestätigt seine Kenntnisnahme
  
              </p>
          </div>
          
                     <h3 style="margin-top: 10px">Zahlungsweise</h3>
                     <div class="checkbox-row" style="display: flex;justify-content: space-between;font-size: 14px">
                        `
                     if(paymentMethod === 'bar'){
                      htmlContent = htmlContent + ` <label class="custom-checkbox" style="width: 9%;margin-left: 0">
                      <input type="checkbox" checked/>
                      <span class="checkmark"> </span>
                      Bar
                  </label>`
                     }else{
                      htmlContent = htmlContent + ` <label class="custom-checkbox" style="width: 9%;margin-left: 0">
                      <input type="checkbox" />
                      <span class="checkmark"> </span>
                      Bar
                  </label>`
                     }
                  
                     if(paymentMethod === 'iban'){
                      htmlContent = htmlContent + `  <label class="custom-checkbox" style="width: 93%;margin-left: 0">
                      <input type="checkbox" checked/>
                      <span class="checkmark"> </span>
                      Überweisung Atesh Kerimov, IBAN: DE48 2505 0180 0910 3961 32 (Sparkasse Hannover)
                  </label>`
                     }else{
                      htmlContent = htmlContent + `  <label class="custom-checkbox" style="width: 93%;margin-left: 0">
                      <input type="checkbox" />
                      <span class="checkmark"> </span>
                      Überweisung Atesh Kerimov, IBAN: DE48 2505 0180 0910 3961 32 (Sparkasse Hannover)
                  </label> 

                    `
                     }
                        htmlContent = htmlContent + `                  
                        </div>
                        <div class="checkbox-row" style=" display: flex;justify-content: space-between;font-size: 14px">
            `
                     if(paymentMethod === 'diffTax'){
                      htmlContent = htmlContent + ` <label class="custom-checkbox" style="width: 40%;margin-left:0">

                      <input type="checkbox" checked/>
                      <span class="checkmark"> </span>
                      Differenzbesteuerung nach § 25a
                  </label>`
                     }else{
                      htmlContent = htmlContent + ` <label class="custom-checkbox" style="width: 40%;margin-left: 0">

                      <input type="checkbox" />
                      <span class="checkmark"> </span>
                      Differenzbesteuerung nach § 25a
                  </label>`
                     }
                    
              htmlContent = htmlContent + `</div>
              <div>
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
                    <p style="display: inline-flex;width: 47%"> <span class="h2">Gesamtpreis Brutto:</span><span style="text-align: center">${' ' + formatter.format(gesamtpreis) + ' '} </span></p>
                    <p style="display: inline-flex;width: 30%"> <span class="h2">Netto:</span><span style="text-align: center">${' '+ formatter.format(netto )+' '} </span></p>
                    <p style="display: inline-flex;width: 23%"> <span class="h2">19% MwSt:</span><span style="text-align: center">&nbsp;&nbsp; ${' '+ formatter.format( mwst )+' '}&nbsp;&nbsp; </span></p>
        
                </div>
                    `
                  }
                  else{
                     gesamtpreis = parseFloat( price)
                   htmlContent = htmlContent + `
                   
                   <div class="invoice-info-box" style="width: auto;text-align: left;display: flex;justify-content: space-between">
                   <p style="display: inline-flex;width: 47%"> <span class="h2">Gesamtpreis Brutto:</span><span style="text-align: center">${' ' + formatter.format( gesamtpreis) + ' '} </span></p>
                   <p style="display: inline-flex;width: 30%"> <span class="h2">Netto:</span><span style="text-align: center">  </span></p>
                   <p style="display: inline-flex;width: 23%"> <span class="h2">19% MwSt:</span><span style="text-align: center"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
       
               </div>
                   `
                  }
                 const textNumber = this.numberToWord(gesamtpreis)
                 htmlContent = htmlContent +` 
                 <div class="invoice-info-box" style="width: auto;text-align: left">
                 <p style="display: inline-flex;width: 100%"><span class="h2">in Worten:</span> <span class="worten">${' '+ textNumber +' '} </span></p>`;
          if(priceDeposit !== undefined && priceDeposit !== null) {
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
                 <p style="display: inline-flex;width: 100%"> <span class="h2">Datum, Ort:</span><span class="datum"> ${' '+ dateOnly + '  ' + baseInfo.shopOwnerCity} </span></p>
    
     
     
             </div>
              
             <div class="invoice-info-section sign">
                 <div class="invoice-info-box" style="border-top: 2px solid #333;margin-top: 20px">
                     <p>Unterschrift des Käufers</p>
                 </div>
                 <div class="invoice-info-box" style="border-top: 2px solid #333;margin-top: 20px">
                     <p>Unterschrift des Verkäufers</p>
                 </div>
            </div>
     </div>`
          htmlContent = htmlContent + `
            <div style="page-break-before: always;font-weight: 400;font-size: 10pt; width: 210mm;height: 297mm;background-position-x: left ;background-image: url('${process.env.SERVICEPATH}public/Kaufvertrag-page2.png');background-repeat: no-repeat;background-size: cover;position: relative;" >
               &nbsp; 
              </div>
          `

        if(buyWithNoWarrantyGuaranty === false && noReturn === false && salesTakePlace === false){


        htmlContent = htmlContent + `

               <div style="page-break-before: always;font-weight: 400;font-size: 10pt;width: 210mm;height: 297mm;background-position-x: left ;background-image: url('${process.env.SERVICEPATH}public/Kaufvertrag-page-doc.png');background-repeat: no-repeat;background-size: cover;position: relative;" >
                <span  style="position: absolute; top: 40mm; left: 96mm;">${buyerDetails.name+" "+buyerDetails.family}</span>
                <span  style="position: absolute; top: 52mm; left: 96mm;">${buyerDetails.address}</span>
                <span  style="position: absolute; top: 52mm; left: 155mm;">${buyerDetails.city+", "+buyerDetails.zipCode }</span>
                <span  style="position: absolute; top: 64mm; left: 96mm;">${buyerDetails.contactInfo}</span>
                <span  style="position: absolute; top: 64mm; left: 146mm;">${buyerDetails.email}</span>      
                <span  style="position: absolute; top: 280mm; left: 22mm;">${baseInfo.shopOwnerCity}, ${ moment(new Date(deal.createdAt)).format('DD.MM.YYYY')}</span>
            </div>
             <div style="page-break-before: always;font-weight: 400;font-size: 10pt;width: 210mm;height: 297mm;background-position-x: left ;background-image: url('${process.env.SERVICEPATH}public/Kauf2.png');background-repeat: no-repeat;background-size: cover;position: relative;" >
                <span  style="position: absolute; top: 12mm; left: 152mm;">${ moment(new Date(deal.createdAt)).format('DD.MM.YYYY')}</span>
                <span  style="position: absolute; top: 38mm; left: 96mm;">${buyerDetails.name+" "+buyerDetails.family}</span>
                <span  style="position: absolute; top: 50mm; left: 96mm;">${buyerDetails.address}</span>
                <span  style="position: absolute; top: 50mm; left: 159mm;">${buyerDetails.city+", "+buyerDetails.zipCode }</span>
                <span  style="position: absolute; top: 62mm; left: 96mm;">${buyerDetails.contactInfo}</span>
                <span  style="position: absolute; top: 62mm; left: 152mm;">${buyerDetails.email}</span>
                <span  style="position: absolute; top: 78mm; left: 20mm;">${carDetails.brand+" "+carDetails.model+" "+carDetails.color+" <br>Fahrgestell nummer: "+carDetails.bodyNo}</span>
                <span  style="position: absolute; top: 175mm; left: 22mm;">${baseInfo.shopOwnerCity}, ${ moment(new Date(deal.createdAt)).format('DD.MM.YYYY')}</span>
                <span  style="position: absolute; top: 241mm; left: 22mm;">${baseInfo.shopOwnerCity}, ${ moment(new Date(deal.createdAt)).format('DD.MM.YYYY')}</span>
                <span  style="position: absolute; top: 282mm; left: 22mm;">${baseInfo.shopOwnerCity}, ${ moment(new Date(deal.createdAt)).format('DD.MM.YYYY')}</span>
            </div>`

        }
        htmlContent = htmlContent + `</body></html>`






      await page.setContent(htmlContent, {waitUntil: 'networkidle0'});

      const publicDir = path.join(__dirname, '../../../..', 'public/invoices/');

      // Ensure the public directory exists
      if (!fs.existsSync(publicDir)) {
          //console.log("dir not exists : " + publicDir);
          fs.mkdirSync(publicDir, {recursive: true});
      }
      const currentFileName = path.basename(`${deal._id}.pdf`);
      const htmlFileName = currentFileName.replace('.pdf', '.html');
      const filePath = path.join(publicDir, htmlFileName);
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
      await this.model.PurchaseWithWarranty.findByIdAndUpdate(deal._id, 
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
};
