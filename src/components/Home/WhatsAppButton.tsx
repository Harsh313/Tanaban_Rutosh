import React from "react";

const WhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/917011576200"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="w-8 h-8"
      />
    </a>
  );
};

export default WhatsAppButton;
