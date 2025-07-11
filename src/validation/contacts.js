import Joi from 'joi';
import { typeList } from '../constants/contacts.js';
export const contactAddSchema = Joi.object({
  name: Joi.string().required().min(3).max(20).messages({
    "any.required": "you must type a name"
  }),
  phoneNumber: Joi.string().required(),
  email: Joi.string().required(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...typeList),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  phoneNumber: Joi.string(),
  email: Joi.string(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...typeList),
});