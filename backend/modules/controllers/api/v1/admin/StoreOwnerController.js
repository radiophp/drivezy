const Controller = require('../../Controller')
module.exports = new class StoreOwnerController extends Controller {
    index (req , res) {
        this.model.StoreOwner.find({} , (err, storeOwners)=>{
            if(err) throw err
            if(storeOwners){
                return res.json(storeOwners)
            }
        })
    }

    async single(req, res) {
        const { id } = req.params
      
        if (!id) {
          return res.status(400).json({
            success: false,
            data: 'invalid storeOwner id',
          })
        }
      
        try {
          const storeOwner = await this.model.StoreOwner.findById(id)
      
          if (!storeOwner) {
            return res.status(404).json({
              success: false,
              data: 'storeOwner not found',
            })
          }
      
          return res.json({
            success: true,
            data: storeOwner,
          })
        } catch (error) {
          return res.status(500).json({
            success: false,
            data: 'error in retrieving storeOwner',
          })
        }
      }
}