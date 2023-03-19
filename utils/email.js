import { createTransport } from 'nodemailer'

const sendEmail = async options => {
    // 1) create transporter
    const transporter = createTransport({
        // service: "Gmail",
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    //2) defined the email options
    const mailOptions = {
        from: 'aliobeidate@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html:
    }

    //3) Actually send email
    await transporter.sendMail(mailOptions)
}
export default sendEmail