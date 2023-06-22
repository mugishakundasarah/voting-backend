const Joi = require('joi');

// Signup Validation Schema
const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    nationalId: Joi.number()
    .required('National ID is required')
    .min(1000000000000000, 'National ID must be 16 digits')
    .max(9999999999999999, 'National ID must be 16 digits'),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().strict(),
    role: Joi.string().valid('client', 'admin').default('client')
});

// Signin Validation Schema
const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const candidateValidationSchema = Joi.object({
  name: Joi.string().required(),
  gender: Joi.string().required(),
  nationalId: Joi.number()
  .required('National ID is required')
  .min(1000000000000000, 'National ID must be 16 digits')
  .max(9999999999999999, 'National ID must be 16 digits'),
  missionStatement: Joi.string().required(),
  createdAt: Joi.date().default(Date.now)
});

module.exports = {
  signupSchema,
  signinSchema,
  candidateValidationSchema
};
