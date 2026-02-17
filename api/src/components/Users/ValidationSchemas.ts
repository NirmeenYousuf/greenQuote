import Joi from 'joi';

export const loginSchema = {
  payload: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const registerSchema = {
  payload: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
