const Joi = require('joi');

const userSchema = {
    firstName: Joi.string().regex(/^(\w+)$/, 'name').required(),
    lastName: Joi.string().regex(/^(\w+)$/, 'name').required(),
    age: Joi.number().min(1).max(99).integer().required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
              .regex(/^[\+]?(375|80)[\s]?(29|25|44|33)[\s]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})$/, 'phoneNumber')
              .required(),
    dateOfRegistration: Joi.date().required()
};

module.exports = userSchema;