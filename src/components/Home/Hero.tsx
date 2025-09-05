import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="absolute inset-0 bg-[url('https://apuyqxvlwmctcxrdtcsf.supabase.co/storage/v1/object/public/product-images/hero.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          
          <p className="text-xl md:text-2xl mb-8 font-light tracking-wide">
            Minimalist fashion for the modern woman
          </p>
          <p className="text-lg mb-12 text-gray-200 max-w-2xl mx-auto">
            Discover timeless pieces designed for the confident, contemporary woman. 
            Each garment is carefully crafted to elevate your feminine style with effortless elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-white text-black text-lg font-medium rounded-none hover:bg-gray-100 transition-colors group"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/categories/dresses"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white text-lg font-medium rounded-none hover:bg-white hover:text-black transition-colors"
            >
              Shop Dresses
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero