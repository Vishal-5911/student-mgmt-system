const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const cors = require("cors");

async function generateAndSendOTP(email, DBmodel, yourEmail, yourPass) {
  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  const otp = generateOTP();

  await DBmodel.create({ email, otp });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: yourEmail,
      pass: yourPass,
    },
  });
  await transporter.sendMail({
    from: yourEmail,
    to: email,
    subject: "OTP verification ",
    text: `Your OTP for verification is: ${otp}`,
  });
}

module.exports = { generateAndSendOTP };
