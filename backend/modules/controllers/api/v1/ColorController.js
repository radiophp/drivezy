const Controller = require('../Controller')

module.exports = new class ColorController extends Controller{

    async create (req, res){
        try {
            const { name } = req.body;
            const color = await this.model.Color.create({ name });

            await this.model.Logs.create({
                userId: req.user._id, 
                activity: 'create',
                modelName: 'Color',
                modelId: color._id,
              });
        
            res.status(201).json({ success: true, data: color });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

    async findById(colorId){
      return await this.model.Color.findById(colorId)
    }

    async getAll (req, res){
        try {
            const colors = await this.model.Color.find();
        
            res.status(200).json({ success: true, data: colors });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

    async getById (req, res){
        try {
            const color = await this.model.Color.findById(req.params.id);
        
            if (!color) {
              return res.status(404).json({ success: false, message: 'Color not found' });
            }
        
            res.status(200).json({ success: true, data: color });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

    async update(req, res){
        try {
            const { name } = req.body;
        
            const color = await this.model.Color.findByIdAndUpdate(
              req.params.id,
              { name },
              { new: true, runValidators: true }
            );
        
            if (!color) {
              return res.status(404).json({ success: false, message: 'Color not found' });
            }

            await this.model.Logs.create({
                userId: req.user._id, // Assuming you have the current user's ID available
                activity: 'update',
                modelName: 'Color',
                modelId: color._id,
              });
        
            res.status(200).json({ success: true, data: color });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

   async delete (req, res){
        try {
            const color = await this.model.Color.findByIdAndDelete(req.params.id);
        
            if (!color) {
              return res.status(404).json({ success: false, message: 'Color not found' });
            }

            await this.model.Logs.create({ 
                userId: req.user._id, // Assuming you have the current user's ID available
                activity: 'delete',
                modelName: 'Color',
                modelId: color._id,
              });
        
            res.status(200).json({ success: true, data: {} });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

}