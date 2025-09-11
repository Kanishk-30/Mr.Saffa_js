import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
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
                href="https://www.facebook.com/mrsaffa.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.instagram.com/polestar_finechem_india/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
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

          {/* Social Medias */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Social Medias</h4>
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/polestar_finechem_india/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <span>Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/mrsaffa.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>Facebook</span>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100090428921848"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>PSFC India</span>
              </a>
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
