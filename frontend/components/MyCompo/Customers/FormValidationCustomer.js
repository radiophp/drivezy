const FormValidationCustomer = (data ,selectedCountry,selectedState , t) => {
    const errors = {};
    const requiredFields = ['name', 'family', /*'nationalCode',*/ 'contactInfo'/*, 'email'*/, 'address', 'gender', 'zipcode'];

    requiredFields.forEach(field => {
        if (!data.get(field)) {
            errors[field] = `${ field.charAt(0).toUpperCase() + field.slice(1) +t('act.is_required')}`;
        }
    });

    // Validate email format

    if(data.get('email') && !/\S+@\S+\.\S+/.test(data.get('email'))) {
        errors.email = t('act.email_must_be_a_valid_email_address');
    }





    if (data.get('nationalCode') && !/^[a-zA-Z0-9]+$/.test(data.get('nationalCode'))) {
        errors.nationalCode = t('act.national_code_must_be_a_valid_national_code');
    }

    // Validate name and family are alphabetic
    if (data.get('name') && !/^[A-Za-z ]+$/.test(data.get('name'))) {
        errors.name = t('act.name_must_contain_only_letters');
    }

    if (data.get('family') && !/^[A-Za-z ]+$/.test(data.get('family'))) {
        errors.family = t('act.family_must_contain_only_letters');
    }

    if(!selectedCountry  ){
        errors.country = t('act.country_is_required');
    }
    if(!selectedState  ){

        errors.state = t('act.state_is_required');
    }
    if (data.get('zipcode') && !/^[a-zA-Z0-9]+$/.test(data.get('zipcode'))) {
        errors.zipcode = t('act.zipcode_must_be_a_valid_zipcode');
    }

    console.log(errors)
    return errors;
};

export default FormValidationCustomer;
