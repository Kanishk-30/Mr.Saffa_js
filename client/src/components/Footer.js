import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/images/mr-saffa-logo.png"
                alt="Mr. Saffa Cleaning Products Logo"
                className="h-20 w-auto"
                style={{ maxHeight: "80px" }}
              />
            </div>
            <p className="text-gray-300 mb-4">
              At Mr. Saffa, we don't just produce cleaning products, we create trust. Each product is a promise of quality and care. As the maker and guardian of our brand, we ensure excellence in every drop. Choose Mr. Saffa for purity, power, and peace of mind.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <span className="text-white text-sm font-bold">f</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                aria-label="Instagram"
              >
                <span className="text-white text-sm font-bold">@</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                aria-label="WhatsApp"
              >
                <span className="text-white text-sm font-bold">W</span>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">Hanumangarh, Rajasthan</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" />
                <a href="tel:+917878888406" className="text-gray-300 hover:text-white transition-colors">
                  +91 7878888406
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" />
                <a href="mailto:mrsaffa01@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                  mrsaffa01@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Service Areas</h4>
            <div className="space-y-2 text-gray-300 mb-4">
              <p>Hanumangarh - 335513</p>
              <p>Hanumangarh - 335512</p>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">9 AM - 8 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">© {currentYear} Mr. Saffa Cleaning Products. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
