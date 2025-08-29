require('dotenv').config()
const nodemailer = require('nodemailer')

async function testEmail() {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true,
  })

  try {
    let info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from Nodemailer',
      text: 'If you receive this, SMTP credentials worked!',
    })
    console.log('Email sent:', info.response)
  } catch (err) {
    console.error('Error sending email:', err)
  }
}

testEmail()
