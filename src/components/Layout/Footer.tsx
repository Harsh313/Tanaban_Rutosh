import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Mail } from 'lucide-react'
import AboutUs from '../FootersectionData/AboutUs'
import CancellationPolicy from '../FootersectionData/CancellationPolicy'
import TermsofService from '../FootersectionData/TermsofService'
import ContactUs from '../FootersectionData/CancellationPolicy'
import CustomizeSize from '../FootersectionData/CustomizeSize'
import ShippingDelivery from '../FootersectionData/ShippingDelivery'
import SizeChart from '../FootersectionData/SizeChart'
import PrivacyPolicy from '../FootersectionData/PrivacyPolicy'
const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        


        {/* Who Are We */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Who Are We?</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/AboutUs" className="hover:text-white">About Us</Link></li>
            <li><Link to="/CancellationPolicy" className="hover:text-white">Cancellation & Return Policy</Link></li>
            <li><Link to="/TermsofService" className="hover:text-white">Terms of Service</Link></li>
            
          </ul>
        </div>
        {/* Need Help */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/ContactUs" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/CustomizeSize" className="hover:text-white">Customize Sizes</Link></li>
            <li><Link to="/SizeChart" className="hover:text-white">Size Chart</Link></li>
            <li><Link to="/ShippingDelivery" className="hover:text-white">Ship & Delivery Policy</Link></li>
          </ul>
        </div>
        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Social Links</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/taanabaana_by_rutosh?igsh=MTI1aXg2bGt3amZjcA=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=contact.rutosh@gmail.com&su=Customer%20Inquiry&body="
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
        {/* QR code  */}
        <div className="flex flex-col items-center md:items-start">
          <p className="text-lg font-semibold mb-4">Scan to follow us on Instagram</p>
          <img
            src="/taanabaana_by_rutosh_qr.png"
            alt="Instagram QR Code"
            className="h-32 w-32 object-contain"
          />
        </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Tanabana. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/PrivacyPolicy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>

          </div>
        </div>
      </div>
    
    </footer>
  )
}

export default Footer