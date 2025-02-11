/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import Joi from 'joi';
import { joiResolver } from 'mantine-form-joi-resolver';
export type UserInput = {
  id?: number | null;
  createdAt?: string;
  username: string;
};

export type User = {
  id?: number | null;
  createdAt?: string;
  updatedAt?: string;
  username?: string;
  displayName?: string | null;
  image?: string;
  avatar?: { sm?: string | null; md?: string | null; lg?: string | null };
  email?: string;
  isLoggedIn?: boolean;
};

export type UserLogin = {
  email: string;
  password: string;
};

export type UserSystem = {
  id?: number;
  displayName?: string;
  username?: string;
  email?: string;
  password?: string;
  colorScheme?: string;
  avatar?: {
    mime: string;
    base64: string;
    name: string;
    deleteFile?: string | null;
  };
};

export const registerSchema = Joi.object({
  username: Joi.string().min(3).alphanum().messages({
    'string.min': 'Username must be at least 3 characters long',
    'string.alphanum': 'Username can only contain numbers or letters',
    'string.empty': 'Username is required'
  }),
  displayName: Joi.string().min(2).messages({
    'string.min': 'Display Name must be at least 2 characters long',
    'string.empty': 'Display Name is required'
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': 'Invalid Email Address',
      'string.empty': 'Email Address is required'
    }),
  password: Joi.string().min(8).messages({
    'string.min': 'Password must be at least 8 characters',
    'string.empty': 'Password is required'
  })
});

export const validateRegistration = joiResolver(registerSchema);

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': 'Invalid Email Address',
      'string.empty': 'Email Address is required'
    }),
  password: Joi.string().messages({
    'string.empty': 'Password is required'
  })
});

export const validateLogin = joiResolver(loginSchema);

export const resetRequestSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': 'Invalid Email Address',
      'string.empty': 'Email Address is required'
    })
});

export const validateResetRequest = joiResolver(resetRequestSchema);

export const resetSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': 'Invalid Email Address',
      'string.empty': 'Email Address is required'
    }),
  resetKey: Joi.string().messages({
    'string.empty': 'Reset Key is required'
  }),
  password: Joi.string().min(8).messages({
    'string.min': 'Password must be at least 8 characters',
    'string.empty': 'Password is required'
  })
});

export const validateReset = joiResolver(resetSchema);

export const accountSchema = ({
  id,
  username,
  displayName,
  email,
  currentPassword,
  newPassword,
  password,
  colorScheme,
  file,
  avatar
}) => {
  const schema = {};
  if (id) {
    schema.id = Joi.number().messages({
      'number.empty': 'ID is required'
    });
  }
  if (username) {
    schema.username = Joi.string().min(3).alphanum().messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.alphanum': 'Username can only contain numbers or letters',
      'string.empty': 'Username is required'
    });
  }
  if (displayName) {
    schema.displayName = Joi.string().min(2).messages({
      'string.min': 'Display Name must be at least 2 characters long',
      'string.empty': 'Display Name is required'
    });
  }
  if (email) {
    schema.email = Joi.string()
      .email({ tlds: { allow: false } })
      .messages({
        'string.email': 'Invalid Email Address',
        'string.empty': 'Email Address is required'
      });
  }
  if (currentPassword || password) {
    schema.currentPassword = Joi.string().min(8).messages({
      'string.min': 'Password must be at least 8 characters',
      'string.empty': 'Password is required'
    });
  }
  if (newPassword || password) {
    schema.newPassword = Joi.string().min(8).messages({
      'string.min': 'Password must be at least 8 characters',
      'string.empty': 'Password is required'
    });
  }
  if (colorScheme) {
    schema.colorScheme = Joi.string().messages({
      'string.empty': 'Password is required'
    });
  }
  if (file) {
    schema.file = Joi.string();
    schema.fileType = Joi.string();
  }

  if (avatar) {
    schema.avatar = Joi.object({
      mime: Joi.string(),
      base64: Joi.string(),
      name: Joi.string()
    });
  }
  return Joi.object(schema);
};

export const validateAccount = (params: object) =>
  joiResolver(accountSchema(params));
