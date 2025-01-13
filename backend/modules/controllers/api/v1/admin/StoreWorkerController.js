const Controller = require('../../Controller')
module.exports = new class StoreWorkerController extends Controller {
    index (req , res) {
        this.model.StoreWorker.find({} , (err, storeWorkers)=>{
            if(err) throw err
            if(storeWorkers){
                return res.json(storeWorkers)
            }
        })
    }

    async single(req, res) {
        const { id } = req.params
      
        if (!id) {
          return res.status(400).json({
            success: false,
            data: 'invalid storeWorker id',
          })
        }
      
        try {
          const storeWorker = await this.model.StoreWorker.findById(id)
      
          if (!storeWorker) {
            return res.status(404).json({
              success: false,
              data: 'storeWorker not found',
            })
          }
      
          return res.json({
            success: true,
            data: storeWorker,
          })
        } catch (error) {
          return res.status(500).json({
            success: false,
            data: 'error in retrieving storeWorker',
          })
        }
      }
}