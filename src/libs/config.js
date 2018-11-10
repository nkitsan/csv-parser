const JoiBase = require('joi');
const JoiExtension = require('joi-date-extensions');
const Joi = JoiBase.extend(JoiExtension);


const userSchema = {
    firstName: Joi.string().regex(/^[a-zA-Z]+$/, 'name').required(),
    lastName: Joi.string().regex(/^[a-zA-Z]+$/, 'name').required(),
    age: Joi.number().min(1).max(99).integer().required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
              .regex(/^[\+]?(375|80)[\s]?(29|25|44|33)[\s]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})$/, 'phoneNumber')
              .required(),
    dateOfRegistration: Joi.date().format(['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYY.MM.DD', 'DD-MM-YYYY', 'DD.MM.YYYY', 'DD/MM/YYYY'])
                           .required()
};

module.exports = userSchema;