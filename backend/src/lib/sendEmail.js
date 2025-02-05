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
    subject: "Password Manager | Verification Code ",
    text: `Your verification code is: ${verificationCode}`,
    html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    return console.error("Error in sending email: ", error.message);
  }
};
