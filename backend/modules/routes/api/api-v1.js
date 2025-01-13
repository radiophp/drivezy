const express = require('express')
const router = express.Router()
const { json } = require('body-parser')

//Controllers
const homeController = require('../../controllers/api/v1/HomeController')
const AuthController = require('../../controllers/api/v1/AuthController')
const ColorController = require('../../controllers/api/v1/ColorController')
const BrandController = require('../../controllers/api/v1/BrandController')
const CustomerController = require('../../controllers/api/v1/CustomerController')
const ModelController = require('../../controllers/api/v1/ModelController')
const CarController = require('../../controllers/api/v1/CarController')
const DealController = require('../../controllers/api/v1/DealController') 
const BaseInfoController = require('../../controllers/api/v1/BaseInfoController')
const NettoInvoiceController = require('../../controllers/api/v1/NettoInvoiceController')
const DfzInvoiceController = require('../../controllers/api/v1/DfzInvoiceController')
const MwstInvoiceController = require('../../controllers/api/v1/MwstInvoiceController')
const ComissionAgreement = require('../../controllers/api/v1/CommisionAgreementController')
const PurchaseWithWarrantyController = require('../../controllers/api/v1/PurchaseWithWarranty')
const CityController = require('../../controllers/api/v1/CityController')
const TempController = require('../../controllers/api/v1/TempController')


//middlewares

const UserAuthMiddleWare = require('./middleWare/UserAuthMiddleWare')
const SuperUserAuthMiddleWare = require('./middleWare/SuperUserAuthMiddleWare')
const {uploadArrayFile} = require('./middleWare/uploadMiddleWare')

// general routes
router.get('/' , homeController.index)
router.get('/ping', homeController.ping.bind(homeController))

//user routes
router.post('/register' , AuthController.register.bind(AuthController))
router.post('/login' , AuthController.login.bind(AuthController))
//router.get('/user', userController.index.bind(userController))

//color routes
router.post('/color', UserAuthMiddleWare, ColorController.create.bind(ColorController))
router.get('/colors', UserAuthMiddleWare, ColorController.getAll.bind(ColorController))
router.get('/color/:id', UserAuthMiddleWare, ColorController.getById.bind(ColorController))
router.put('/color/:id', UserAuthMiddleWare, ColorController.update.bind(ColorController))
router.delete('/color/:id', UserAuthMiddleWare, ColorController.delete.bind(ColorController))

//brand routes
router.post('/brand', UserAuthMiddleWare, BrandController.create.bind(BrandController))
router.get('/brands', UserAuthMiddleWare, BrandController.getAll.bind(BrandController))
router.get('/brand/:id', UserAuthMiddleWare, BrandController.getById.bind(BrandController))
router.put('/brand/:id', UserAuthMiddleWare, BrandController.update.bind(BrandController))
router.delete('/brand/:id', UserAuthMiddleWare, BrandController.delete.bind(BrandController))
router.post('/brand/import', BrandController.import.bind(BrandController))

//model routes
router.post('/model', UserAuthMiddleWare, ModelController.create.bind(ModelController))
router.get('/models', UserAuthMiddleWare, ModelController.getAll.bind(ModelController))
router.get('/model/:id', UserAuthMiddleWare, ModelController.getById.bind(ModelController))
router.put('/model/:id', UserAuthMiddleWare, ModelController.update.bind(ModelController))
router.delete('/model/:id', UserAuthMiddleWare, ModelController.delete.bind(ModelController))
router.get('/model/brand/:brand', UserAuthMiddleWare, ModelController.getByBrand.bind(ModelController))
router.post('/model/import', ModelController.import.bind(ModelController))

//customer routes
router.post('/customer', UserAuthMiddleWare, CustomerController.create.bind(CustomerController))
router.get('/customers', UserAuthMiddleWare, CustomerController.getAll.bind(CustomerController))
router.get('/customer/:id', UserAuthMiddleWare, CustomerController.getById.bind(CustomerController))
router.put('/customer/:id', UserAuthMiddleWare, CustomerController.update.bind(CustomerController))
router.delete('/customer/:id', UserAuthMiddleWare, CustomerController.delete.bind(CustomerController))
router.post('/customer/search', UserAuthMiddleWare, CustomerController.searchCustomers.bind(CustomerController))

