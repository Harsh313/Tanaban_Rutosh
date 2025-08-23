import React from 'react'

const CancellationPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Cancellation / Return / Refund Policy
      </h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">General Policy</h2>
        <p>
          At <strong>R U T O S H</strong>, each piece is handcrafted with love and precision. As a result, we do not accept returns on orders placed.
        </p>
        <p className="mt-2">
          However, we are delighted to offer <strong>complimentary alterations</strong> to ensure your perfect fit.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Cancellation Policy</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Orders can be cancelled within <strong>24 hours</strong> of being placed.</li>
          <li>Refunds will be processed within <strong>3–4 working days</strong> through the original mode of payment.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Alterations Policy</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>If any alterations are required, we’re happy to assist at <strong>no extra cost</strong>.</li>
          <li>The courier charges for sending the outfit back to us will need to be <strong>borne by the customer</strong>.</li>
          <li>We will cover the courier cost for returning the altered outfit back to you.</li>
        </ul>
      </section>

      <p className="mt-6 text-center font-medium italic">
        Thank you for choosing <strong>R U T O S H</strong> – where every piece is made just for you!
      </p>
    </div>
  )
}

export default CancellationPolicy
