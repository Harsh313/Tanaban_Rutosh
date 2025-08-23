import React from "react";

const ShippingDelivery: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <h1 className="text-3xl tracking-widest text-center mb-8">
          SHIPPING AND DELIVERY
        </h1>

        {/* Subtitle */}
        <h2 className="text-lg font-semibold text-center mb-6">R U T O S H</h2>

        {/* Description */}
        <p className="mb-6 text-gray-700 leading-relaxed">
          We strive to dispatch your order within{" "}
          <span className="font-semibold">5-7 working days</span> after
          receiving your confirmed measurements. Since all our products are
          made-to-order, we kindly request you to provide your measurements to
          ensure a perfect fit.
        </p>

        {/* Bullet Points */}
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>
            <span className="font-semibold">For orders within Delhi:</span>{" "}
            Delivery typically takes <span className="font-semibold">2-3 days</span>{" "}
            from the date of dispatch.
          </li>
          <li>
            <span className="font-semibold">For orders across India:</span>{" "}
            Delivery usually takes <span className="font-semibold">5-7 days</span>{" "}
            from the date of dispatch.
          </li>
          <li>
            <span className="font-semibold">For international orders:</span>{" "}
            Delivery may take <span className="font-semibold">7-10 days</span> from
            the date of dispatch.
          </li>
        </ul>

        {/* Optional Note */}
        <p className="mt-6 text-sm text-gray-600">
          Please note: Delivery timelines are indicative and may vary based on
          logistics and other unforeseen circumstances.
        </p>
      </div>

      {/* Floating WhatsApp Button */}
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
    </div>
  );
};

export default ShippingDelivery;
