import { transporter } from '../config/nodemailer.config';

const sendOTPEmail = async (email: string, otp: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    });
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};

export { sendOTPEmail };
