import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { userSchema } from './user';

interface NoteAttributes {
  userId: typeof userSchema;
  attachment: string;
  content: string;
  createdAt: number;
}

const noteSchema = new Schema<NoteAttributes>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: Schema.Types.String,
    required: true,
  },
  attachment: {
    type: Schema.Types.String,
    required: false,
  },
  createdAt: {
    type: Schema.Types.Number,
    required: true,
  },
});

export const Note = model('Note', noteSchema);

const noteJoiSchema = Joi.object({
  userId: Joi.object().required(),
  content: Joi.string().min(1).max(256).required(),
  attachment: [Joi.string().min(1).max(256).optional(), Joi.allow(null)],
  createdAt: Joi.number().required(),
});

export const validate = (values: any) => {
  const result = noteJoiSchema.validate(values, { abortEarly: false });
  return result.error;
};
