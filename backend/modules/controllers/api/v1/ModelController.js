const Controller = require('../Controller')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const fs = require('fs');
const path = require('path');

module.exports = new class ModelController extends Controller{

    async create (req, res){
        try {
            const { name, brand } = req.body;
            const brand_obj = await this.model.Brand.findById(brand)
            console.log('BRAND : ', brand_obj)
            const brand_id = brand_obj._id
            const model = await this.model.Model.create({ name, brand_id, brand });
            await this.model.Model.findByIdAndUpdate(model._id, {id : model._id})

            await this.model.Logs.create({
                userId: req.user._id, 
                activity: 'create',
                modelName: 'Model',
                modelId: model._id,
              });
        
            res.status(201).json({ success: true, data: model });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

    async findById(modelId){
      return await this.model.Model.findById(modelId)
    }

    async getAll (req, res){
        try {
            const models = await this.model.Model.find();
        
            res.status(200).json({ success: true, data: models });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

    async getById (req, res){
        try {
            const model = await this.model.Model.findById(req.params.id);
        
            if (!model) {
              return res.status(404).json({ success: false, message: 'model not found' });
            }
        
            res.status(200).json({ success: true, data: model });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

    async import(req, res){
      const filePath = path.join(__dirname, 'models.json');

  // Read the content of the brand.json file
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    try {
      // Parse the JSON data
      const brands = JSON.parse(data);

      // Loop through each brand record
      brands.forEach((brand) => {
        // Perform your desired action here
        // For example, log the brand name
        console.log(brand);
         this.model.Model.create({id: brand.id, name: brand.name, brand_id : brand.brand_id })
      });

      console.log('Data processing completed!');
    } catch (error) {
      console.error('Error parsing the JSON data:', error);
    }
  });
    }


    async getByBrand (req, res){
      try{
        const brand = await this.model.Brand.findById(req.params.brand)
        const brand_id = brand.id.toString()
        const models = await this.model.Model.find({brand_id : parseInt(brand_id)})

        if (!models) {
          return res.status(404).json({ success: false, message: 'models not found' });
        }
    
        res.status(200).json({ success: true, data: models });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
      }

    async update(req, res){
        try {
            const { name } = req.body;
        
            const model = await this.model.Model.findByIdAndUpdate(
              req.params.id,
              { name },
              { new: true, runValidators: true }
            );
        
            if (!model) {
              return res.status(404).json({ success: false, message: 'model not found' });
            }

            await this.model.Logs.create({
                userId: req.user._id, // Assuming you have the current user's ID available
                activity: 'update',
                modelName: 'Model',
                modelId: model._id,
              });
        
            res.status(200).json({ success: true, data: model });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

   async delete (req, res){
        try {
            const model = await this.model.Model.findByIdAndDelete(req.params.id);
        
            if (!model) {
              return res.status(404).json({ success: false, message: 'model not found' });
            }

            await this.model.Logs.create({ 
                userId: req.user._id, // Assuming you have the current user's ID available
                activity: 'delete',
                modelName: 'Model',
                modelId: model._id,
              });
        
            res.status(200).json({ success: true, data: {} });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

}