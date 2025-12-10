const nodemailer = require('nodemailer');
require('dotenv').config(); 

async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Support Client" <${process.env.EMAIL_USER}>`,
      to: "tonemaildetest@gmail.com", 
      subject: "✅ Test Email depuis Node.js",
      text: "Félicitations, votre configuration SMTP fonctionne parfaitement ! 🎯",
    });

    console.log("✅ Email envoyé :", info.messageId);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
  }
}

sendTestEmail();
