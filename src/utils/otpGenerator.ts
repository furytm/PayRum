import crypto from 'crypto';

const generateOTP = (length: number = 6): string => {
  const otp = crypto.randomBytes(length).toString('hex').slice(0, length);
  return otp;
};

export { generateOTP };
