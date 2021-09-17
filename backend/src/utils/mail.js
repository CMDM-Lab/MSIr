import nodemailer from 'nodemailer'
import dotenv from 'dotenv-defaults'

dotenv.config()

export const sendResetMail = (email, resetToken) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: true
        }
    });

    let mailOptions = {
        from: `'MSI Registrar II' <${process.env.MAIL_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Notification from MSI Registrar II", // Subject line
        html: `<p>Hello ${email}</p>
               <br />
               <p>Someone has requested a link to change your password. You can do this through the link below.</p>
               <br/>
               <p><a href=${process.env.WEB_URL}/users/password/edit?${resetToken} >Reset your password</a></p>
               <br/>
               <p>If you didn't request this, please ignore this email.</p>
               <p>Your password won't change until you access the link above and create a new one.</p>
               <br />
               <p>Best regards,</p>
               <p>MSI Registrar II Team</p>
              ` // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}

export const sendPasswordChangeMail = (email) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: true
        }
    });

    let mailOptions = {
        from: `'MSI Registrar II' <${process.env.MAIL_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Notification from MSI Registrar II", // Subject line
        html: `<p>Hello ${email}</p>
               <br />
               <p>We're contacting you to notify you that your password has been changed.</p>
               <p>Thanks for using MSI Registrar II!</p>
               <br />
               <p>Best regards,</p>
               <p>MSI Registrar II Team</p>
              ` // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}