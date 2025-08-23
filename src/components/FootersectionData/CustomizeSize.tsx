// src/components/AboutUs.tsx
import React from "react";

const CustomizeSize = () => {
  return (
    <section className="py-16 px-4 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-semibold tracking-wider mb-8 uppercase">
        Customize Size
      </h2>

      <div className="space-y-6 text-gray-700 text-base leading-relaxed">
        <p>
          We're happy to customize sizes and length of your favorite piece.
          While ordering on the website, you can choose the size closest to your
          measurements and complete the purchase. Before starting your order,
          the office will contact you to recheck all measurements with you.
          Please be sure to provide us with your correct contact details at the
          time of placing your order to make sure that we can get in touch with
          you to confirm the measurements.
        </p>
      </div>
    </section>
  );
};

export default CustomizeSize;
