const nodemailer = require("nodemailer")

// Configure transporter with your email service credentials
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Function to send inquiry notification email
const sendInquiryEmail = async (inquiry) => {
  const {
    customerInfo: {
      name,
      phone,
      email,
      firmName,
      gstNumber,
      address,
      pincode,
      requirements,
      expectedQuantity,
      timeline,
    },
    items,
    inquiryNumber,
  } = inquiry

  // Create HTML content for email
  const itemsHtml = items
    .map(
      (item) =>
        `<li>${item.name} - Quantity: ${item.quantity || "N/A"} - Price: ₹${item.price}</li>`
    )
    .join("")

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "yourbusinessmail@example.com", // <-- Your email to receive inquiries
    subject: `New Business Inquiry #${inquiryNumber} from ${name}`,
    html: `
      <h2>New Business Inquiry Received</h2>
      <h3>Customer Info</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Firm Name:</strong> ${firmName}</li>
        <li><strong>GST Number:</strong> ${gstNumber || "N/A"}</li>
        <li><strong>Address:</strong> ${address}</li>
        <li><strong>PIN Code:</strong> ${pincode}</li>
        <li><strong>Expected Quantity:</strong> ${expectedQuantity || "N/A"}</li>
        <li><strong>Timeline:</strong> ${timeline || "N/A"}</li>
        <li><strong>Special Requirements:</strong> ${requirements || "N/A"}</li>
      </ul>
      <h3>Items</h3>
      <ul>${itemsHtml}</ul>
    `,
  }

  await transporter.sendMail(mailOptions)
}

module.exports = { sendInquiryEmail }
