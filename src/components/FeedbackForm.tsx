import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, Send } from 'lucide-react'

interface FeedbackData {
  name: string
  relationship: string
  mood: string
  message: string
  rating: number
  timestamp: string
}

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    mood: '',
    message: '',
    rating: 0
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const moods = ['😊', '😍', '😢', '😠', '🤔', '😴', '🤗', '😎']
  const relationships = ['Best Friend', 'Close Friend', 'Family', 'Colleague', 'Other']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const feedback: FeedbackData = {
      ...formData,
      timestamp: new Date().toISOString()
    }
    
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback)
      })

      if (!res.ok) {
        throw new Error('Failed to submit feedback')
      }

      setIsSubmitted(true)
      
      // Create floating hearts animation
      const newHearts = Array.from({ length: 10 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight
      }))
      setHearts(newHearts)
      setTimeout(() => setHearts([]), 3000)
    } catch (err) {
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ x: heart.x, y: heart.y, scale: 0 }}
            animate={{ 
              y: -100, 
              scale: [0, 1.5, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute text-pink-500 text-2xl sm:text-4xl pointer-events-none"
          >
            💕
          </motion.div>
        ))}
        
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
          className="text-center bg-white/90 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-3xl shadow-2xl max-w-md mx-4 w-full"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6"
          >
            💖
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-3 sm:mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Your feedback means the world to me! 🌟</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsSubmitted(false)
              setFormData({ name: '', relationship: '', mood: '', message: '', rating: 0 })
            }}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            Send Another Feedback 💌
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 relative overflow-hidden">
      {/* Background decorations - Hidden on mobile, scaled on tablet */}
      <div className="hidden sm:block absolute top-10 left-4 md:left-10 text-4xl md:text-6xl animate-bounce delay-0">🌸</div>
      <div className="hidden sm:block absolute top-20 right-4 md:right-20 text-3xl md:text-4xl animate-bounce delay-300">✨</div>
      <div className="hidden sm:block absolute bottom-20 left-4 md:left-20 text-4xl md:text-5xl animate-bounce delay-700">🦋</div>
      <div className="hidden sm:block absolute bottom-10 right-4 md:right-10 text-3xl md:text-4xl animate-bounce delay-1000">💫</div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="flex justify-center items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <Heart className="text-pink-500 w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent text-center">
              Feedback!
            </h1>
            <Heart className="text-pink-500 w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <p className="text-gray-600 text-base sm:text-lg px-2">
            Tell me what's on your mind! Your thoughts matter to me
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl space-y-4 sm:space-y-6"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            >
              {error}
            </motion.div>
          )}
          
          {/* Name Input */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="space-y-2"
          >
            <label className="block text-base sm:text-lg font-semibold text-purple-700">
              What should I call you? 🌟
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 sm:p-4 border-2 border-pink-200 rounded-xl sm:rounded-2xl focus:border-purple-400 focus:outline-none transition-all duration-300 text-base sm:text-lg"
              placeholder="Your name..."
            />
          </motion.div>

          {/* Relationship */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="space-y-2"
          >
            <label className="block text-base sm:text-lg font-semibold text-purple-700">
              How do you know me? 💫
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {relationships.map((rel) => (
                <motion.button
                  key={rel}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, relationship: rel })}
                  className={`p-2 sm:p-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm lg:text-base ${
                    formData.relationship === rel
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {rel}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Mood Selector */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="space-y-2"
          >
            <label className="block text-base sm:text-lg font-semibold text-purple-700">
              How are you feeling today? 🎭
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
              {moods.map((mood, index) => (
                <motion.button
                  key={index}
                  type="button"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFormData({ ...formData, mood })}
                  className={`p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl text-2xl sm:text-3xl md:text-4xl transition-all duration-300 ${
                    formData.mood === mood
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg transform rotate-12'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {mood}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Rating */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="space-y-2"
          >
            <label className="block text-base sm:text-lg font-semibold text-purple-700">
              Rate your overall experience with me! ⭐
            </label>
            <div className="flex justify-center gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRatingClick(star)}
                  className="text-3xl sm:text-4xl focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 sm:w-10 sm:h-10 ${
                      star <= formData.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="space-y-2"
          >
            <label className="block text-base sm:text-lg font-semibold text-purple-700">
              Tell me what's on your mind.🧠
            </label>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full p-3 sm:p-4 border-2 border-pink-200 rounded-xl sm:rounded-2xl focus:border-purple-400 focus:outline-none transition-all duration-300 text-base sm:text-lg resize-none"
              placeholder="Share your thoughts"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div className="text-center pt-2 sm:pt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
              className={`bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-2 sm:gap-3 mx-auto ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline">Send to Dev</span>
                  <span className="sm:hidden">Send Love</span>
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Admin Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 sm:mt-8"
        >

        </motion.div>
      </motion.div>
    </div>
  )
} 