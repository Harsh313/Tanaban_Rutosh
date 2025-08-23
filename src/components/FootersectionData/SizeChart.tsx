import React from "react";

const SizeChart: React.FC = () => {
  const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
  const chest = ['32"', '34"', '36"', '38"', '40"', '42"', '44"'];
  const waist = ['26"', '28"', '30"', '32"', '34"', '36"', '38"'];
  const hip = ['36"', '38"', '40"', '42"', '44"', '46"', '48"'];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Title */}
        <h1 className="text-3xl tracking-widest text-center mb-8">SIZE CHART</h1>

        {/* Brand Name */}
        <h2 className="text-lg font-semibold text-center mb-6">R U T O S H</h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-center">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Size</th>
                {sizes.map((size) => (
                  <th key={size} className="border border-gray-300 px-4 py-2">{size}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-left font-medium">Chest</td>
                {chest.map((c, i) => (
                  <td key={i} className="border border-gray-300 px-4 py-2">{c}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-left font-medium">Waist</td>
                {waist.map((w, i) => (
                  <td key={i} className="border border-gray-300 px-4 py-2">{w}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-left font-medium">Hip</td>
                {hip.map((h, i) => (
                  <td key={i} className="border border-gray-300 px-4 py-2">{h}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Note */}
        <p className="text-center text-gray-600 text-sm mt-4">
          The above size chart is indicative to our standard sizes only.
          </p>
           <p className="text-center text-gray-600 text-sm mt-4">
          Please refer to the size chart given under the particular product that you would like to purchase for more
          </p>
           <p className="text-center text-gray-600 text-sm mt-4">
         detailed understanding of the lengths etc..
          </p>
           <p className="text-center text-black-bold text-sm mt-4">
          (All the measurements are in inches) 

          </p>
      </div>
    </div>
  );
};

export default SizeChart;
