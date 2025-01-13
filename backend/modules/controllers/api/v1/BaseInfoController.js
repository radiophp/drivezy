const Controller = require('../Controller')

module.exports = new class BrandController extends Controller{

    async create (req, res){
        try {
            const { address, eoriNumber, nettoStaticText, ownerInfo, taxOffice_St, taxOffice_Ust, 
                IBAN, BIC, mwstStaticText, dfzStaticText, shopOwnerCity, comissionAgreementStaticText,shopOwnerCountry, zipCode, storeName, plateNumber, street
              ,invoiceNumberPrefix, invoiceNumber } = req.body;
            const baseInfo = await this.model.BaseInfo.create({ address, eoriNumber, nettoStaticText, ownerInfo,
            taxOffice_St, taxOffice_Ust, IBAN, BIC, mwstStaticText, dfzStaticText, shopOwnerCity,shopOwnerCountry,
             comissionAgreementStaticText, zipCode, storeName, plateNumber, street, invoiceNumberPrefix, invoiceNumber });

            await this.model.Logs.create({
                userId: req.user._id, 
                activity: 'create',
                modelName: 'BaseInfo',
                modelId: baseInfo._id,
              });
        
            res.status(201).json({ success: true, data: baseInfo });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

    async getAll (req, res){
        try {
            const baseInfo = await this.model.BaseInfo.findOne();
        
            res.status(200).json({ success: true, data: baseInfo });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

    async update(req, res){
        try {
            const { address,shopOwnerCountry, eoriNumber, nettoStaticText, ownerInfo, taxOffice_St, taxOffice_Ust, 
                IBAN, BIC, mwstStaticText, dfzStaticText, shopOwnerCity, comissionAgreementStaticText, 
                zipCode, storeName, plateNumber, street, invoiceNumberPrefix, invoiceNumber } = req.body;
        
            const baseInfo = await this.model.BaseInfo.findByIdAndUpdate(
              req.params.id,
              { address, eoriNumber, nettoStaticText, ownerInfo,
                taxOffice_St,shopOwnerCountry, taxOffice_Ust, IBAN, BIC, mwstStaticText,shopOwnerCity, dfzStaticText, 
                comissionAgreementStaticText, zipCode, storeName, plateNumber, street, invoiceNumberPrefix, invoiceNumber },
              { new: true, runValidators: true }
            );
        
            if (!baseInfo) {
              return res.status(404).json({ success: false, message: 'brand not found' });
            }

            await this.model.Logs.create({
                userId: req.user._id, // Assuming you have the current user's ID available
                activity: 'update',
                modelName: 'BaseInfo',
                modelId: baseInfo._id,
              });
        
            res.status(200).json({ success: true, data: baseInfo });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

}