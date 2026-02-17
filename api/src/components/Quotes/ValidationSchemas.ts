import Joi from 'joi';

export const createSchema = {
  payload: Joi.object({
    address: Joi.string().required(),
    monthlyConsumptionKwh: Joi.number().required(),
    systemSizeKw: Joi.number().required(),
    downPayment: Joi.number(),
  }),
};

export const readSchema = {
  params: {
    id: Joi.number().required(),
  },
};

export const fetchSchema = {
  query: Joi.object({
    name: Joi.string().allow(null, ''),
    email: Joi.string().email().allow(null, ''),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    pageNumber: Joi.number().integer().min(1).default(1),
  }),
};
