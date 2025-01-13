const Controller = require('../Controller');
const config = require('../../../config');
const helper = require('../../../../helper');
const { json } = require('body-parser');

module.exports = new class TempController extends Controller {
    constructor() {
        super(); // Call the super constructor

        const setTemp = async () => {

            let temp = await this.model.Temp.findOne({})
            if(temp === null){
                const baseInfo = await this.model.BaseInfo.findOne({})
                const invoiceNumber = baseInfo.invoiceNumberPrefix + '-' + baseInfo.invoiceNumber.toString().padStart(4, '0');
                temp = await this.model.Temp.create({
                    latestInvoiceNumber : invoiceNumber
                })
            }
        }
        setTemp();
    }

   async getInvoiceNumber (){
        const currentTemp = await this.model.Temp.findOne({})
        let invoiceNumber = currentTemp.latestInvoiceNumber
        invoiceNumber = invoiceNumber.split('-')
        const newInvoiceNumber = invoiceNumber[0] + '-' + (parseInt(invoiceNumber[1], 10) + 1).toString().padStart(4, '0')
        const updateTemp = await this.model.Temp.findByIdAndUpdate(currentTemp._id,
            {latestInvoiceNumber : newInvoiceNumber})
        return ({
            success: true,
            invoiceNumber : currentTemp.latestInvoiceNumber
        })
    }
}