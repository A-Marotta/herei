const nodemailer = require("nodemailer");

/**
 *
 * @param email  Customer's email
 * @param subject Email Subject
 * @param html   Email html template
 * @returns {Promise<void>}
 */
const sendEmail = async (email, subject, html) => {
    try {
        console.log(process.env.SERVICE);
        console.log(process.env.USER);
        console.log(process.env.PASS);

        const transporter = nodemailer.createTransport({
            host: process.env.SERVICE,
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: `"HereI" <process.env.EMAIL_USER>`,
            to: email,
            subject: subject,
            html: html,
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};

module.exports = sendEmail;