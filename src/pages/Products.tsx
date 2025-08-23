import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Grid, List } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/Products/ProductCard'

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  category: string
  description: string
  sizes: string[]
  colors: string[]
}

const Products: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('name')
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    color: '',
    size: ''
  })

  const searchQuery = searchParams.get('q') || ''
  const categoryFilter = searchParams.get('category') || ''

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, categoryFilter, sortBy, filters])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let query = supabase.from('products').select('*')

      // Apply search query
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`)
      }

      // Apply category filter
      if (categoryFilter || filters.category) {
        query = query.eq('category', categoryFilter || filters.category)
      }

      // Apply price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number)
        query = query.gte('price', min)
        if (max) query = query.lte('price', max)
      }

      // Apply sorting
      if (sortBy === 'price-asc') {
        query = query.order('price', { ascending: true })
      } else if (sortBy === 'price-desc') {
        query = query.order('price', { ascending: false })
      } else if (sortBy === 'name') {
        query = query.order('name', { ascending: true })
      } else if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

   const categories = ['dresses', 'tops', 'Cargo', 'Pants', 'Cord-Sets', 'Cotton']
  const priceRanges = [
    { label: 'Under ₹1500', value: '0-1500' },
    { label: '₹1500 - ₹2500', value: '1500-2000' },
    { label: '₹2500 - ₹5000', value: '2500-5000' },
     { label: '₹5000 - ₹10000', value: '5000-10000' },
    { label: '₹10000+', value: '10000-' }
  ]

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      color: '',
      size: ''
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index}>
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">
              {searchQuery ? `Search Results for "${searchQuery}"` : 
               categoryFilter ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Collection` : 
               'All Products'}
            </h1>
            <p className="text-gray-600 mt-2">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="name">Sort by Name</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600 capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.value}
                        checked={filters.priceRange === range.value}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products