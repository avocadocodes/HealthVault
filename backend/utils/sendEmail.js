const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
async function generateEmail(receiverName,receiverEmail,token,min){
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "priyanshuarya4@gmail.com",
          pass: `${process.env.APP_PASSWORD}`,
        },
        tls: {
            rejectUnauthorized: false, 
        },
      });
    const mailOptions = {
        from: "priyanshuarya4@gmail.com",
        to: `${receiverEmail}`,
        subject: `Hello ${receiverName} from HealthVault!!`,
        text: `Your token is ${token} for the next ${min} min`,
      };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
          throw Error(`Error sending email to ${receiverEmail}`)
        } else {
          console.log("Email sent: ", info.response);
        }
      });
}

module.exports=generateEmail;