const Controller = require('../../Controller')

module.exports = new class StoreController extends Controller {
    async store(req, res) {
        const { guild } = req.body;
        req.checkBody('guild', 'guild id is mandatory').notEmpty();
        this.escapeAndTrim(req, 'guild');
      
        if (this.showValidationErrors(req, res)) {
          return;
        }
      
        try {
          const result = await this.model.Guild.findOne({ name: guild });
      
          if (result) {
            return res.status(400).json({
              success: false,
              data: 'already exists'
            });
          }
      
          const newGuild = new this.model.Guild({ name: guild });
          await newGuild.save();
      
          return res.status(200).json({
            success: true,
            data: newGuild
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            data: error
          });
        }
      }

      async getAll(req, res) {
        try {
          const results = await this.model.Guild.find({}).lean();
      
          return res.status(200).json({
            success: true,
            data: results
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: error
          });
        }
      }
      
      
}