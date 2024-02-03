const nodemailer = require("nodemailer");
const {AUTH_EMAIL, AUTH_PASSWORD} = process.env
const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host:"stmp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: "X20 Journey",
      to: email,
      subject: subject,
      text: "Your code has been sent to email : " + text,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};
module.exports = sendEmail;

