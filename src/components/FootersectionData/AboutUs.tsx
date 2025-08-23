// src/components/AboutUs.tsx
import React from 'react';

const AboutUs = () => {
  return (
    <section className="py-16 px-4 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-semibold tracking-wider mb-8 uppercase">About Us</h2>

      <div className="space-y-6 text-gray-700 text-base leading-relaxed">
        {/* <p>Entering our 12th year of stitching happiness for you.</p> */}

        <p>
          Our label is a fun loving, quirk-some, limited edition line of clothing that guarantees
          to keep you on trend while ensuring you don't burn a hole in your pocket!
        </p>

        <p>
          All our pieces are hand-made with love to ensure you not only look good but feel even
          better!
        </p>

        <p>
          If you don't fit standard sizes mentioned, we are happy to customize!
        </p>

        <p>We sell happiness in handmade stitched bags!</p>
      </div>
    </section>
  );
};

export default AboutUs;
