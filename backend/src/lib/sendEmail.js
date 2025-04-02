import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerifcationEmail = async (verificationCode, email) => {

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Manager | Verification Code",
    text: `Your password reset code is: ${verificationCode}. This code will expire in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #FF0084;">Password Reset</h2>
        <p>You requested to reset your password. Use the code below to complete the process:</p>
        <div style="background-color: #f7f7f7; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
          <h3 style="margin: 0; font-size: 24px; letter-spacing: 3px;">${resetCode}</h3>
        </div>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
    </div>
    `,
  };


  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    return console.error("Error in sending email: ", error.message);
  }
};
export const sendResetPasswordEmail = async (resetCode, email) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Manager | Password Reset Code",
    text: `Your password reset code is: ${resetCode}. This code will expire in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #FF0084;">Password Reset</h2>
        <p>You requested to reset your password. Use the code below to complete the process:</p>
        <div style="background-color: #f7f7f7; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
          <h3 style="margin: 0; font-size: 24px; letter-spacing: 3px;">${resetCode}</h3>
        </div>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
     </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Reset email sent: " + info.response);
  } catch (error) {
    return console.error("Error in sending reset email: ", error.message);
  }
};