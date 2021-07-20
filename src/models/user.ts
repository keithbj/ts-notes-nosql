import { Schema, model } from 'mongoose';
import { Request } from 'express';
import Joi from 'joi';

interface UserAttributes {
  name: string;
  email: string;
}

// Add user to request, making it optional '?' and postfix '!'. To resolve inference issues.
export interface UserRequest extends Request {
  user?: typeof userSchema;
}

export const userSchema = new Schema<UserAttributes>({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
  },
});

export const User = model('User', userSchema);

const userJoiSchema = Joi.object({
  name: Joi.string().min(1).max(256).required(),
  email: Joi.string().email({ minDomainSegments: 2 }),
});

export const validate = (values: any) => {
  const result = userJoiSchema.validate(values, { abortEarly: false });
  return result.error;
};
