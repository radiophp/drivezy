const Controller = require('../../Controller')
module.exports = new class CustomerController extends Controller {
    index (req , res) {
        this.model.Customer.find({} , (err, customers)=>{
            if(err) throw err
            if(customers){
                return res.json(customers)
            }
        })
    }

    async single(req, res) {
        const { id } = req.params
      
        if (!id) {
          return res.status(400).json({
            success: false,
            data: 'invalid customers id',
          })
        }
      
        try {
          const customers = await this.model.Customer.findById(id)
      
          if (!customers) {
            return res.status(404).json({
              success: false,
              data: 'customers not found',
            })
          }
      
          return res.json({
            success: true,
            data: customers,
          })
        } catch (error) {
          return res.status(500).json({
            success: false,
            data: 'error in retrieving customers',
          })
        }
      }
}