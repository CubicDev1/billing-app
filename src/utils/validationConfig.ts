import { ValidationValueMessage } from 'react-hook-form';
import { labels } from './labels';

export const validationSchema = {
  phoneNumber: {
    minLength: 6,
    maxLength: 14,
  },
  password: {
    minLength: 2,
    maxLength: 30,
  },
  name: {
    minLength: 2,
    maxLength: 50,
  },
};

export const emailValidation = (v: string): boolean | string => {
  const emailRegx = /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i;
  if (v) {
    return emailRegx.test(v) || ('Email is not valid');
  } else return true;
};

export const requiredValidation = (
  label: string,
): ValidationValueMessage<boolean> => {
  return { value: true, message: getRquiredMessage(label) };
};

export const getRquiredMessage = (feild: string): string => {
  return `${feild} ${("is required")}`;
};

export const getMinLengthMessage = (length: number): string => {
  return `${("labels.minLength")} ${length} ${("labels.charactersRequired")}.`;
};

export const minLengthValidation = (
  length: number,
): ValidationValueMessage<number> => {
  return { value: length, message: getMinLengthMessage(length) };
};

// Numeric Validation
export const numericValidation = (v: string): boolean | string => {
  const numericRegx = /^[0-9]+$/;
  if (v) {
    return numericRegx.test(v) || ('Number only allowed');
  } else return true;
};

// Alphabets Validation (Only letters A-Z, a-z)
export const alphabetValidation = (v: string): boolean | string => {
  const alphabetRegx = /^[A-Za-z\s]+$/; // Added \s to allow spaces
  if (v) {
    return alphabetRegx.test(v) || "Alphabet only allowed";
  } else return true;
};

// Alphanumeric Validation (Letters and Numbers)
export const alphanumericValidation = (v: string): boolean | string => {
  const alphanumericRegx = /^[A-Za-z0-9]+$/;
  if (v) {
    return alphanumericRegx.test(v) || ("Alphabet and Numbers only allowed");
  } else return true;
};


export const passwordValidation =  (password: string): boolean | string => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!password) {
    return (labels.passwordIsRequired)
  } else if (password.length < minLength) {
    return (labels.passwordErrorMsg8Char);
  } else if (!hasUpperCase) {
    return (labels.passwordErrorMsgUpperCase);
  } else if (!hasLowerCase) {
    return (labels.passwordErrorMsgLowerCase);
  } else if (!hasNumber) {
    return (labels.passwordErrorMsgNumber);
  } else if (!hasSpecialChar) {
    return (labels.passwordErrorMsgSpecialChar);
  }

  return true; // Password is valid
};
