import Joi from "joi";
import { emailRegex } from "../constants/users.js";

export const authRegesterSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required(),
});

export const authLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});

export const authOAutGoogleSchema = Joi.object({
code: Joi.string().required()
});