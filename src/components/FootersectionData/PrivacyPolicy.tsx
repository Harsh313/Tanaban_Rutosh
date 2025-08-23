import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: [Date]</p>

      <p>
        <strong>[Your Company / Website Name]</strong> ("we", "our", "us")
        values your privacy. This Privacy Policy explains how we collect, use,
        and protect your personal information when you use our website,
        products, or services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Personal Information:</strong> Name, email address, phone
          number, billing/shipping address, and other details you provide.
        </li>
        <li>
          <strong>Usage Data:</strong> IP address, browser type, pages visited,
          time spent, and other analytics.
        </li>
        <li>
          <strong>Cookies & Tracking:</strong> Small files stored on your device
          to improve your experience.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Providing and improving our services</li>
        <li>Processing payments and orders</li>
        <li>Sending updates, offers, or notifications (with your consent)</li>
        <li>Responding to inquiries and support requests</li>
        <li>Analyzing site usage to improve performance</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. How We Share Your Information</h2>
      <p>
        We <strong>do not sell</strong> your personal information. We may share
        it only with service providers, when required by law, or to protect our
        rights and safety.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookies & Tracking</h2>
      <p>
        We use cookies to keep you signed in, remember preferences, and analyze
        traffic. You can disable cookies in your browser, but some features may
        not work.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Security</h2>
      <p>
        We use industry-standard measures to protect your data, but no method of
        online transmission is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, or
        delete your data, opt out of marketing, or restrict processing. Contact
        us at <strong>[Your Email Address]</strong> to exercise these rights.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Third-Party Links</h2>
      <p>
        Our website may link to other sites. We are not responsible for their
        privacy practices—please review their policies.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Changes will be posted here
        with an updated date.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact Us</h2>
      <p>
        <strong>R U T O S H</strong>
        <br />
        Email: <strong>+91 7010072200</strong>
        <br />
        Address: <strong>[Your Business Address]</strong>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
