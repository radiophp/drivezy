const validateCarForm = (t,data,brandId, modelId, colorId, firstRegistration,huauDate,tires, tiresType, rims, rimsSize) => {
    const errors = {};
    const requiredFields = [  'bodyNo', /*'engineNo',*/ 'mileage',/* 'year',*/ 'fuelType' /* , 'plateNo'*/ /*,'description' , */,'registeredDocumentNo' , /*'accidentalDamageDescription'*/];

    requiredFields.forEach(field => {
        if (!data.get(field)) {
            errors[field] = `${ /*field.charAt(0).toUpperCase() + field.slice(1) +*/ t('cars.validate_is_required')}`;
        }
    });

    if (!brandId) {
        errors.brand = t('cars.validate_brand');
    }

    if (!modelId) {
        errors.model = t('cars.validate_model');
    }

    // if (!colorId) {
    //     errors.color = "Color is required";
    // }
    if(!firstRegistration) {
        errors.firstRegistration = t('cars.validate_first_registration')
    }

    if(!huauDate) {

        errors.huauDate = t('cars.validate_huau_date')
    }

    if(!data.get('accidentalDamage'))
    {
        errors.accidentalDamage = t('cars.validate_accidental_damage')
    }
    return errors;
};

export default validateCarForm;