//car routes
router.post('/car-image' , UserAuthMiddleWare , uploadArrayFile.array('images', 10), CarController.setImage.bind(CarController)) 
router.post('/car-buyDocuments' , UserAuthMiddleWare , uploadArrayFile.array('files', 10), CarController.setFiles.bind(CarController)) 
router.get('/cars', UserAuthMiddleWare, CarController.getAll.bind(CarController))
router.post('/car/search', UserAuthMiddleWare, CarController.search.bind(CarController))
router.get('/cars/available', UserAuthMiddleWare, CarController.getAvailableCars.bind(CarController))
router.post('/car', UserAuthMiddleWare, CarController.create.bind(CarController))
router.delete('/car/image', UserAuthMiddleWare, CarController.deleteImage.bind(CarController))
router.post('/car/import', UserAuthMiddleWare, CarController.import.bind(CarController))
router.get('/cars/invoices/', UserAuthMiddleWare, CarController.getConnectedInvoices.bind(CarController))
router.get('/cars/comissionInvoices', UserAuthMiddleWare, CarController.getConnectedToComissionInvoices.bind(CarController))
router.get('/car/:id', UserAuthMiddleWare, CarController.getById.bind(CarController))
router.put('/car/:id', UserAuthMiddleWare, CarController.update.bind(CarController))
router.delete('/car/:id', UserAuthMiddleWare, CarController.delete.bind(CarController))


//baseinfo routes
router.post('/baseInfo', UserAuthMiddleWare, BaseInfoController.create.bind(BaseInfoController))
router.get('/baseInfo', UserAuthMiddleWare, BaseInfoController.getAll.bind(BaseInfoController))
router.put('/baseInfo/:id', UserAuthMiddleWare, BaseInfoController.update.bind(BaseInfoController))

//invoice routes
router.post('/invoice/netto', UserAuthMiddleWare, NettoInvoiceController.create.bind(NettoInvoiceController))
router.post('/invoice/dfz', UserAuthMiddleWare, DfzInvoiceController.create.bind(DfzInvoiceController))
router.post('/invoice/mwst', UserAuthMiddleWare, MwstInvoiceController.create.bind(MwstInvoiceController))
router.post('/invoice/comissionAgreement', UserAuthMiddleWare, ComissionAgreement.create.bind(ComissionAgreement))
router.post('/invoice/purchaseWithWarranty', UserAuthMiddleWare, PurchaseWithWarrantyController.create.bind(PurchaseWithWarrantyController))
router.get('/invoice/comissionAgreement', UserAuthMiddleWare, ComissionAgreement.getAll.bind(ComissionAgreement))
router.get('/invoice/dfz', UserAuthMiddleWare, DfzInvoiceController.getAll.bind(DfzInvoiceController))
router.get('/invoice/mwst', UserAuthMiddleWare, MwstInvoiceController.getAll.bind(MwstInvoiceController))
router.get('/invoice/netto', UserAuthMiddleWare, NettoInvoiceController.getAll.bind(NettoInvoiceController))
router.get('/invoice/purchaseWithWarranty', UserAuthMiddleWare, PurchaseWithWarrantyController.getAll.bind(PurchaseWithWarrantyController))
router.post('/invoice/wharehouse', UserAuthMiddleWare, CarController.getWareHouseInvoice.bind(CarController))
router.post('/invoice/dynamic', UserAuthMiddleWare, CarController.getDynamicWareHouseInvoice.bind(CarController))
router.delete('/invoice/comissionAgreement/:id', UserAuthMiddleWare, ComissionAgreement.cancelInvoice.bind(ComissionAgreement))
router.delete('/invoice/dfz/:id', UserAuthMiddleWare, DfzInvoiceController.cancelInvoice.bind(DfzInvoiceController))
router.delete('/invoice/mwst/:id', UserAuthMiddleWare, MwstInvoiceController.cancelInvoice.bind(MwstInvoiceController))
router.delete('/invoice/netto/:id', UserAuthMiddleWare, NettoInvoiceController.cancelInvoice.bind(NettoInvoiceController))
router.delete('/invoice/purchaseWithWarranty/:id', UserAuthMiddleWare, PurchaseWithWarrantyController.cancelInvoice.bind(PurchaseWithWarrantyController))

//city controller
router.get('/city/allCountries', UserAuthMiddleWare, CityController.getAllCountries.bind(CityController))
router.get('/city/state/:country', UserAuthMiddleWare, CityController.getStatesOfCountry.bind(CityController))
router.get('/city/:country', UserAuthMiddleWare, CityController.getCitiesOfCountry.bind(CityController))
//deal routes
router.post('/deal', UserAuthMiddleWare, DealController.create.bind(DealController))

const adminRouter = express.Router()


router.use('/admin', adminRouter)

module.exports = router
