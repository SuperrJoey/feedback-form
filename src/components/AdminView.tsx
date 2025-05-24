import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Heart, Star, Clock, User, MessageSquare, Trash2, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface FeedbackData {
  id: number
  name: string
  relationship: string
  mood: string
  message: string
  rating: number
  timestamp: string
}

export default function AdminView() {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([])
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('timestamp', { ascending: false })

      if (error) throw error
      setFeedbacks(data || [])
    } catch (err) {
      setError('Failed to fetch feedbacks')
      console.error('Error fetching feedbacks:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteFeedback = async (id: number) => {
    try {
      const { error } = await supabase
        .from('feedbacks')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setFeedbacks(feedbacks.filter(f => f.id !== id))
      setSelectedFeedback(null)
    } catch (err) {
      console.error('Error deleting feedback:', err)
    }
  }

  const exportFeedbacks = () => {
    const dataStr = JSON.stringify(feedbacks, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `feedbacks-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0
    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0)
    return (sum / feedbacks.length).toFixed(1)
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 relative overflow-hidden">
      {/* Background decorations - Hidden on mobile */}
      <div className="hidden md:block absolute top-10 right-10 text-4xl lg:text-6xl animate-pulse">📊</div>
      <div className="hidden md:block absolute top-20 left-20 text-3xl lg:text-4xl animate-pulse delay-300">💌</div>
      <div className="hidden md:block absolute bottom-20 right-20 text-4xl lg:text-5xl animate-pulse delay-700">📈</div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="flex justify-center items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <Heart className="text-pink-500 w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Feedback Dashboard
            </h1>
            <Heart className="text-pink-500 w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <p className="text-gray-600 text-base sm:text-lg px-2">
            All the love and feedback from your amazing friends! 💕
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {isLoading ? (
            <div className="col-span-3 text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading feedbacks...</p>
            </div>
          ) : error ? (
            <div className="col-span-3 text-center py-8">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchFeedbacks}
                className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-pink-400 to-pink-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8" />
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{feedbacks.length}</p>
                    <p className="text-pink-100 text-sm sm:text-base">Total Feedbacks</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8" />
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{getAverageRating()}</p>
                    <p className="text-yellow-100 text-sm sm:text-base">Average Rating</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg sm:col-span-1 col-span-1">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 sm:w-8 sm:h-8" />
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{new Set(feedbacks.map(f => f.name)).size}</p>
                    <p className="text-purple-100 text-sm sm:text-base">Unique People</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-3 sm:gap-4"
        >
          <Link
            to="/"
            className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Back to Form
          </Link>
          
          {feedbacks.length > 0 && (
            <button
              onClick={exportFeedbacks}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Export Feedbacks
            </button>
          )}
        </motion.div>

        {feedbacks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center bg-white/80 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-2xl"
          >
            <div className="text-4xl sm:text-5xl md:text-6xl mb-4">😢</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3 sm:mb-4">No Feedbacks Yet</h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Looks like no one has shared their thoughts yet. Share your form and start collecting love! 💕
            </p>
            <Link
              to="/"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
            >
              Go to Feedback Form
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Feedback List */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-3 sm:mb-4">All Feedbacks</h2>
              <AnimatePresence>
                {feedbacks.map((feedback, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedFeedback(feedback)}
                    className={`bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                      selectedFeedback === feedback ? 'ring-2 sm:ring-4 ring-purple-400' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-xl sm:text-2xl">{feedback.mood}</div>
                        <div>
                          <p className="font-bold text-purple-700 text-sm sm:text-base">{feedback.name}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{feedback.relationship}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(feedback.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-xs sm:text-sm line-clamp-2 mb-3">
                      {feedback.message}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="hidden sm:inline">{formatDate(feedback.timestamp)}</span>
                        <span className="sm:hidden">{new Date(feedback.timestamp).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteFeedback(feedback.id)
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Selected Feedback Detail */}
            <div className="xl:sticky xl:top-8">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-3 sm:mb-4">Feedback Details</h2>
              {selectedFeedback ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-2xl"
                >
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">{selectedFeedback.mood}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-purple-700">{selectedFeedback.name}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{selectedFeedback.relationship}</p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">Rating</label>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 sm:w-6 sm:h-6 ${
                              i < selectedFeedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-base sm:text-lg font-bold text-purple-700">
                          {selectedFeedback.rating}/5
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">Message</label>
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                        <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{selectedFeedback.message}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">Submitted</label>
                      <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                        <Clock className="w-4 h-4" />
                        <span className="hidden sm:inline">{formatDate(selectedFeedback.timestamp)}</span>
                        <span className="sm:hidden">{new Date(selectedFeedback.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg text-center">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">👈</div>
                  <p className="text-gray-600 text-sm sm:text-base">Click on a feedback to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 