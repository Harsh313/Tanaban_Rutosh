import React from 'react'
import Hero from '../components/Home/Hero'
import FeaturedProducts from '../components/Home/FeaturedProducts'

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      
      {/* Brand Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                Founded on the principle that less is more, Tanabana creates timeless pieces for the modern woman. Our minimalist approach to fashion emphasizes quality, comfort, and feminine elegance that transcends seasons and trends.
              </p>
              <p className="text-gray-600 text-lg">
                Every piece in our women's collection is thoughtfully designed and ethically produced, celebrating the strength and grace of contemporary femininity while ensuring you feel confident and comfortable.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Our Story"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Quality</h3>
              <p className="text-gray-600">
                We use only the finest materials and craftsmanship to create pieces that celebrate feminine beauty and last for years.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Committed to ethical production and environmental responsibility in women's fashion.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Timeless</h3>
              <p className="text-gray-600">
                Feminine designs that transcend trends and empower women season after season.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home