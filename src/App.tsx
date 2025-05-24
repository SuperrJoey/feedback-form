import { Routes, Route } from 'react-router-dom'
import FeedbackForm from './components/FeedbackForm'
import AdminView from './components/AdminView'

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<FeedbackForm />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </div>
  )
}