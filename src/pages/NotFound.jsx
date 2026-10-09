import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-500 mb-6">Page not found.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}