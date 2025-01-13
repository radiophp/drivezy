//Models
const User = require('../../models/User')
const Color = require('../../models/Color')
const Logs = require('../../models/Logs')
const Brand = require('../../models/Brand')
const Customer = require('../../models/Customer')
const Car = require('../../models/Car')
const Model = require('../../models/Model')
const Deal = require('../../models/Deal')
const BaseInfo = require('../../models/BaseInfo')
const NettoInvoice = require('../../models/NettoInvoice')
const DfzInvoice = require('../../models/DfzInvoice')
const MwstInvoice = require('../../models/MwstInvoice')
const ComissionAgreement = require('../../models/ComissionAgreement')
const PurchaseWithWarranty = require('../../models/PurchaseWithWarranty')
const InvoiceLog = require('../../models/InvoiceLog')
const Temp = require('../../models/Temp')


module.exports = class Controller{
    constructor(){
        this.model = { User, 
                       Color, 
                       Logs, 
                       Brand, 
                       Customer, 
                       Car, 
                       Model, 
                       Deal, 
                       BaseInfo, 
                       NettoInvoice, 
                       DfzInvoice, 
                       MwstInvoice,
                       ComissionAgreement,
                       PurchaseWithWarranty,
                       InvoiceLog,
                       Temp
                    }
        this.userTypes = [ 'Admin']
       
    }

    showValidationErrors(req, res){
        let errors = req.validationErrors()
        if(errors){
            res.status(422).json({
            message: errors.map(error => {
                return {
                    'field' : error.param,
                    'message' : error.msg
                }
            }),
            success : false
        })
        return true
        }
        return false
    }

    escapeAndTrim(req, items){
        items.split(' ').forEach(item => {
            req.sanitize(item).escape()
            req.sanitize(item).trim()

        })
    }
}



