const config = require('./modules/config')
const sgMail = require('@sendgrid/mail')
const CustomerController = require('./modules/controllers/api/v1/CustomerController')
const CarController = require('./modules/controllers/api/v1/CarController')
const ModelController = require('./modules/controllers/api/v1/ModelController')
const BrandController = require('./modules/controllers/api/v1/BrandController')
const ColorController = require('./modules/controllers/api/v1/ColorController')


module.exports.getCustomerDetails = async function(customerId){
    const customer = await CustomerController.getDetailsById(customerId)
    return customer
}

module.exports.getCarDetails = async function(carId){
        try {
          const car = await CarController.getDetailsById(carId)
    
          const [brand, model, color] = await Promise.all([
            BrandController.findById(car.brand),
            ModelController.findById(car.model),
            ColorController.findById(car.color)
          ]);

          const finalRes = {
            ...car.toObject() ,
            // bodyNo: car.bodyNo,
            // engineNo: car.engineNo,
            // mileage: car.mileage,
            // year: car.year,
            // fuelType: car.fuelType,
            // plateNo: car.plateNo,
            brand: brand !== null ? brand.name : 'noName',
            model: model !== null ? model.name : 'noName',
            color: color !== null ? color.name : 'noName',
            // registeredDocumentNo : car.registeredDocumentNo,
            // HUAU: car.HUAU,
            // firstRegistration: car.firstRegistration,
            // accidentalDamage: car.accidentalDamage,
            // buyPrice: car.buyPrice,
            // accidentalDamageDescription: car.accidentalDamageDescription
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
