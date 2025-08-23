import React, { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import emailjs from "emailjs-com";
const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("Please fill out all fields.");
      return;
    }
    console.log("Form submitted:", formData);
    setStatus("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        {/* Heading */}
        <h1 className="text-3xl font-semibold tracking-wide mb-10">CONTACT US</h1>

        {/* Instagram */}
        <div className="flex justify-center mb-6">
          <a
            href="https://www.instagram.com/taanabaana_by_rutosh?igsh=MTI1aXg2bGt3amZjcA=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:text-pink-500 transition"
          >
            <FaInstagram size={40} />
            <span className="mt-2 font-medium">Instagram</span>
          </a>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 text-lg text-gray-800 font-medium mb-10">
          <p>
            CONTACT NUMBER:{" "}
            <a href="tel:+917011576200" className="hover:underline">
              +91 70115-76200
            </a>
          </p>
          
          <p>
            INSTAGRAM EXECUTIVE:{" "}
            <a href="tel:+917011576200" className="hover:underline">
              +91 70115-76200
            </a>
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <textarea
            name="message"
            placeholder="Your message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          {status && <p className="text-green-600 text-sm">{status}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded uppercase tracking-wide hover:bg-gray-900"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
