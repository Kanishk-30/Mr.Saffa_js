import React from "react"

const InquiryThankYou = ({ inquiry }) => {
  // inquiry prop should include: inquiryNumber, customerInfo, items

  if (!inquiry || !inquiry.customerInfo) {
    // fallback if called without data
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white max-w-md mx-auto p-8 rounded shadow text-center">
          <h1 className="text-2xl font-bold text-green-800 mb-4">Thank You!</h1>
          <p className="mb-2">Your inquiry has been submitted successfully.</p>
          <p className="mb-2">Our team will contact you soon for details and bulk quote.</p>
          <div className="mt-6">
            <a href="/products" className="bg-blue-600 hover:bg-blue-800 transition text-white font-semibold py-2 px-6 rounded">Back to Products</a>
          </div>
        </div>
      </div>
    )
  }

  const { inquiryNumber, customerInfo, items } = inquiry;
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white max-w-lg mx-auto p-8 rounded shadow">
        <h1 className="text-2xl font-bold text-green-800 mb-4">Inquiry Submitted!</h1>
        <p className="mb-3 text-gray-800">
          Thank you for submitting your business inquiry. <br />
          <span>Your inquiry number:</span>
          <span className="block text-xl text-blue-700 font-bold mt-1 mb-2">
            {inquiryNumber}
          </span>
        </p>
        <p className="mb-4 text-gray-700">
          Our team will review your request and contact you within 1 business day.
        </p>
        <div className="border-t pt-4 text-left mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Submitted Details:</h2>
          <p className="mb-1"><span className="font-medium">Name:</span> {customerInfo.name}</p>
          <p className="mb-1"><span className="font-medium">Email:</span> {customerInfo.email}</p>
          <p className="mb-1"><span className="font-medium">Phone:</span> {customerInfo.phone}</p>
          <p className="mb-1"><span className="font-medium">Company/Firm Name:</span> {customerInfo.firmName}</p>
          <p className="mb-1"><span className="font-medium">GST Number:</span> {customerInfo.gstNumber || "N/A"}</p>
          <p className="mb-1"><span className="font-medium">Address:</span> {customerInfo.address}</p>
          <p className="mb-1"><span className="font-medium">PIN Code:</span> {customerInfo.pincode}</p>
          <p className="mb-1"><span className="font-medium">Requirements:</span> {customerInfo.requirements || "—"}</p>
          <p className="mb-1"><span className="font-medium">Expected Quantity:</span> {customerInfo.expectedQuantity || totalQty}</p>
          <p className="mb-2"><span className="font-medium">Timeline:</span> {customerInfo.timeline || "Not specified"}</p>
          <div className="mt-3">
            <span className="font-bold underline text-blue-700">Products of Interest:</span>
            <ul className="list-disc ml-6 mt-1 text-sm">
              {items.map((item, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{item.name}</span> (qty: {item.quantity})
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-red-500 text-white p-5 rounded-lg my-4 shadow-lg">
          <div className="font-bold text-lg mb-1">For Business/Bulk Deal Assistance:</div>
          <div>
            <span className="inline-block font-semibold">Phone:</span>
            <span className="ml-2 font-mono text-base">+91 8955224259</span>
          </div>
          <div>
            <span className="inline-block font-semibold">Email:</span>
            <span className="ml-2 font-mono text-base">mrsaffa01@gmail.com</span>
          </div>
          <div className="text-xs mt-2 text-gray-100/90">Prefer WhatsApp? <a className="underline" href="https://wa.me/918955224259" target="_blank" rel="noopener noreferrer">Click here</a> for direct contact.</div>
        </div>
        <div className="mt-4 text-center">
          <a href="/products" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-800 transition-all">Explore More Products</a>
        </div>
      </div>
    </div>
  )
}

export default InquiryThankYou
