const Controller = require('../Controller')

module.exports = new class CustomerController extends Controller{

    async create (req, res){
      try {
        const { name, family, nationalCode, contactInfo, address,email,  country, city, gender, zipCode,
          company, companyName, taxNumber } = req.body;
    
        const customer = await this.model.Customer.create({gender,email, zipCode, name, family, nationalCode, contactInfo, address, country, city,
          company, companyName, taxNumber });
    
        // Log user activity
        await this.model.Logs.create({
          userId: req.user._id, // Assuming you have the current user's ID available
          activity: 'create',
          modelName: 'Customer',
          modelId: customer._id,
        });
    
        res.status(201).json({ success: true, data: customer });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    }

    async getAll (req, res){
      try {
        const customers = await this.model.Customer.find().sort({ createdAt: -1 })
    
        res.status(200).json({ success: true, data: customers });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    }

    async getById (req, res){
      try {
        const customer = await this.model.Customer.findById(req.params.id);
    
        if (!customer) {
          return res.status(404).json({ success: false, message: 'Customer not found' });
        }
    
        res.status(200).json({ success: true, data: customer });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    }

    async getDetailsById (customerId){
      try{
        const customer = await this.model.Customer.findById(customerId)
        return ({
          success : true,
          data : customer
        })
      } catch(err){
        return ({
          success : false,
          message : err
        })
      }
    }

    async searchCustomers(req, res) {
      try {
        const searchQuery = req.query.q;
  
        // Search for customers based on the search query
        const customers = await this.model.Customer.find({
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { family: { $regex: searchQuery, $options: 'i' } },
            { nationalCode: { $regex: searchQuery, $options: 'i' } },
            { contactInfo: { $regex: searchQuery, $options: 'i' } },
          ],
        });
  
        res.status(200).json({ success: true, data: customers });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    }

    async update(req, res){
      try {

        const { name, family, nationalCode,email, contactInfo,gender,zipCode, address, country, city,
          company, companyName, taxNumber} = req.body;

    
        const updatedCustomer = await this.model.Customer.findByIdAndUpdate(
          req.params.id,
          { name, family, nationalCode, contactInfo,email, address,gender,zipCode, country, city,
            company, companyName, taxNumber },
          { new: true }
        );
    
        if (!updatedCustomer) {
          return res.status(404).json({ success: false, message: 'Customer not found' });
        }
    
        // Log user activity
        await this.model.Logs.create({
          userId: req.user._id,
          activity: 'update',
          modelName: 'Customer',
          modelId: updatedCustomer._id,
        });
    
        res.status(200).json({ success: true, data: updatedCustomer });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    }

   async delete (req, res){
    try {
      const deletedCustomer = await this.model.Customer.findByIdAndDelete(req.params.id);
  
      if (!deletedCustomer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
  
      // Log user activity
      await this.model.Logs.create({
        userId: req.user._id,
        activity: 'delete',
        modelName: 'Customer',
        modelId: deletedCustomer._id,
      });
  
      res.status(200).json({ success: true, data: {} });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
    }

}
