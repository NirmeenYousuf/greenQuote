import Joi from 'joi';

export const quoteSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  address: Joi.string().required(),
  monthlyConsumptionKwh: Joi.number().positive().required(),
  systemSizeKw: Joi.number().positive().required(),
  downPayment: Joi.number().allow(null, '')
});
