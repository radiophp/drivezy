const Controller = require('../../Controller')
module.exports = new class StoreController extends Controller {
    index (req , res) {
        this.model.Store.find({} , (err, stores)=>{
            if(err) throw err
            if(stores){
                return res.json(stores)
            }
        })
    }

    async single(req, res) {
        const { id } = req.params
      
        if (!id) {
          return res.status(400).json({
            success: false,
            data: 'invalid store id',
          })
        }
      
        try {
          const store = await this.model.Store.findById(id)
      
          if (!store) {
            return res.status(404).json({
              success: false,
              data: 'store not found',
            })
          }
      
          return res.json({
            success: true,
            data: store,
          })
        } catch (error) {
          return res.status(500).json({
            success: false,
            data: 'error in retrieving store',
          })
        }
      }
      

   async getByGuild(req, res) {
  const { guild } = req.params
  if (!guild) {
    return res.status(400).json({
      success: false,
      data: 'invalid guild id',
    })
  }

  try {
    const stores = await this.model.Store.find({ guild })

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        data: 'stores not found',
      })
    }

    return res.json({
      success: true,
      data: stores,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: 'error in retrieving stores',
    })
  }
}

}