import otpGenerator from 'otp-generator'

export const generateOTP = () => {
  const OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: true,
    specialChars: false,
  });

  return OTP;
};
