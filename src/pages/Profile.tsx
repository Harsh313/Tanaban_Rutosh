import React, { useState, useEffect } from 'react'
import { User, Mail, Calendar, Camera, Save, Phone, MapPin, Edit3, Check, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string
  email: string
  full_name: string
  username: string
  phone: string
  date_of_birth: string
  bio: string
  address: {
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
  preferences: {
    newsletter?: boolean
    sms_notifications?: boolean
    email_notifications?: boolean
  }
  avatar_url: string
  created_at: string
  updated_at: string
}

const Profile: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    phone: '',
    date_of_birth: '',
    bio: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    preferences: {
      newsletter: true,
      sms_notifications: false,
      email_notifications: true
    }
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
      } else if (data) {
        setProfile(data)
        setFormData({
          full_name: data.full_name || '',
          username: data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          date_of_birth: data.date_of_birth || '',
          bio: data.bio || '',
          address: data.address || {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: ''
          },
          preferences: data.preferences || {
            newsletter: true,
            sms_notifications: false,
            email_notifications: true
          }
        })
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user?.id!,
          email: user?.email!,
          full_name: user?.user_metadata?.full_name || '',
          username: '',
          phone: '',
          date_of_birth: '',
          bio: '',
          address: {},
          preferences: {
            newsletter: true,
            sms_notifications: false,
            email_notifications: true
          },
          avatar_url: ''
        }
        
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single()

        if (!createError && createdProfile) {
          setProfile(createdProfile)
          setFormData({
            full_name: createdProfile.full_name,
            username: createdProfile.username || '',
            email: createdProfile.email,
            phone: createdProfile.phone || '',
            date_of_birth: createdProfile.date_of_birth || '',
            bio: createdProfile.bio || '',
            address: createdProfile.address || {
              street: '',
              city: '',
              state: '',
              zip: '',
              country: ''
            },
            preferences: createdProfile.preferences || {
              newsletter: true,
              sms_notifications: false,
              email_notifications: true
            }
          })
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username === profile?.username) {
      setUsernameAvailable(null)
      return
    }

    setCheckingUsername(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .neq('id', user?.id)

      if (error) {
        console.error('Error checking username:', error)
        setUsernameAvailable(null)
      } else {
        setUsernameAvailable(data.length === 0)
      }
    } catch (error) {
      console.error('Error:', error)
      setUsernameAvailable(null)
    } finally {
      setCheckingUsername(false)
    }
  }

  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      if (section === 'basic') {
        updateData.full_name = formData.full_name
        updateData.username = formData.username
        updateData.email = formData.email
        updateData.phone = formData.phone
        updateData.date_of_birth = formData.date_of_birth
      } else if (section === 'bio') {
        updateData.bio = formData.bio
      } else if (section === 'address') {
        updateData.address = formData.address
      } else if (section === 'preferences') {
        updateData.preferences = formData.preferences
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user?.id)

      if (error) {
        console.error('Error updating profile:', error)
        alert('Error updating profile')
      } else {
        alert('Profile updated successfully!')
        setEditingSection(null)
        fetchProfile()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else if (name.startsWith('preferences.')) {
      const prefField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefField]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
      
      if (name === 'username') {
        checkUsernameAvailability(value)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-black to-gray-800 px-8 py-12">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-black rounded-full text-white hover:bg-gray-800 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{profile?.full_name || 'User'}</h2>
                  <p className="text-gray-300">@{profile?.username || 'username'}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-black">Basic Information</h3>
              <button
                onClick={() => setEditingSection(editingSection === 'basic' ? null : 'basic')}
                className="p-2 text-gray-600 hover:text-black transition-colors"
              >
                <Edit3 className="h-5 w-5" />
              </button>
            </div>

            {editingSection === 'basic' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                          usernameAvailable === false ? 'border-red-300' : usernameAvailable === true ? 'border-green-300' : 'border-gray-300'
                        }`}
                        placeholder="Choose a unique username"
                      />
                      {checkingUsername && (
                        <div className="absolute right-3 top-3.5">
                          <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-black rounded-full"></div>
                        </div>
                      )}
                      {usernameAvailable === true && (
                        <Check className="absolute right-3 top-3.5 h-5 w-5 text-green-500" />
                      )}
                      {usernameAvailable === false && (
                        <X className="absolute right-3 top-3.5 h-5 w-5 text-red-500" />
                      )}
                    </div>
                    {usernameAvailable === false && (
                      <p className="text-red-500 text-sm mt-1">Username is already taken</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSave('basic')}
                    disabled={saving || usernameAvailable === false}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-semibold text-black">{profile?.full_name || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="h-5 w-5 text-gray-400 font-bold">@</span>
                  <div>
                    <p className="text-sm text-gray-600">Username</p>
                    <p className="font-semibold text-black">{profile?.username || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-black">{profile?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-black">{profile?.phone || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-semibold text-black">
                      {profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-black">About Me</h3>
              <button
                onClick={() => setEditingSection(editingSection === 'bio' ? null : 'bio')}
                className="p-2 text-gray-600 hover:text-black transition-colors"
              >
                <Edit3 className="h-5 w-5" />
              </button>
            </div>

            {editingSection === 'bio' ? (
              <div className="space-y-4">
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSave('bio')}
                    disabled={saving}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">
                {profile?.bio || 'No bio added yet. Click edit to add information about yourself.'}
              </p>
            )}
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-black">Address</h3>
              <button
                onClick={() => setEditingSection(editingSection === 'address' ? null : 'address')}
                className="p-2 text-gray-600 hover:text-black transition-colors"
              >
                <Edit3 className="h-5 w-5" />
              </button>
            </div>

            {editingSection === 'address' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="address.zip"
                      value={formData.address.zip}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="10001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="United States"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSave('address')}
                    disabled={saving}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  {profile?.address && Object.keys(profile.address).length > 0 ? (
                    <div className="text-gray-700">
                      {profile.address.street && <p>{profile.address.street}</p>}
                      {(profile.address.city || profile.address.state || profile.address.zip) && (
                        <p>
                          {profile.address.city}{profile.address.city && profile.address.state && ', '}
                          {profile.address.state} {profile.address.zip}
                        </p>
                      )}
                      {profile.address.country && <p>{profile.address.country}</p>}
                    </div>
                  ) : (
                    <p className="text-gray-500">No address added yet. Click edit to add your address.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-black">Preferences</h3>
              <button
                onClick={() => setEditingSection(editingSection === 'preferences' ? null : 'preferences')}
                className="p-2 text-gray-600 hover:text-black transition-colors"
              >
                <Edit3 className="h-5 w-5" />
              </button>
            </div>

            {editingSection === 'preferences' ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preferences.newsletter"
                      checked={formData.preferences.newsletter}
                      onChange={handleInputChange}
                      className="mr-3 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Subscribe to newsletter</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preferences.email_notifications"
                      checked={formData.preferences.email_notifications}
                      onChange={handleInputChange}
                      className="mr-3 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Email notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preferences.sms_notifications"
                      checked={formData.preferences.sms_notifications}
                      onChange={handleInputChange}
                      className="mr-3 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <span className="text-gray-700">SMS notifications</span>
                  </label>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSave('preferences')}
                    disabled={saving}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Newsletter subscription</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    profile?.preferences?.newsletter ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile?.preferences?.newsletter ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Email notifications</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    profile?.preferences?.email_notifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile?.preferences?.email_notifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">SMS notifications</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    profile?.preferences?.sms_notifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile?.preferences?.sms_notifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile