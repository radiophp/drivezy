const Controller = require('../Controller')
const fs = require('fs');
const path = require('path');

module.exports = new class BrandController extends Controller{

    async create (req, res){
        try {
            const { name } = req.body;
            const brand = await this.model.Brand.create({ name });
            const id = brand._id
            await this.model.Brand.findByIdAndUpdate(id, {id})

            await this.model.Logs.create({
                userId: req.user._id, 
                activity: 'create',
                modelName: 'Brand',
                modelId: brand._id,
              });
        
            res.status(201).json({ success: true, data: brand });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

    async findById(brandId){
      return await this.model.Brand.findById(brandId)
    }

    async getAll (req, res){
        try {
            const brands = await this.model.Brand.find();
        
            res.status(200).json({ success: true, data: brands });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

    async getById (req, res){
        try {
            const brand = await this.model.Brand.findById(req.params.id);
        
            if (!brand) {
              return res.status(404).json({ success: false, message: 'brand not found' });
            }
        
            res.status(200).json({ success: true, data: brand });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

    async update(req, res){
        try {
            const { name } = req.body;
        
            const brand = await this.model.Brand.findByIdAndUpdate(
              req.params.id,
              { name },
              { new: true, runValidators: true }
            );
        
            if (!brand) {
              return res.status(404).json({ success: false, message: 'brand not found' });
            }

            await this.model.Logs.create({
                userId: req.user._id, // Assuming you have the current user's ID available
                activity: 'update',
                modelName: 'Brand',
                modelId: brand._id,
              });
        
            res.status(200).json({ success: true, data: brand });
          } catch (err) {
            res.status(500).json({ success: false, message: err.message });
          }
    }

    async import(req, res) {
      try {
        const filePath = path.join(__dirname, 'brand.json');
        const modelFilePath = path.join(__dirname, 'models.json');
    
        // Read the content of the brand.json file
        fs.readFile(filePath, 'utf-8', async (err, data) => {
          if (err) {
            console.error('Error reading the file:', err);
            return;
          }
    
          fs.readFile(modelFilePath, 'utf-8', async (err, modelData) => {
            if (err) {
              console.error('Error reading the file:', err);
              return;
            }
    
            try {
              // Parse the JSON data
              const brands = JSON.parse(data);
              const models = JSON.parse(modelData);
    
              // Loop through each brand record
              for (const brand of brands) {
                // Perform your desired action here
                // For example, log the brand name
                let importedBrand = await this.model.Brand.create({ id: brand.id, name: brand.name });
    
                // Search for models with the corresponding brand_id
                const matchingModels = models.filter((model) => model.brand_id === brand.id);
                for (const matchingModel of matchingModels){
                  let importedModel = await this.model.Model.create({id : matchingModel.id,
                     name: matchingModel.name,
                     brand_id: matchingModel.brand_id,
                  brand: importedBrand._id})
                }
              }
    
            } catch (error) {
              console.error('Error parsing the JSON data:', error);
            }
          });
        });
      } catch (error) {
        console.error('Error performing the import:', error);
      }
    }
    
   
    
    async delete(req, res) {
      try {
        const brand = await this.model.Brand.findByIdAndDelete(req.params.id);
    
        if (!brand) {
          return res.status(404).json({ success: false, message: 'Brand not found' });
        }
    
        await this.model.Logs.create({
          userId: req.user._id, // Assuming you have the current user's ID available
          activity: 'delete',
          modelName: 'Brand',
          modelId: brand._id,
        });
    
        res.status(200).json({ success: true, data: {} });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  }