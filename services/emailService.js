const nodemailer = require("nodemailer")
require('dotenv').config(); ;

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  secure: false,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: '"Support Client" <farah.sassi@istic.ucar.tn>', 
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};
